
/*
 * Imports
 * -------
 */

// functions
import {
	mergeObjects,
	request,
	disableButtonLoader,
	urlEncode,
	imagesLoaded
} from '../../utils/utils';

/*
 * Load more content
 * -----------------
 */

export default class LoadMore {

 /*
	* Constructor
	* -----------
	*/

	constructor( args ) {

	 /*
		* Public variables
		* ----------------
		*/

		this.url = '';
		this.button = null;
		this.buttonContainer = null;
		this.loader = null;

		this.data = {};

		this.filters = [];
		this.filtersLoader = null;
		this.filtersForm = null;

		this.noResults = {
			containers: [],
			buttons: []
		};

		this.type = '';
		this.offset = 0;
		this.ajaxPpp = 0;
		this.total = 0;

		this.insertInto = null;
		this.insertLocation = 'beforeend';
		this.onInsert = () => {};
		this.afterInsert = () => {};

		this.changePushUrlParams = () => {};

	 /*
		* Internal variables
		* ------------------
		*/

		this._urlSupported = true;
		this._url = '';

		// merge default variables with args
		mergeObjects( this, args );

	 /*
		* Initialize
		* ----------
		*/

		let init = this._initialize();

		if( !init )
			return false;
	}

 /*
	* Initialize
	* ----------
	*/

	_initialize() {
		// check that required variables not null
		if( !this.url ||
				!this.button ||
				!this.loader ||
				!this.type ||
				!this.offset ||
				!this.total ||
				!this.insertInto )
				return false;

		// check if URL constructor supported
		if( typeof window.URL !== 'function' || 
				typeof URL.createObjectURL !== 'function' || 
				typeof URL.revokeObjectURL !== 'function' )
        this._urlSupported = false;

    if( this._urlSupported )
    	this._url = new URL( window.location );

		if( !this.buttonContainer )
			this.buttonContainer = this.button;

		// internal variables
		this._ogOffset = this.offset;

		this._data = {
			postCount: this.offset,
			offset: this._ogOffset,
			ppp: this.ajaxPpp ? this.ajaxPpp : this._ogOffset,
			total: this.total,
			type: this.type,
			filters: {}
		};

		// append public data
		for( let d in this.data )
			this._data[d] = this.data[d];

		// add event listeners
		this.button.addEventListener( 'click', this._load.bind( this ) );
		window.onpopstate = this._popState.bind( this );

		// set filters
		if( this.filters.length ) {
			this.filters.forEach( f => {
				let type = this._getType( f );

				if( type == 'listbox' ) {
					f.onChange( ( ff, val ) => {
						this._data.filters[ff.id] = {
							value: val
						};

						this._load( 'reset' );
					} );
				} else {
					let args = { currentTarget: f };

					if( type === 'search' ) {
						let submitSearchSelector = f.getAttribute( 'data-submit-selector' );

						if( submitSearchSelector ) {
							let submitSearch = document.querySelector( submitSearchSelector );

							if( submitSearch )
								submitSearch.addEventListener( 'click', () => {
									this._filter( args );
								} );
						}

						f.addEventListener( 'keydown', e => {
							let key = e.key || e.keyCode || e.which || e.code;

							if( [13, 'Enter'].indexOf( key ) !== -1 )
								this._filter( args );
						} );
					} else {
						f.addEventListener( 'change', this._filter.bind( this ) );
					}

					// init ( if selected add to data filter attribute )
					this._filter( args, 'init' );
				}
			} );
		}

		// back to all results
		if( this.noResults.buttons ) {
			this.noResults.buttons.forEach( b => {
				b.addEventListener( 'click', () => {
					this._data.filters = {};

					// clear filters
					if( this.filters.length ) {
						this.filters.forEach( f => {
							this._setFilter( f, 'null' );
						} );
					}

					this._load( 'reset-no-res' );
				} );
			} );
		}

		this._pushState( 'init', this.insertInto.innerHTML ); // push for intial state

		return true;
	}

 /*
	* Helpers
	* -------
	*/

	// when filters change reset offset, postCount and total
	_reset() {
		this._data.offset = 0;
		this._data.postCount = 0;
	}

	// get input type
	_getType( input ) {
		let type = '',
				loadMoreType = input.getAttribute( 'data-load-more-type' );

		if( !loadMoreType ) {
			if( input.type == 'listbox' ) {
				type = 'listbox';
			} else {
				type = input.tagName.toLowerCase();

				if( type === 'input' )
					type = input.type;
			}

			input.setAttribute( 'data-load-more-type', type );
		} else {
			type = loadMoreType;
		}

		return type;
	}

	// set filter input
	_setFilter( f, compareValue = undefined, state = 'default' ) { // if compareValue undefined than clear input
		let id = f.id,
				value = f.value,
				operator = f.getAttribute( 'data-operator' ),
				type = this._getType( f );

		if( type == 'radio' )
			id = f.name;

		if( state === 'init' ) {
			compareValue = 'null';
			
			switch( type ) {
				case 'checkbox':
					if( f.checked )
						compareValue = value;

					break;
				case 'radio':
					let r = Array.from( document.querySelectorAll( `[name="${ id }"]` ) );

					r.forEach( rr => {
						if( rr.checked )
							compareValue = rr.value;
					} );

					break;
				default:
					if( value )
						compareValue = value;
			}
		}

		let equalToCompareVal = value === compareValue;

		if( equalToCompareVal ) {
			// selected
			this._data.filters[id] = {
				value: value,
				operator: operator
			};
		}

		if( type == 'listbox' ) {
			if( !equalToCompareVal )
				f.clear();

			// if value...
		} else {
			switch( type ) {
				case 'checkbox':
				case 'radio':
					f.checked = equalToCompareVal;

					break;
				case 'select':
					let opts = Array.from( f.options );

					opts.forEach( o => {
						o.selected = o.value === compareValue;
					} );

					break;
				default:
					f.value = equalToCompareVal ? value : '';
			}
		}
	}

	// show / hide filter loader
	_showFilterLoader( show = true ) {
		if( !this.filtersLoader )
			return;

		if( show ) {
			this.filtersLoader.removeAttribute( 'data-hide' );
		} else {
			this.filtersLoader.setAttribute( 'data-hide', '' );
		}
	}

	// show / hide button
	_showButton() {
		// hide load more button if posts are greater than or equal to total post count
		if( this._data.postCount >= this._data.total ) {
			this.buttonContainer.style.display = 'none';
		} else {
			this.buttonContainer.style.display = 'block';
		}
	}

	// when no results ( filters )
	_noResults( show = true ) {
		// disable / enable filters
		if( this.filters.length ) {
			if( this.filtersForm )
				this.filtersForm.setAttribute( 'data-disabled', show ? 'true' : 'false' );

			this.filters.forEach( f => {
				let type = this._getType( f );

				if( type == 'listbox' ) {
					f.disable( show ? true : false );
				} else {
					f.disabled = show ? true : false;
					f.setAttribute( 'aria-disabled', show ? 'true' : 'false' );
				}
			} );
		}

		if( show ) 
			this.insertInto.innerHTML = '';

		// show nothing found message
		if( this.noResults.containers.length ) {
			this.noResults.containers.forEach( c => {
				c.style.display = show ? 'block' : 'none';
			} );
		}
	}

	// after response set vars / items
	_afterResponse( reset, rowCount, total, state = 'default', output = '' ) {
		this._data.postCount += rowCount;

		// get new total
		if( reset ) {
			this._data.offset = rowCount;
			this._data.total = total;
		}

		this._showButton();
		this._showFilterLoader( false );

		// history entry
		this._pushState( state, output );
	}

	// add url and data to browser history
	_pushState( state, output ) {
		let url = '',
				data = {
					data: this._data,
					state: state,
					html: output ? this.insertInto.innerHTML : ''
				};

		if( this._urlSupported && this._url && state !== 'init' ) {
			let urlParams = this.changePushUrlParams( state, this._data ); // object

			for( let u in urlParams ) {
				let v = urlParams[u];

				if( Array.isArray( v ) )
					v = JSON.stringify( v );

				if( v == 'load_more_delete_param' ) {
					this._url.searchParams.delete( u );
				} else {
					this._url.searchParams.set( u, v );
				}
			}

			url = this._url;
		}

		if( url ) {
			window.history.pushState( data, '', url );
		} else {
			window.history.pushState( data, '' );
		}
	}

	// add output to insertInto element
	_insertOutput( output = '', done = () => {} ) {
		let table = this.insertInto.tagName == 'TBODY',
				docFragment = document.createDocumentFragment(),
				div = document.createElement( table ? 'TBODY' : 'DIV' );

		div.innerHTML = output;

		let imgs = Array.from( div.getElementsByTagName( 'img' ) ),
				insertedItems = Array.from( div.children );

		imagesLoaded( imgs, data => {
			this.onInsert.call( this, insertedItems );

			if( table ) {
				insertedItems.forEach( item => {
					this.insertInto.appendChild( item );
				} );
			} else {
				insertedItems.forEach( item => {
					docFragment.appendChild( item );
				} );

				this.insertInto.appendChild( docFragment );
			}

			done();

			setTimeout( () => {
				this.afterInsert.call( this, insertedItems );
			}, 0 );
		} );
	}

 /*
	* Event handlers
	* --------------
	*/

	_filter( e, state = 'default' ) {
		let f = e.currentTarget,
				compareValue = f.value;

		this._setFilter( f, compareValue, state );

		if( state !== 'init' )
			this._load( 'reset' );
	}

	_popState( e ) {
		if( e.state ) {
			this._data = Object.assign( this._data, e.state.data );

			// output
			this._history = e.state.html;
			this._load( 'history' );

			if( this.filters.length ) {
				this.filters.forEach( f => {
					let id = f.id,
							type = this._getType( f );

					if( type == 'radio' )
						id = f.name;

					let compareValue = 'null';

					if( this._data.filters.hasOwnProperty( id ) )
						compareValue = this._data.filters[id].value;

					this._setFilter( f, compareValue );	
				} );
			}
		}
	}

	_load( e ) {
		if( e !== undefined && !( typeof e == 'string' || e instanceof String ) )
			e.preventDefault();

		// set states
		let state = 'default',
				reset = false;

		if( typeof e == 'string' || e instanceof String )
			state = e;

		if( e === 'reset' || e === 'reset-no-res' )
			reset = true;

		// reset
		if( reset ) {
			this._reset();
			this._showFilterLoader( true );
		}

		this._noResults( false );

		// disable button
		disableButtonLoader( this.button, this.loader, false, true );

		if( e == 'history' ) {
			// enable button
			disableButtonLoader( this.button, this.loader );

			this.insertInto.innerHTML = '';

			if( this._history ) {
				this._insertOutput( this._history );
			} else {
				this._noResults();
			}

			this._showButton();
			this._showFilterLoader( false );
		} else {
			// get data as url encoded string
			let encodedData = urlEncode( this._data );

			console.log( 'DATA', this._data );

			setTimeout( () => {
				// fetch more posts
				request( {
					method: 'POST',
					url: this.url,
					headers: { 'Content-type': 'application/x-www-form-urlencoded' },
					body: encodedData
				} )
				.then( response => {
					// enable button
					disableButtonLoader( this.button, this.loader );

					if( !response ) {
						if( reset )
							this._noResults();

						this._afterResponse( reset, 0, 0, state );

						return;
					}

					let result = JSON.parse( response ),
							rowCount = result.row_count,
							output = result.output,
							total = parseInt( result.total );

					console.log( 'RESULT', result );

					if( reset )
						this.insertInto.innerHTML = '';

					if( rowCount > 0 && output != '' ) {
						let o = this.ajaxPpp ? this.ajaxPpp : this._ogOffset;

						this._data.offset += o;

						this._insertOutput( output, () => {
							setTimeout( () => {
								this._afterResponse( reset, rowCount, total, state, output );
							}, 0 );
						} );
					} else {
						if( reset ) 
							this._noResults();

						this._afterResponse( reset, rowCount, total, state );
					}
				} )
				.catch( xhr => {
					console.log( 'ERROR', xhr );

					if( reset )
						this._noResults();

					// enable button
					disableButtonLoader( this.button, this.loader );

					this._showFilterLoader( false );
				} );
			}, 0 );
		}
	}

} // end LoadMore

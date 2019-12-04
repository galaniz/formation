
/*
 * Imports
 * -------
 */

// functions
import { 
	removeClass,
	addClass,
	mergeObjects, 
	request, 
	disableButtonLoader, 
	urlEncode,
	imagesLoaded
} from '../../utils/utils';

/*
 * Load posts / comments
 * ---------------------
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

        this.noResults = {
        	containers: [], 
        	buttons: []
        };

        this.type = null;
        this.offset = 0;
        this.decrement = false;
        this.total = 0;

        this.insertInto = null;
        this.insertLocation = 'beforeend';
        this.onInsert = () => {};
        this.afterInsert = () => {};

        // internal variables
        this._sameName = null;

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

		if( !this.buttonContainer )
			this.buttonContainer = this.button;

		// internal variables
		this._ogOffset = this.offset;

		this._data = {
            postCount: this.offset,
            offset: this._ogOffset,
            ppp: this._ogOffset,
            total: this.total,
            type: this.type,
            filters: {}
        };

        // append public data
        for( let d in this.data )
        	this._data[d] = this.data[d];

		// add event listeners
		this.button.addEventListener( 'click', this._load.bind( this ) );

		if( this.filters.length > 0 ) {
			this.filters.forEach( ( f ) => {
				if( f.type == 'listbox' ) {
					f.item.onChange( ( item, val ) => {
						this._data.filters[item.id] = {
							value: val
						};

						this._load( 'reset' );
					} );
				} else {
					f.item.addEventListener( 'change', this._filter.bind( this ) );
				}
			} );
		}

		// back to all results
		if( this.noResults.buttons ) {
			this.noResults.buttons.forEach( ( b ) => {
				b.addEventListener( 'click', () => {
					this._data.filters = {};

					// clear filters
					if( this.filters.length > 0 ) {
						this.filters.forEach( ( f ) => {
							if( f.type == 'listbox' ) {
								f.item.clear();
							} else {
								removeClass( f.item, '--inactive' );
								
								let type = this._getType( f.item );
							
								switch( type ) {
									case 'checkbox':
									case 'radio':
										f.item.checked = false;

										break;
									case 'select':
										let opts = Array.from( f.item.options );

										opts.forEach( ( o ) => {
											let s = false;

											if( o.defaultSelected )
												s = true;

											o.selected = s;
										} );

										break;
									default:
										f.item.value = '';
								}
							}
						} );
					}

					this._load( 'reset-no-res' );
				} );
			} );
		} 
	
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

	_getType( input ) {
		let type = input.tagName.toLowerCase();

		if( type === 'input' ) 
			type = input.type;

		return type;
	}

	_showFilterLoader( show = true, delay = false ) {
		if( !this.filtersLoader ) 
			return;

		if( show ) {
			let d = delay ? 600 : 0;

			setTimeout( () => {
				removeClass( this.filtersLoader, '--hide' );
			}, d );
		} else {
			addClass( this.filtersLoader, '--hide' );
		}
	}

	// when no results ( filters )
	_noResults( show = true ) {
		// disable / enable filters
		if( this.filters.length > 0 ) {
			this.filters.forEach( ( f ) => {
				if( f.type == 'listbox' ) {
					f.item.disable( show ? true : false );
				} else {
					f.item.disabled = show ? true : false;
					f.item.setAttribute( 'aria-disabled', show ? 'true' : 'false' );
				}
			} );
		}

		// show nothing found message
        if( this.noResults.containers.length > 0 ) {
        	this.noResults.containers.forEach( ( c ) => {
        		c.style.display = show ? 'block' : 'none';
        	} );
        }
	}

	// after response set vars / items
	_afterResponse( reset, rowCount, total ) {
		this._data.postCount += rowCount;

        // get new total 
        if( reset ) {
        	this._data.offset = rowCount;
        	this._data.total = total;
        }

        // hide load more button if posts are greater than or equal to total post count
        if( this._data.postCount >= this._data.total ) {
        	this.buttonContainer.style.display = 'none';
        } else {
        	this.buttonContainer.style.display = 'block';
        }

        this._showFilterLoader( false );
	}

   /*
	* Event handlers
	* --------------
	*/

	_filter( e ) {
		let item = e.currentTarget,
			id = item.id,
			value = item.value,
			operator = item.getAttribute( 'data-operator' ),
			type = this._getType( item );

		// if radio and not checked give inactive
		if( type == 'radio' ) {
			if( !this._sameName )
				this._sameName = Array.from( document.getElementsByName( item.name ) );

			if( this._sameName ) {
				this._sameName.forEach( ( s ) => {
					let inactive = true;

					if( item.checked && s == item )
						inactive = false;

					if( inactive ) {
						addClass( s, '--inactive' );
					} else {
						removeClass( s, '--inactive' );
					}
				} );
			}
		}

		this._data.filters[id] = {
			value: item.value,
			operator: operator
		};

		this._load( 'reset' );
	}

	_load( e ) {
		let reset = false;

		if( e !== undefined ) {
			if( e !== 'reset' && e !== 'reset-no-res' ) {
				e.preventDefault();
			} else {
				reset = true;
			}
		}

		if( reset ) {
			this._reset();
			this._showFilterLoader( true, e == 'reset' ? true : false );
		}

		this._noResults( false );

		// disable button
		disableButtonLoader( this.button, this.loader, '--hide', false, true );

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
		    	console.log( 'RESPONSE', response );

		        // enable button
				disableButtonLoader( this.button, this.loader, '--hide', true );

				if( !response ) {
					if( reset )
		        		this._noResults();

		        	this._afterResponse( reset, rowCount, total );

		        	return;
				}
		    
		        let result = JSON.parse( response ),
		        	rowCount = result.row_count,
		        	output = result.output,
		        	total = parseInt( result.total );

		        if( reset ) 
		        	this.insertInto.innerHTML = '';

		        if( rowCount > 0 && output != '' ) {
		        	let o = this._ogOffset;

		        	if( this.decrement ) {
		        		this._data.offset -= o;
		        	} else {
		        		this._data.offset += o;
		        	}

		        	let table = this.insertInto.tagName == 'TBODY',
		        		docFragment = document.createDocumentFragment(),
		        		div = document.createElement( table ? 'TBODY' : 'DIV' );

	        		div.innerHTML = output;

	        		let imgs = Array.from( div.getElementsByTagName( 'img' ) ),
	        			insertedItems = Array.from( div.children );

	        		imagesLoaded( imgs, ( data ) => {
	        			this.onInsert.call( this, insertedItems );

	        			if( table ) {
	        				insertedItems.forEach( ( item ) => {
		        				this.insertInto.appendChild( item );
		        			} );
	        			} else {
	        				insertedItems.forEach( ( item ) => {
		        				docFragment.appendChild( item );
		        			} );

		        			this.insertInto.appendChild( docFragment );
	        			}

	        			setTimeout( () => {
	        				this._afterResponse( reset, rowCount, total );
	        				this.afterInsert.call( this, insertedItems );
	        			}, 0 );
		        	} );
		        } else {
		        	if( reset )
		        		this._noResults();

		        	this._afterResponse( reset, rowCount, total );
		        }
		    } )
		    .catch( xhr => {
	            console.log( 'ERROR', xhr );

	            if( reset )
		        	this._noResults();

		       	// enable button
				disableButtonLoader( this.button, this.loader, '--hide', true );

				this._showFilterLoader( false );
		    } );
    	}, 1200 );
	}

} // end LoadMore

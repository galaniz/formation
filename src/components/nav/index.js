
/*
 * Imports
 * -------
 */

import {
	mergeObjects,
	cascade,
	toggleFocusability
} from '../../utils';

/*
 * Opens and closes nav
 * --------------------
 */

export default class Nav {

 /*
	* Constructor
	* -----------
	*/

	constructor( args ) {

	 /*
		* Public variables
		* ----------------
		*/

		this.nav = null;
		this.list = null; // or array
		this.overflow = null;
		this.overflowList = null; // or array
		this.items = null;
		this.itemSelector = '';
		this.button = null;
		this.overlay = null;
		this.transition = null;
		this.overflowHiddenClass = 'u-o-h';
		this.onSet = () => {};
		this.onReset = () => {};
		this.afterReset = () => {};
		this.onResize = () => {};
		this.onToggle = () => {};
		this.endToggle = () => {};
		this.done = () => {};
		this.delay = {
			open: 200,
			close: 200
		};

		// merge default variables with args
		mergeObjects( this, args );

		this.isOverflowing = false;

	 /*
		* Internal variables ( more set in init method )
		* ---------------------------------------------
		*/

		this._html = document.documentElement;
		this._viewportWidth = window.innerWidth;

		// escape key for closing nav
		this._esc = [27, 'Escape'];

		// put items into groups
		this._overflowGroups = {};
		this._overflowGroupsLength = 0;

		this._listIndexes = {};

		// store groups currently overflown
		this._currentOverflowGroups = [];

		// store focusable elements outside nav
		this._focusableItems = [];

		// for throttling resize event
		this._resizeTimer;

		// store if nav is open
		this._navOpen = false;

	 /*
		* Initialize
		* ----------
		*/

		let init = this._initialize();

		if( !init ) {
			this.done.call( this );
			return false;
		}
	}

 /*
	* Initialize
	* ----------
	*/

	_initialize() {
		// check that required variables not null
		let error = false,
				required = [
					'nav',
					'list',
					'overflow',
					'overflowList',
					'items',
					'itemSelector',
					'button'
				];

		required.forEach( ( r ) => {
			if( !this[r] ) {
				error = true;
				return;
			}
		} );

		if( error )
			return false;

		/* Convert list(s) and overflow list(s) to arrays */

		this.list = !Array.isArray( this.list ) ? [this.list] : this.list;
		this.overflowList = !Array.isArray( this.overflowList ) ? [this.overflowList] : this.overflowList;

		this.items = Array.from( this.items );

		if( !this.items.length ) 
			return false;

    /* Get focusable elements */

    let focusSelector = 'a, area, input, select, textarea, button, [tabindex], iframe',
    		navFocusableItems = Array.from( this.nav.querySelectorAll( focusSelector ) );

    if( navFocusableItems.length ) {
    	this._focusableItems = Array.from( document.querySelectorAll( focusSelector ) );

    	this._focusableItems = this._focusableItems.filter( item => {
    		if( navFocusableItems.indexOf( item ) == -1 )
    			return true;

    		return false;
    	} );
    }

		/* Event listeners */

		this._clickHandler = this._click.bind( this );
		this._keyDownHandler = this._keyDown.bind( this );
		this._resizeHandler = this._resize.bind( this );

		this.button.addEventListener( 'click', this._clickHandler );
		this.nav.addEventListener( 'keydown', this._keyDownHandler );

		if( this.overlay )
			this.overlay.addEventListener( 'click', this._clickHandler );

		window.addEventListener( 'resize', this._resizeHandler );

		// set up overflow groups
		this.items.forEach( ( item, index ) => {
			let overflowGroupIndex = parseInt( item.getAttribute( 'data-overflow-group' ) ),
					listIndex = 0;

			if( !item.hasAttribute( 'data-list-index' ) ) {
				item.setAttribute( 'data-list-index', listIndex );
			} else {
				listIndex = parseInt( item.getAttribute( 'data-list-index' ) );
			}

			if( isNaN( overflowGroupIndex ) )
				overflowGroupIndex = index;

			if( !this._overflowGroups.hasOwnProperty( overflowGroupIndex ) ) {
				this._overflowGroups[overflowGroupIndex] = [];
				this._listIndexes[overflowGroupIndex] = [];
				this._overflowGroupsLength++;
			}

			this._overflowGroups[overflowGroupIndex].push( item );

			if( this._listIndexes[overflowGroupIndex].indexOf( listIndex ) == -1 )
				this._listIndexes[overflowGroupIndex].push( listIndex );
		} );

		window.addEventListener( 'load', () => {
			// set up nav
			this._setNav( () => {
				this.done.call( this );
			} );
		} );

		return true;
	}

	/*
	 * Helper methods for setting up nav
	 * ---------------------------------
	 */

	 // return overflowing items to list
	_resetNav() {
		this.onReset.call( this );

		this.nav.removeAttribute( 'data-overflow' );
		this.nav.removeAttribute( 'data-overflow-all' );

		this._lastOverflowFocus = null;

		if( this._currentOverflowGroups.length > 0 ) {
			let frag = {},
					appendFrag = true,
					listIndexes = [];

			for( let overflowGroupIndex in this._listIndexes ) {
				this._listIndexes[overflowGroupIndex].forEach( ( index ) => {
					frag[index] = document.createDocumentFragment();
				} );
			}

			this.items.forEach( ( item, i ) => {
				let listIndex = parseInt( item.getAttribute( 'data-list-index' ) );

				// insert at specific index
				if( item.hasAttribute( 'data-index' ) ) {
					appendFrag = false;

					let index = parseInt( item.getAttribute( 'data-index' ) ),
							refNode = this.list[listIndex].children[index];

					this.list[listIndex].insertBefore( item, refNode );
				} else { // insert
					frag[listIndex].appendChild( item );
				}

				if( listIndexes.indexOf( listIndex ) === -1 )
					listIndexes.push( listIndex );
			} );

			// append overflowing items
			if( appendFrag ) {
				listIndexes.forEach( ( listIndex ) => {
					this.list[listIndex].appendChild( frag[listIndex] );
				} );
			}
		}

		for( let overflowGroupIndex in this._listIndexes ) {
			this._listIndexes[overflowGroupIndex].forEach( ( index ) => {
				this.overflowList[index].innerHTML = '';
			} );
		}

		this._currentOverflowGroups = [];
	}

	// if overflowing transfer items over to overflow element
	_setNav( done ) {
		this._resetNav();
		this.afterReset.call( this );

		let overflowGroupIndex = 0,
				lastOverflowGroupIndex = 0,
				frag = {},
				overflow = this._overflowing( this._listIndexes[overflowGroupIndex] ),
				ogOverflow = overflow;

		this._listIndexes[overflowGroupIndex].forEach( ( index ) => {
			frag[index] = document.createDocumentFragment();
		} );

		this.isOverflowing = ogOverflow;
		this.button.style.display = 'block';

		while( overflow ) {
			let overflowGroup = this._overflowGroups[overflowGroupIndex];

			overflowGroup.forEach( ( item ) => {
				let listIndex = parseInt( item.getAttribute( 'data-list-index') );
				
				frag[listIndex].appendChild( item );
			} );

			this._currentOverflowGroups.push( overflowGroup );

			overflowGroupIndex++;
			overflow = this._overflowing( this._listIndexes[overflowGroupIndex] );

			if( overflow )
				lastOverflowGroupIndex = overflowGroupIndex;
		}

		this._listIndexes[lastOverflowGroupIndex].forEach( ( index ) => {
			this.overflowList[index].appendChild( frag[index] );
		} );

		if( this._currentOverflowGroups.length > 0 ) {
			if( !this.nav.hasAttribute( 'data-overflow' ) )
				this.nav.setAttribute( 'data-overflow', '' );

			if( this._currentOverflowGroups.length === this._overflowGroupsLength ) {
				if( !this.nav.hasAttribute( 'data-overflow-all' ) )
					this.nav.setAttribute( 'data-overflow-all', '' );
			}
		} else {
			this._toggle( true );
		}

		this.onSet.call( this );

		this.button.style.display = '';

		if( done !== undefined )
			done.call( this );
	}

	// check if items are overflowing / wrapping into new line
	_overflowing( listIndexes = [0] ) {
		let overflow = false;

		listIndexes.forEach( ( index ) => {
			let items = this.list[index].querySelectorAll( this.itemSelector ),
					itemsLength = items.length;

			// all items are in overflow element now
			if( itemsLength === 0 ) {
				overflow = false;
				return;
			}

			let firstItemOffset = items[0].offsetTop;

			// reverse loop to start from last item
			for( let i = itemsLength - 1; i >= 0; i-- ) {
				if( items[i].offsetTop > firstItemOffset ) {
					overflow = true;
					return;
				}
			}
		} );

		return overflow;
	}

 /*
	* Prevent scroll when open mobile navigation
	* ------------------------------------------
	*/

	_disableScroll( disable = true ) {
		if( disable ) {
			this._html.classList.add( this.overflowHiddenClass );
		} else {
			this._html.classList.remove( this.overflowHiddenClass );
		}
	}

 /*
	* Open / close mobile navigation
	* ------------------------------
	*/

	_toggle( close = true ) {
		this.onToggle.call( this );

		this._navOpen = !close;

		toggleFocusability( !this._navOpen, this._focusableItems );

		if( close === false ) {
			cascade( [
				{
					action: () => {
						this.button.setAttribute( 'data-show', '' );

						this._disableScroll();

						this.button.setAttribute( 'aria-expanded', 'true' );
						this.nav.setAttribute( 'data-open', '' );

						if( this.transition )
							this.transition.setAttribute( 'data-show', '' );
					}
				},
				{
					action: () => {
						this.overflow.setAttribute( 'data-show', '' );
					},
					delay: this.delay.open
				},
				{
					action: () => {
						this.overflow.setAttribute( 'data-show-items', '' );
					}
				}
			] );
		} else {
			cascade( [
				{
					action: () => {
						this.overflow.removeAttribute( 'data-show-items' );
					}
				},
				{
					action: () => {
						this.button.removeAttribute( 'data-show' );
						this.overflow.removeAttribute( 'data-show' );

						if( this.transition )
							this.transition.removeAttribute( 'data-show' );
					},
					delay: this.delay.close
				},
				{
					action: () => {
						this.nav.removeAttribute( 'data-open' );

						this._disableScroll( false );
						this.button.setAttribute( 'aria-expanded', 'false' );
					}
				},
				{
					action: () => {
						this.endToggle.call( this );
					}
				}
			] );
		}
	}

 /*
	* Event Handlers
	* --------------
	*/

	/* When click on button / overlay */

	_click( e ) {
		e.preventDefault();

		this._toggle( this._navOpen );
	}

	/* If hit escape while nav open close */

	_keyDown( e ) {
		let key = e.key || e.keyCode || e.which || e.code;

		if( this._esc.indexOf( key ) !== -1 )
			this._toggle();
	}

	/* Viewport resize */

	_resize() {
		// throttles resize event
		clearTimeout( this._resizeTimer );

		this._resizeTimer = setTimeout( () => {
			let viewportWidth = window.innerWidth;

			if( viewportWidth != this._viewportWidth ) {
				this._viewportWidth = viewportWidth;
			} else {
				return;
			}

			this._setNav();
			this.onResize.call( this );
		}, 100 );
	}

 /*
	* Public methods
	* --------------
	*/

	addFocusableItem( item ) {
		if( !item )
			return;

		this._focusableItems.push( item );
	}

} // end Nav

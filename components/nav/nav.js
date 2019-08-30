
/*
 * Imports
 * -------
 */

import { 
	addClass, 
	hasClass, 
	removeClass, 
	mergeObjects, 
	cascade, 
	prefix, 
} from '../../utils/utils';

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
        this.list = null;
        this.overflow = null;
        this.overflowList = null;
        this.items = null;
        this.links = null;
        this.button = null;
        this.overlay = null;
        this.transition = null;
        this.checkOverflow = () => {};
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

       /*
        * Internal variables ( more set in init method )
        * ---------------------------------------------
        */

        this._body = document.body;

        this._viewportWidth = window.innerWidth;
        this._viewportHeight = window.innerHeight;

        // escape key for closing nav
    	this._esc = [27, 'Escape'];

        // put items into groups 
        this._overflowGroups = {};
      	this._overflowGroupsLength = 0;

        // store groups currently overflown
        this._currentOverflowGroups = [];

        // store last focusable element in overflow list
        this._lastOverflowFocus = null;

		// for throttling resize event
        this._resizeTimer;

        // store if nav is open
        this._navOpen = false;

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
		let error = false,
			required = [
				'nav', 
				'list', 
				'overflow',
				'overflowList',
				'items', 
				'links',
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

		this.items = Array.from( this.items );
		this.links = Array.from( this.links );

		/* Event listeners */ 

		this.button.addEventListener( 'click', this._clickHandler.bind( this ) );
		this.nav.addEventListener( 'keydown', this._keyDownHandler.bind( this ) );
		this.overflowList.addEventListener( 'focusout', this._listFocusHandler.bind( this ) );

		if( this.overlay )
			this.overlay.addEventListener( 'click', this._clickHandler.bind( this ) );
		
		window.addEventListener( 'resize', this._resizeHandler.bind( this ) );

		// set up overflow groups
		this.items.forEach( ( item, index ) => {
			let overflowGroupIndex = parseInt( item.getAttribute( 'data-overflow-group' ) );

			if( isNaN( overflowGroupIndex ) )
				overflowGroupIndex = index;

			if( !this._overflowGroups.hasOwnProperty( overflowGroupIndex ) ) {
				this._overflowGroups[overflowGroupIndex] = [];
				this._overflowGroupsLength++;
			}

			this._overflowGroups[overflowGroupIndex].push( item );
		} );

		// set up nav
		this._setNav( () => {
			this.done.call( this );
		} );

		return true;
	}

	/*
	 * Helper methods for setting up nav
	 * ---------------------------------
	 */

	 // return overflowing items to list
	_resetNav() {
		removeClass( this.nav, '--overflow' );
		removeClass( this.nav, '--overflow-all' );

		this._lastOverflowFocus = null;

		if( this._currentOverflowGroups.length > 0 ) {
			let frag = document.createDocumentFragment();

			this.items.forEach( ( item ) => {
				frag.appendChild( item );
			} );

			// append overflowing items
			this.list.appendChild( frag );
		}

		this.overflowList.innerHTML = '';
		this._currentOverflowGroups = [];
	}

	// if overflowing transfer items over to overflow element
	_setNav( done ) {
		this._resetNav();

		let overflowGroupIndex = 0,
			frag = document.createDocumentFragment(),
			overflow = this._overflowing(),
			ogOverflow = overflow;

		this.button.style.display = 'block';

		while( overflow ) {
			let overflowGroup = this._overflowGroups[overflowGroupIndex];

			overflowGroup.forEach( ( item ) => {
				frag.appendChild( item );
			} );

			this._currentOverflowGroups.push( overflowGroup );

			overflowGroupIndex++;
			overflow = this._overflowing();

			if( !overflow ) {
				// get last child in list
				let lastChild = overflowGroup[overflowGroup.length - 1],
					descendents = lastChild.getElementsByTagName( '*' );

				// reverse loop through descendents to find last focusable element
				for( let i = descendents.length - 1; i >= 0; i-- ) {
					let d = descendents[i];

					if( d.tagName === 'A' || d.tagName === 'BUTTON' ) {
						this._lastOverflowFocus = d;
						break;
					}
				}
			}
		}

		this.overflowList.appendChild( frag );

		if( this._currentOverflowGroups.length > 0 ) {
			if( !hasClass( this.nav, '--overflow' ) )
				addClass( this.nav, '--overflow' );

			if( this._currentOverflowGroups.length === this._overflowGroupsLength ) {
				if( !hasClass( this.nav, '--overflow-all' ) )
					addClass( this.nav, '--overflow-all' );
			}
		} else {
			this._toggle( true, false );
		}

		this.checkOverflow( ogOverflow );

		this.button.style.display = '';

		if( done ) 
			done();
	}

	// check if items are overflowing / wrapping into new line 
	_overflowing() {
		let items = this.list.children,
			itemsLength = items.length;

		// all items are in overflow element now
		if( itemsLength === 0 )
			return false;

		let buffer = 10,
			firstItemOffset = items[0].offsetTop + buffer;
		
		// reverse loop to start from last item
		for( let i = itemsLength - 1; i >= 0; i-- ) {
			if( items[i].offsetTop > firstItemOffset ) 
				return true;
		}

		return false;		
	}

	/*
	 * Prevent body scroll when open mobile navigation
	 * -----------------------------------------------
	 */

	_disableBodyScroll( disable = true ) {
		if( disable ) {
			addClass( this._body, 'u-overflow-hidden' );
		} else {
			removeClass( this._body, 'u-overflow-hidden' );
		}
	}

	/*
	 * Open / close mobile navigation
	 * ------------------------------
	 */

	_toggle( close = true, setNavOpen = true ) {
		this.onToggle();

		this._navOpen = !close; 

		if( close === false ) {
			cascade( [
				{
					action: () => {
						addClass( this.button, '--show' );

						this._disableBodyScroll();
						this.button.setAttribute( 'aria-expanded', 'true' );

						addClass( this.nav, '--open' );

						if( this.transition )
							addClass( this.transition, '--show' );
					}
				},
				{
					action: () => {
						addClass( this.overflow, '--show' );
					},
					delay: this.delay.open
				},
				{
					action: () => {
						addClass( this.overflow, '--show-items' );
					}
				}
			] );
		} else {
			cascade( [
				{
					action: () => {
						removeClass( this.overflow, '--show-items' );
					}
				},
				{
					action: () => {
						removeClass( this.button, '--show' );
						removeClass( this.overflow, '--show' );

						if( this.transition )
							removeClass( this.transition, '--show' );
					},
					delay: this.delay.close
				},
				{
					action: () => {
						removeClass( this.nav, '--open' );

						this._disableBodyScroll( false );
						this.button.setAttribute( 'aria-expanded', 'false' ); 
					}
				},
				{
					action: () => {
						this.endToggle();
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

	_clickHandler( e ) {
		e.preventDefault();
		this._toggle( this._navOpen );
	}

	/* If hit escape while nav open close */

	_keyDownHandler( e ) {
		let key = e.key || e.keyCode || e.which || e.code;
        
        if( this._esc.indexOf( key ) !== -1 )
        	this._toggle();
	}

	/* Last element focus close nav */

	_listFocusHandler( e ) {
		if( e.target === this._lastOverflowFocus )
			this._toggle();
	}

	/* Viewport resize */

	_resizeHandler() {
		// throttles resize event
        clearTimeout( this._resizeTimer );

        this._resizeTimer = setTimeout( () => {
        	let viewportWidth = window.innerWidth;

			this._viewportHeight = window.innerHeight;

            if( viewportWidth != this._viewportWidth ) {
                this._viewportWidth = viewportWidth;
            } else {
                return;
            }

            this._setNav();
            this.onResize();
        }, 100 );
	}

} // end Nav

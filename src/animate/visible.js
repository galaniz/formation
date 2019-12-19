
/*
 * Imports
 * -------
 */

import {
	addClass,
	hasClass,
	removeClass,
	prefix,
	mergeObjects,
	getScrollY,
	subscribe
} from '../utils/utils';

/*
 * Monitor when item is visible in viewport
 * ----------------------------------------
 */

export default class Visible {

   /*
	* Constructor
	* -----------
	*/

	constructor( args ) {

       /*
        * Public variables
        * ----------------
        */

        this.item = null;
        this.visibleItem = null;
        this.visibleTop = false;
        this.visibleOffset = 0;
        this.classes = [];
        this.delay = 0;
        this.wait = '';
        this.sticky = false;
        this.stickyOffset = 0;
        this.stickyDelay = 0;
        this.allowUnset = false;
        this.visAll = false;
        this.onVisible = () => {};
        this.endVisible = () => {};
        this.onInit = () => {};

    	this.parallax = {
	    	rate: 0.2,
	    	x: 0,
	    	y: 0,
	    	z: 0
	    };

        this.breakpoints = {
        	min: 0,
        	max: 99999
        };

        // merge default variables with args
        mergeObjects( this, args );

        if( !args.hasOwnProperty( 'parallax' ) )
        	this.parallax = false;

       /*
        * Internal variables
        * ------------------
        */

        // check if already initialized
        this._initDone = false;

        // check if requestanimationframe supported
        this._requestAnimationSupported = window.hasOwnProperty( 'requestAnimationFrame' );

        // for scroll event
        this._scrollY = 0;
        this._lastScrollY = 0;
        this._parallaxScrollY = null;

        // for throttling resize event
        this._resizeTimer;

        // for resizing only on x axis
        this._viewportWidth = window.innerWidth;

        // for checking if item visible
        this._viewportHeight = window.innerHeight;

        // offset / dimensions info for item
        this._rect = {
        	top: 0,
        	bottom: 0,
        	height: 0
        };

        // if sticky get height of item
        this._stickyItemHeight = 0;

        // classes to add when visible
        this._classes = [ '--vis' + ( this.visAll ? ' --vis-all' : '' ) ].concat( this.classes );
        this._classes = this._classes.join( ' ' );

       /*
        * Initialize
        * ----------
        */

        let init = this._initialize();

        if( !init )
        	return false;
	}

   /*
	* Internal methods
	* ----------------
	*/

	_initialize() {
		// check required item not null
		if( !this.item ) {
			return false;
		} else {
			if( this._withinBreakpoints() )
				this._setItemRect();
		}

		if( this.parallax )
			// make sure item doesn't have transition
			prefix( 'transition', this.item, 'none' );


		if( !this.wait ) {
			this._eventListeners();
			this._scrollHandler();
		} else {
			subscribe( this.wait, () => {
				this._eventListeners();
				this._scrollHandler();
			} );
		}

		if( !this._initDone ) {
			this.onInit();
			this._initDone = true;
		}

		// init successful
		return true;
	}

	_eventListeners() {
		window.addEventListener( 'scroll', this._scrollHandler.bind( this ) );
		window.addEventListener( 'resize', this._resizeHandler.bind( this ) );
	}

	_withinBreakpoints() {
		return ( this._viewportWidth > this.breakpoints.min && this._viewportWidth < this.breakpoints.max );
	}

	_setItemRect() {
		let visibleItem = this.visibleItem ? this.visibleItem : this.item,
			rect = visibleItem.getBoundingClientRect();

		this._scrollY = getScrollY();

		this._rect = {
			// top: visibleItem.offsetTop,
			top: rect.top + this._scrollY,
			bottom: rect.bottom + this._scrollY,
			height: rect.height
		};

		if( this.sticky ) {
			this._stickyItemHeight = this.item.clientHeight;
			console.log( this._rect );
		}
	}

	_set() {
		if( !hasClass( this.item, this._classes ) ) {
			addClass( this.item, this._classes );
			this.onVisible();
		}

		if( this.parallax && this._requestAnimationSupported )
			requestAnimationFrame( this._parallax.bind( this ) );
    }

    _unset() {
    	if( hasClass( this.item, this._classes ) ) {
			removeClass( this.item, this._classes );
			this.endVisible();
		}

    	if( this.sticky ) {
    		removeClass( this.item, '--top --bottom --sticky' );
    	}

    	/*if( this.parallax )
    		prefix( 'transform', this.item, '' );*/
    }

	_parallax() {
		let scrollAmount = this._scrollY - ( this._rect.top > this._viewportHeight ? this._rect.top : 0 ),
			percentageMoved = ( ( scrollAmount / this._viewportHeight ) * this._rect.height ),
			transformY = Math.round( percentageMoved * ( this._viewportHeight / this._rect.height ) * this.parallax.rate );

		this.parallax.y = transformY;

		prefix( 'transform', this.item, `translate3d( ${ this.parallax.x }, ${ transformY }px, ${ this.parallax.z } )` );
    }

	_visible() {
		if( this.visibleTop ) {
			return ( ( this._scrollY >= this._rect.top - this.visibleOffset ) && this._scrollY <= this._rect.bottom - this.visibleOffset );
		} else {
			return ( ( this._scrollY + this._viewportHeight >= this._rect.top ) && this._scrollY <= this._rect.bottom );
		}
	}

    _stickyVisible() {
    	return (
			( this._scrollY >= this._rect.top - this.stickyOffset ) &&
			( this._scrollY <= this._rect.bottom - ( this._stickyItemHeight + this.stickyOffset ) )
		);
    }

   /*
    * Event handlers
    * --------------
    */

	_scrollHandler() {
		this._scrollY = getScrollY();

		if( this._withinBreakpoints() ) {
			if( this._visible( this._scrollY ) ) {

				if( this._parallaxScrollY === null )
					this._parallaxScrollY = this._scrollY;

				let delay = this.delay;

				setTimeout( () => {
					this._set();
				}, delay );
			} else {
				this._parallaxScrollY = null;

				if( this.allowUnset )
					this._unset();
			}

			if( this.sticky ) {
				if( this._stickyVisible() ) {
					removeClass( this.item, '--top --bottom' );
					addClass( this.item, '--sticky' );
				} else {
					let stickyDelay = 0;

					// reached bottom limit
					if( this._scrollY > this._rect.bottom - ( this._stickyItemHeight + this.stickyOffset ) ) {
						addClass( this.item, '--bottom' );
						stickyDelay = this.stickyDelay;
					}

					setTimeout( () => {
						removeClass( this.item, '--sticky' );
					}, stickyDelay );

					// reached the top limit
					if( this._scrollY < this._rect.top - this.stickyOffset ) {
						addClass( this.item, '--top' );
					}
				}
			}
		} else {
			this._unset();
		}

		this._lastScrollY = this._scrollY;
	}

	_resizeHandler() {
        // throttles resize event
        clearTimeout( this._resizeTimer );

        this._resizeTimer = setTimeout( () => {
        	let viewportWidth = window.innerWidth;

            if( viewportWidth != this._viewportWidth ) {
                this._viewportWidth = viewportWidth;
            } else {
            	// on touch devices changing height of viewport on scroll
            	if( !this.sticky )
            		return;
            }

        	if( this._withinBreakpoints() ) {
        		this._viewportHeight = window.innerHeight;
            	this._setItemRect();
            	// this._scrollHandler();

            	// on touch devices changing height of viewport on scroll
            	if( this.sticky || this.parallax !== false )
            		this._scrollHandler();
        	} else {
        		this._unset();
        	}
        }, 100 );
    }

} // end Visible

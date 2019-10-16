
/*
 * Imports
 * -------
 */

import {
	addClass, 
	removeClass,
	mergeObjects
} from '../../utils/utils';

/*
 * Base slider ( to create fade / carousel sliders )
 * -----------
 */

export default class BaseSlider {

   /*
	* Constructor
	* -----------
	*/

	constructor( args = {} ) {
		
       /*
        * Public variables
        * ----------------
        */

        this.slider = null;
        this.items = null;
        this.loop = false;
        this.autoplay = false;
        this.autoplaySpeed = 8000;
        this.prev = null;
        this.next = null;
        this.nav = null;
        this.navItemClass = '';
        this.currentIndex = 0;

       /*
        * Internal variables
        * ------------------
        */

        this._lastIndex = 0;

        this._autoStart = 0;
        this._goToAutoplay = this._goToAuto.bind( this );

        this._pause = false;
        this._requestId;

        this._navItems = [];
        this._navItemsLen = 0;

        // for key events
        this._KEYS = {
			ArrowLeft: 'LEFT',
			37: 'LEFT',
			ArrowRight: 'RIGHT',
			39: 'RIGHT',
			Home: 'HOME',
			36: 'HOME',
			End: 'END',
			35: 'END'
		};

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
		// check for required
		if( !this.slider || !this.items )
			return false;

		this.items = Array.from( this.items );

		this._lastIndex = this.items.length - 1;

		/* Create navigation dots */

		if( this.nav && this.navItemClass ) {
			let navItems = Array.from( this.nav.querySelectorAll( '.' + this.navItemClass ) );

			const setupNavItem = ( item = null, i = 0, classes = '' ) => {
				let active = i == this.currentIndex ? true : false,
					setClass = classes ? true : false;

				if( active )
					classes += ' --active';

				if( setClass ) {
					item.setAttribute( 'class', classes );
				} else {
					addClass( item, classes );
				}
				
				item.setAttribute( 'data-index', i );
				item.addEventListener( 'click', this._nav.bind( this ) );

				this._navItems.push( item );
			};

			if( !navItems ) {
				navItems = document.createDocumentFragment();

				for( let i = 0; i < this.items.length; i++ ) {
					let navItem = document.createElement( 'button' );

					navItem.type = 'button';
					navItem.textContent = i;

					setupNavItem( navItem, i, this.navItemClass );

					navItems.appendChild( navItem );
				}

				this.nav.appendChild( navItems );
			} else {
				navItems.forEach( ( item, i ) => {
					setupNavItem( item, i );
				} );
			}

			this._navItemsLen = this._navItems.length;
		}

		/* Prev / next navigation */

		if( this.prev )
			this.prev.addEventListener( 'click', this._prev.bind( this ) );

		if( this.next )
			this.next.addEventListener( 'click', this._next.bind( this ) );

		/* Auto play event listeners and animations */

		if( this.autoplay ) {
			if( this._autoplayDurationsLen == 0 ) {
				this.slider.addEventListener( 'mouseenter', () => {
					this._pause = true;
				} );

				this.slider.addEventListener( 'mouseleave', () => {
					this._pause = false;

					// restart animation
					window.requestAnimationFrame( this._goToAutoplay );
				} );
			}

			// check when window inactive
			window.addEventListener( 'blur', () => {
				this._pause = true;
			} );

			window.addEventListener( 'focus', () => {
				this._pause = false;

				// restart animation
				window.requestAnimationFrame( this._goToAutoplay );
			} );

			window.requestAnimationFrame( this._goToAutoplay );
		}

		/* Keyboard navigation */

		this.slider.tabIndex = 0;
		this.slider.addEventListener( 'keydown', this._keyNav.bind( this ) );

		return true;
	}

   /*
	* Helpers
	* -------
	*/

	_getPrevIndex( index ) {
		let prevIndex = index - 1;

		if( index <= 0 )
			prevIndex = this.loop ? this._lastIndex : 0;

		return prevIndex;
	}

	_getNextIndex( index ) {
		let nextIndex = index + 1;

		if( index >= this._lastIndex )
			nextIndex = this.loop ? 0 : this._lastIndex;

		return nextIndex;
	}

	_setNav( index = null, lastIndex = null ) {
		if( this._navItemsLen ) {
			if( index !== null && lastIndex !== null ) {
				removeClass( this._navItems[lastIndex], '--active' );
				addClass( this._navItems[index], '--active' );
			}
		}	

		if( this.prev ) {
			let disable = false;

			if( index <= 0 )
				disable = true;

			this.prev.disabled = disable;
		}

		if( this.next ) {
			let disable = false;

			if( index >= this._lastIndex  )
				disable = true;

			this.next.disabled = disable;
		}
	}

	_doGoTo( index ) {
		if( index < 0 )
			index = this.loop ? this._lastIndex : 0;

		if( index > this._lastIndex )
			index = this.loop ? 0 : this._lastIndex;
		
		let lastIndex = this.currentIndex;

		/* Set nav items / prev next buttons */

		this._setNav( index, lastIndex );

		/* Set current */

		this.currentIndex = index;

		return lastIndex;
	}

   /*
	* Go to slide
	* -----------
	*/

	_goTo( index, init = false ) {
		if( index === undefined || index === null )
			return;

		this._doGoTo( index );
	}

	_goToAuto( now ) {
		// cancel animation
	    if( this._pause ) {
	        if( this._requestId ) {
	            window.cancelAnimationFrame( this._requestId );
	            this._requestId = false;
	            this._autoStart = 0;
	            return;
	        }
	    }

		if( !this._autoStart ) 
			this._autoStart = now;

		let progress = now - this._autoStart,
			timeFraction = progress / this.autoplaySpeed;

		if( timeFraction >= 1 ) {
			this._goTo( this.currentIndex + 1 );

			// start timer again
			this._autoStart = now;
		}

		this._requestId = window.requestAnimationFrame( this._goToAutoplay );
	}

   /*
	* Event callbacks
	* ---------------
	*/

	_nav( e ) {
		e.preventDefault();
		this._goTo( parseInt( e.currentTarget.getAttribute( 'data-index' ) ) );
	}

	_keyNav( e ) {
		let key = e.key || e.keyCode || e.which || e.code,
			index = null;

		switch( this._KEYS[key] ) {
			case 'LEFT':
				index = this.currentIndex - 1;
				break;
			case 'RIGHT':
				index = this.currentIndex + 1;
				break;
			case 'HOME':
				index = 0;
				break;
			case 'END':
				index = this._lastIndex;
				break;
		}

		if( index !== null ) {
			this._goTo( index );
		}
	}

	_prev( e ) {
		e.preventDefault();
		this._goTo( this.currentIndex - 1 );
	}

	_next( e ) {
		e.preventDefault();
		this._goTo( this.currentIndex + 1 );
	}

   /*
	* Public methods
	* ---------------
	*/

	goTo( index ) {
		this._goTo( index );
	}

} // end BaseSlider

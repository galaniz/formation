
/*
 * Imports
 * -------
 */

import {
	addClass, 
	removeClass,
	prefix, 
	mergeObjects
} from '../../utils';

/*
 * Slider that fades in and out
 * ----------------------------
 */

export default class FadeSlider {

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
        this.transitionDuration = 500;
        this.autoplay = false;
        this.autoplaySpeed = 8000;
        this.prev = null;
        this.next = null;
        this.nav = null;
        this.submit = null;
       	this.disabledIndexes = [];
       	this.overlayItems = false;
       	this.wait = ( index, callback ) => { return callback() };

       /*
        * Internal variables
        * ------------------
        */

        this._currentIndex = 0;
        this._lastIndex = 0;

        this._autoStart = 0;
        this._goToAutoplay = this._goToAuto.bind( this );

        this._pause = false;
        this._requestId;

        this._dots = [];
        this._dotsLen = 0;

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

		this._lastIndex = this.items.length - 1;

		// create navigation dots
		if( this.nav ) {
			let dots = document.createDocumentFragment();

			for( let i = 0; i < this.items.length; i++ ) {
				let active = i == this._currentIndex ? true : false,
					classes = 'o-fade-slider__dot';

				if( active )
					classes += ' --active';

				let dot = document.createElement( 'button' );

				dot.type = 'button';
				dot.textContent = i;
				dot.dataIndex = i;

				dot.setAttribute( 'class', classes );
				dot.setAttribute( 'data-index', i );
				dot.addEventListener( 'click', this._nav.bind( this ) );

				dots.appendChild( dot );

				this._dots.push( dot );
			}

			this._dotsLen = this._dots.length;
			this.nav.appendChild( dots );
		}

		// prev / next navigation
		if( this.prev )
			this.prev.addEventListener( 'click', this._prev.bind( this ) );

		if( this.next )
			this.next.addEventListener( 'click', this._next.bind( this ) );

		// submit
		if( this.submit )
			this.submit.addEventListener( 'click', this._submit.bind( this ) );

		// auto play event listeners and animations
		if( this.autoplay ) {
			this.slider.addEventListener( 'mouseenter', () => {
				this._pause = true;
			} );

			this.slider.addEventListener( 'mouseleave', () => {
				this._pause = false;

				// restart animation
				window.requestAnimationFrame( this._goToAutoplay );
			} );

			window.requestAnimationFrame( this._goToAutoplay );
		}

		// overlay items on top of each other 
		if( this.overlayItems ) {
			this.items.forEach( ( item, i ) => {
				prefix( 'transform', item, `translate( -${ i * 100 }% )` );
			} );
		}

		// keyboard navigation 
		this.slider.addEventListener( 'keydown', this._keyNav.bind( this ) );

		// init
		this._goTo( this._currentIndex, true );

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
		if( this._dotsLen ) {
			if( index !== null && lastIndex !== null ) {
				removeClass( this._dots[lastIndex], '--active' );
				addClass( this._dots[index], '--active' );
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

		if( this.submit ) {
			let disable = true;

			if( index === this._lastIndex )
				disable = false;

			this.submit.disabled = disable;
		}
	}

	_doGoTo( index ) {
		// peace out if disabled
		if( this.disabledIndexes.indexOf( this._currentIndex ) !== -1 ) 
			return;

		if( index < 0 )
			index = this.loop ? this._lastIndex : 0;

		if( index > this._lastIndex )
			index = this.loop ? 0 : this._lastIndex;

		let lastIndex = this._currentIndex;

		// set nav dots / prev next buttons
		this._setNav( index, lastIndex );

		this.items[lastIndex].style.opacity = 1;
		
		removeClass( this.items[this._currentIndex], '--active' );
		addClass( this.items[index], '--active' );

		// fade without flash of background
		setTimeout( () => {
			this.items[lastIndex].style.opacity = '';
		}, this.transitionDuration );

		this._currentIndex = index;
	}

   /*
	* Go to slide
	* -----------
	*/

	_goTo( index, init = false ) {
		if( index === undefined || index === null )
			return;

		if( init ) {
			this._doGoTo( index );
		} else {
			let last = this._currentIndex === this._lastIndex && index === this._lastIndex ? true : false;

			console.log('GOTO', this._currentIndex, index, this._lastIndex, last);

			this.wait( this._currentIndex, index, last, () => {
				this._doGoTo( index );
			} );
		}
	}

	_goToAuto( now ) {
		// cancel animation
	    if( this._pause ) {
	        if( this._requestId ) {
	            window.cancelAnimationFrame( this._requestId );
	            this._requestId = false;
	            this._autoStart = false;
	            return;
	        }
	    }

		if( !this._autoStart ) 
			this._autoStart = now;

		let progress = now - this._autoStart,
			timeFraction = progress / this.autoplaySpeed;

		if( timeFraction >= 1 ) {
			this._goTo( this._currentIndex + 1 );

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
		this._goTo( parseInt( e.target.getAttribute( 'data-index' ) ) );
	}

	_keyNav( e ) {
		let key = e.key || e.keyCode || e.which || e.code,
			index = null;

		switch( this._KEYS[key] ) {
			case 'LEFT':
				index = this._currentIndex - 1;
				break;
			case 'RIGHT':
				index = this._currentIndex + 1;
				break;
			case 'HOME':
				index = 0;
				break;
			case 'END':
				index = this._lastIndex;
				break;
		}

		console.log('KEY', key, index);

		if( index !== null ) {
			this._goTo( index );
		}
	}

	_prev( e ) {
		e.preventDefault();
		this._goTo( this._currentIndex - 1 );
	}

	_next( e ) {
		e.preventDefault();
		this._goTo( this._currentIndex + 1 );
	}

	_submit( e ) {
		e.preventDefault();
		this._goTo( this._currentIndex );
	}

   /*
	* Public methods
	* ---------------
	*/

	disableIndex( i = null, disable = true ) {
		if( i === null )
			return;

		let index = this.disabledIndexes.indexOf( i );

		if( disable ) {
			// check that index not already in array
			if( index === -1 )
				this.disabledIndexes.push( i );
		} else {
			// check that index exists 
			if( index !== -1 ) {
				this.disabledIndexes.splice( index, 1 );
			}
		}
	}

	goTo( index ) {
		this._goTo( index );
	}

} // end FadeSlider

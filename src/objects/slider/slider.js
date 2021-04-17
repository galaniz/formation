
/*
 * Imports
 * -------
 */

import { prefix } from '../../utils/utils';

import BaseSlider from './base-slider';

/*
 * Slider 
 * ------
 *
 * Based on Siema: https://github.com/pawelgrzybek/siema
 *
 */

export default class Slider extends BaseSlider {

 /*
	* Constructor
	* -----------
	*/

	constructor( args = {} ) {

	 /*
		* Base variables & init
		* ---------------------
		*/

		super( args );

	 /*
		* Public variables
		* ----------------
		*/

		let childDefaults = {
			easing: 'ease',
			duration: 500,
			padding: {},
			center: false,
			linkClick: () => {},
			endMove: () => {},
			onResize: () => {}
		};

		for( let prop in childDefaults ) {
			this[prop] = args.hasOwnProperty( prop ) ? args[prop] : childDefaults[prop];
		}

	 /*
		* Internal variables
		* ------------------
		*/

		/* Keep track pointer hold and dragging distance */

		this._pointerDown = false;

		this._drag = {
			startX: 0,
			endX: 0,
			startY: 0,
			currentX: 0,
			maxX: 0,
			minX: 0,
			threshold: 0,
			letItGo: null,
			preventClick: false
		};

		/* Dimensions */

		this._sliderWidth = 0;
		this._itemWidth = 0;
		this._padding = 0;

		/* Resize */

		this._resizeTimer;

		/* Links */

		this._links = Array.from( this.slider.querySelectorAll( 'a' ) );

	 /*
		* Set up
		* ------
		*/

		this._setDimensions();
		this._setUpNav();

		if( !( this.items.length - this._perPage ) )
			return;

		this.slider.style.cursor = '-webkit-grab';
		this.slider.style.touchAction = 'pan-y pinch-zoom';
		this.slider.tabIndex = '0';

		prefix( 'transform', this.slider, 'translate3d( 0, 0, 0 )' );
		prefix( 'transformOrigin', this.slider, '0 0' );

	 /*
		* Events
		* ------
		*/

		/* Bind all event handlers for referencability */

		[
			'resizeHandler', 
			'touchstartHandler', 
			'touchendHandler', 
			'touchmoveHandler', 
			'mousedownHandler', 
			'mouseupHandler', 
			'mouseleaveHandler', 
			'mousemoveHandler', 
			'clickHandler'
		].forEach( method => {
			this[`_${ method }`] = this[`_${ method }`].bind( this );
		} );

		/* Resize */

		window.addEventListener( 'resize', this._resizeHandler );

		/* Touch */

		this.slider.addEventListener( 'touchstart', this._touchstartHandler );
		this.slider.addEventListener( 'touchend', this._touchendHandler );
		this.slider.addEventListener( 'touchmove', this._touchmoveHandler );

		/* Mouse */

		this.slider.addEventListener( 'mousedown', this._mousedownHandler );
		this.slider.addEventListener( 'mouseup', this._mouseupHandler );
		this.slider.addEventListener( 'mouseleave', this._mouseleaveHandler );
		this.slider.addEventListener( 'mousemove', this._mousemoveHandler );

		/* Click */

		this.slider.addEventListener( 'click', this._clickHandler );

		/* Init */

		this._goTo( this.currentIndex, true );
	}

 /*
	* Parent methods
	* --------------
	*/

	_doGoTo( index ) {
		super._doGoTo( index );
		this._move();
	}

 /*
	* Helpers
	* -------
	*/

	_setWidths( set = true ) {
		this.slider.style.width = set ? ( this._itemWidth * this.items.length ) + 'px' : '';

		this.items.forEach( ( item ) => {
			item.style.width = set ? this._itemWidth + 'px' : '';
		} );
	}

	_setDimensions() {
		this._setWidths( false );

		this._sliderWidth = this.slider.clientWidth;
		this._itemWidth = this.items[0].clientWidth;

		this._setWidths( true );

		// set padding
		this._resolveObject( '_padding', 'padding' );

		// set slides per page
		this._perPage = Math.round( this._sliderWidth / this._itemWidth );

		this._drag.maxX = ( this._itemWidth * this.items.length ) - this._sliderWidth + ( this._padding );
		this._drag.minX = this._padding;

		this._drag.threshold = this._itemWidth / 3;
	 } 

	_resolveObject( setKey, getKey ) {
		let viewportWidth = window.innerWidth;
		this[setKey] = 0;

		for( let viewport in this[getKey] ) {
			if( viewportWidth >= viewport ) {
				this[setKey] = this[getKey][viewport];
			}
		}
	}

	_disableTransition() {
		prefix( 'transition', this.slider, `all 0ms ${ this.easing }` );
	}
	
	_enableTransition() {
		prefix( 'transition', this.slider, `all ${ this.duration }ms ${ this.easing }` );
	}

	/* Prevent dragging / swiping on inputs, selects and textareas */

	_ignore( e ) {
		let ignore = ['TEXTAREA', 'OPTION', 'INPUT', 'SELECT'].indexOf( e.target.nodeName ) !== -1;

		if( ignore )
			return true;

		return false;
	}

	/* On drag check if link to prevent */

	_isLink( target ) {
		if( target === null || target === undefined )
			return false;

		let isLink = target.nodeName === 'A';

		if( !isLink ) {
			let t = target,
					counter = 0,
					max = 20;

			while( !isLink ) {
				t = t.parentElement;

				if( t === null || t === undefined ) {
					isLink = false;
					break;
				}

				isLink = t.nodeName === 'A';
				counter++;

				if( counter === max ) {
					isLink = false;
					break;
				}
			}

			if( !isLink) {
				t = target;
				counter = 0;
				max = 20;

				while( !isLink ) {
					t = t.firstChildElement;

					if( t === null || t === undefined ) {
						isLink = false;
							break;
					}

					isLink = t.nodeName === 'A';
					counter++;

					if( counter === max ) {
						isLink = false;
						break;
					}
				}
			}
		}

		return isLink;
	}

	/* Clear drag after touchend and mouseup event */

	_clearDrag() {
		this._drag.startX = 0;
		this._drag.endX = 0;
		this._drag.startY = 0;
		this._drag.letItGo = null;
	}

 /*
	* Move ( nav click, after drag )
	* ------------------------------
	*/

	_move( drag = false ) {

		/* Get move state if dragging */

		let ogIndex = this.currentIndex;

		if( drag ) {
			let dragOffset = this._drag.startX - this._drag.endX;

			if( Math.abs( dragOffset ) > this._drag.threshold ) {	
				let slideNumber = Math.ceil( Math.abs( dragOffset ) / this._itemWidth );

				if( dragOffset > 0 ) {
					this.currentIndex += slideNumber;
				} else {
					this.currentIndex -= slideNumber;
				}
			} else {
				this.currentIndex = this.currentIndex;
			}

			if( this.currentIndex < 0 )
				this.currentIndex = 0;

			if( this.currentIndex > this._lastIndex )
				this.currentIndex = this._lastIndex;
		}

		/* Add transition to slider */

		this._enableTransition();

		/* Transform slider */

		let transform = -( ( this.currentIndex * this._itemWidth ) - this._padding );

		if( transform > this._drag.minX )
			transform = this._drag.minX;

		if( transform < -( this._drag.maxX ) )
			transform = -( this._drag.maxX );

		prefix( 'transform', this.slider, `translate3d( ${ transform }px, 0, 0 )` );

		/* Save x position */

		this._drag.currentX = transform;

		/* Set nav buttons */

		this._setNav( this.currentIndex, ogIndex );

		this.endMove(); 
	}

 /*
	* Drag ( mousemove, touchmove )
	* -----------------------------
	*/

	_dragging() {
		let dragOffset = ( this._drag.startX - this._drag.endX ),
				transform = this._drag.currentX - dragOffset,
				friction = ( ( Math.abs( dragOffset ) / this._drag.maxX ) / this._perPage ) * this._itemWidth;

		if( transform > this._drag.minX )
			transform = this._drag.minX + friction;

		if( transform < -( this._drag.maxX ) )
			transform = -( this._drag.maxX + friction );

		prefix( 'transform', this.slider, `translate3d( ${ transform }px, 0, 0 )` );
	}

	/*
	 * Event callbacks
	 * ---------------
	 */

	/* Touch */
	
	_touchstartHandler( e ) {
		if( this._ignore( e ) ) 
			return;

		e.stopPropagation();

		this._disableTransition();

		this._pointerDown = true;
		this._drag.startX = e.touches[0].pageX;
		this._drag.startY = e.touches[0].pageY;
	}
	
	_touchendHandler( e ) {
		e.stopPropagation();
		this._pointerDown = false;
		
		if( this._drag.endX )
			this._move( true );

		this._clearDrag();
	}

	_touchmoveHandler( e ) {
		e.stopPropagation();

		if( this._drag.letItGo === null )
			this._drag.letItGo = Math.abs( this._drag.startY - e.touches[0].pageY ) < Math.abs( this._drag.startX - e.touches[0].pageX );

		if( this._pointerDown && this._drag.letItGo ) {
			e.preventDefault();
			this._drag.endX = e.touches[0].pageX;

			this._dragging();
		}
	}

	/* Mouse */

	_mousedownHandler( e ) {
		if( this._ignore( e ) ) 
			return;

		e.stopPropagation();
		e.preventDefault();

		this._disableTransition();

		this._pointerDown = true;
		this._drag.startX = e.pageX;
	}

	_mouseupHandler( e ) {
		e.stopPropagation();
		this._pointerDown = false;
		this.slider.style.cursor = '-webkit-grab';
		
		if( this._drag.endX ) 
			this._move( true );

		this._clearDrag();
	}

	_mousemoveHandler( e ) {
		e.preventDefault();
		
		if( this._pointerDown ) {

			/* 
				Dragged element is a link
				preventClick prop true
				detemine browser redirection later
			*/

			let isLink = this._isLink( e.target );

			if( isLink ) {
				this._drag.preventClick = true;
				this.linkClick( true );
			} else {
				this.linkClick( false );
			}

			this._drag.endX = e.pageX;
			this.slider.style.cursor = '-webkit-grabbing';
			
			this._dragging();
		}
	}

	_mouseleaveHandler( e ) {
		if( this._pointerDown ) {
			this._pointerDown = false;
			this.slider.style.cursor = '-webkit-grab';
			this._drag.endX = e.pageX;
			this._drag.preventClick = false;
			this._move( true );
			this._clearDrag();
		}
	}

	/* Click */
	
	_clickHandler( e ) {
		/* 
			Dragged element is a link 
			prevent browsers from folowing the link
		*/

		if( this._drag.preventClick )
			e.preventDefault();

		this._drag.preventClick = false;
	}

	/* Resize */

	_resizeHandler() {
		// throttles resize event
		clearTimeout( this._resizeTimer );

		this._resizeTimer = setTimeout( () => {
			this._setDimensions();
			this._setUpNav( true );
			this._goTo( this.currentIndex, true );
			this.onResize();
		}, 100 );
	}

} // end Slider

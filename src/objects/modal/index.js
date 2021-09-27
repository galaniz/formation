
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
 * Open / close modals
 * -------------------
 */

export default class Modal {

 /*
	* Constructor
	* -----------
	*/

	constructor( args ) {

 /*
	* Public variables
	* ----------------
	*/

	this.modal = null;
	this.window = null;
	this.overlay = null;
	this.trigger = null;
	this.close = null;
	this.scaleTransition = false;
	this.scaleTransitionDelay = 300;
	this.bodyOverflowHiddenClass = 'u-o-h';
	this.onToggle = () => {};

	// merge default variables with args
	mergeObjects( this, args );

 /*
	* Internal variables
	* ------------------
	*/

	// for key events
	this._KEYS = {
		9: 'TAB',
		Tab: 'TAB',
		27: 'ESC',
		Escape: 'ESC'
	};

	// for giving focus to right elements
	this._focusableItems = [];
	this._firstFocusableItem = null;
	this._lastFocusableItem = null;

	// track modal state
	this._open = false;

	// to prevent body scroll
	this._body = document.body;

	// for throttling resize event
	this._resizeTimer;

	this._viewportWidth = window.innerWidth;
	this._viewportHeight = window.innerHeight;

	this._matrix = {
		open: {
			sX: 1,
			sY: 1,
			tX: 0,
			tY: 0,
		},
		close: {
			sX: 1,
			sY: 1,
			tX: 0,
			tY: 0
		}
	};

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
		if( !this.modal || !this.window || !this.trigger || !this.close )
			return false;

		if( this.scaleTransition && !this.window )
			return false;

		if( this.scaleTransition ) {
			this._windowWidth = this.window.clientWidth;
			this._windowHeight = this.window.clientHeight;
		}

		// check if open
		if( this.modal.getAttribute( 'aria-hidden' ) == 'false' )
			this._toggle( true );

		// add event listeners
		this.modal.addEventListener( 'keydown', this._keyHandler.bind( this ) );
		this.trigger.addEventListener( 'click', this._openHandler.bind( this ) );
		this.close.addEventListener( 'click', this._closeHandler.bind( this ) );

		if( this.overlay )
			this.overlay.addEventListener( 'click', this._closeHandler.bind( this ) );

		window.addEventListener( 'resize', this._resizeHandler.bind( this ) );

		// get focusable elements in modal
		this._focusableItems = Array.from( this.window.querySelectorAll( 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]' ) );
		this._focusableItemsLength = this._focusableItems.length;

		this._firstFocusableItem = this._focusableItems[0];
		this._lastFocusableItem = this._focusableItems[this._focusableItemsLength - 1];

		return true;
	}

 /*
	* Internal helpers
	* ----------------
	*/

	_setMatrix() {
		let triggerRect = this.trigger.getBoundingClientRect(),
				xScale = triggerRect.width / this._windowWidth,
				yScale = triggerRect.height / this._windowHeight;

		this._matrix = {
			open: {
				sX: 1,
				sY: 1,
				tX: this._windowWidth < this._viewportWidth ? ( this._viewportWidth - this._windowWidth ) / 2 : 0,
				tY: this._windowHeight < this._viewportHeight ? ( this._viewportHeight - this._windowHeight ) / 2 : 0,
			},
			close: {
				sX: triggerRect.width / this._windowWidth,
				sY: triggerRect.height / this._windowHeight,
				tX: triggerRect.left,
				tY: triggerRect.top
			}
		};
	}

	_setTransforms() {
		if( this.scaleTransition ) {
			let prop = this._open ? 'open' : 'close',
					sX = this._matrix[prop].sX,
					sY = this._matrix[prop].sY,
					tX = this._matrix[prop].tX,
					tY = this._matrix[prop].tY;

			prefix( 'transform', this.window, `matrix( ${ sX }, 0, 0, ${ sY }, ${ tX }, ${ tY } )` );
		}
	}

	// handle classes / transforms to open / close
	_toggle( open = true ) {
		this._open = open;
		this.modal.setAttribute( 'aria-hidden', !open );

		if( open ) {
			this._firstFocusableItem.focus();
			addClass( this._body, this.bodyOverflowHiddenClass );
		} else {
			this.trigger.focus();
			removeClass( this._body, this.bodyOverflowHiddenClass );
		}

		if( this.scaleTransition ) {
			if( !open )
				this.modal.removeAttribute( 'data-window-open' );

			setTimeout( () => {
				this._setTransforms();
			}, !open ? this.scaleTransitionDelay : 0 );

			if( open ) {
				setTimeout( () => {
					this.modal.setAttribute( 'data-window-open', '' );
				}, open ? this.scaleTransitionDelay : 0 );
			}
		}

		this.onToggle( open );
	}

	_handleBackwardTab( e ) {
		if( document.activeElement === this._firstFocusableItem ) {
			e.preventDefault();
			this._lastFocusableItem.focus();
		}
	}

	_handleForwardTab( e ) {
		if( document.activeElement === this._lastFocusableItem ) {
			e.preventDefault();
			this._firstFocusableItem.focus();
		}
	}

 /*
	* Event callbacks
	* ---------------
	*/

	_keyHandler( e ) {
		let key = e.keyCode || e.which || e.code || e.key;

		switch( this._KEYS[key] ) {
		case 'TAB':
			if( this._focusableItemsLength === 1 ) {
				e.preventDefault();
				break;
			}

			// keep focus in modal
			if( e.shiftKey ) {
				this._handleBackwardTab( e );
			} else {
				this._handleForwardTab( e );
			}

		break;
		case 'ESC':
			this._toggle( false );
			break;
		}
	}

	_openHandler( e ) {
		this._toggle( true );
	}

	_closeHandler( e ) {
		this._toggle( false );
	}

	_resizeHandler() {
		// throttles resize event
		clearTimeout( this._resizeTimer );

		this._resizeTimer = setTimeout( () => {
			if( this.scaleTransition ) {
				this._viewportWidth = window.innerWidth;
				this._viewportHeight = window.innerHeight;

				this._windowWidth = this.window.clientWidth;
				this._windowHeight = this.window.clientHeight;

				this._setMatrix();
				this._setTransforms();
			} 
		}, 100 );
	}

} // end Modal

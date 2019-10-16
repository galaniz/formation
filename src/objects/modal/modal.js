
/*
 * Imports
 * -------
 */

import {
	addClass, 
	removeClass, 
	getScrollY,
	prefix,
	publish,
	mergeObjects
} from '../../utils/utils';

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
        this.trigger = null;
        this.window = null;
        this.overlay = null;
        this.close = null;
        this.scaleTransition = false;
        this.scaleTransitionDelay = 300;
        this.startOpen = false;
        this.onClose = () => {};
        
        // merge default variables with args
        mergeObjects( this, args );

       /*
        * Internal variables
        * ------------------
        */

        // keep track if open or not
        this._open = this.startOpen;

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
		if( !this.modal || !this.window || !this.trigger || !this.overlay || !this.close )
			return false;

		if( this.scaleTransition && !this.window )
			return false;

        // for centering window
        this._windowWidth = this.window.clientWidth;
        this._windowHeight = this.window.clientHeight;

		// add event listeners
		this.trigger.addEventListener( 'click', this._openHandler.bind( this ) );
		this.overlay.addEventListener( 'click', this._closeHandler.bind( this ) );
		this.close.addEventListener( 'click', this._closeHandler.bind( this ) );

		window.addEventListener( 'resize', this._resizeHandler.bind( this ) );

		// scale window to size and offset of trigger
    	if( this.scaleTransition ) {
        	this._setMatrix();
        	this._setTransforms();
    	} else {
    		this._verticallyCenter();
    	}
		
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

		console.log( 'MATRIX', this._matrix );
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

	_verticallyCenter() {
		if( this._windowHeight < this._viewportHeight ) {
			addClass( this.window, '--center' );
		} else {
			removeClass( this.window, '--center' );
		}
	}

	// handle classes / transforms to open / close
	_toggle( open = true ) {
		this._open = open;

		if( open ) {
			addClass( this.modal, '--open' );
			addClass( this._body, 'u-overflow-hidden' );
		} else {
			removeClass( this.modal, '--open' );
			removeClass( this._body, 'u-overflow-hidden' );
		}

		if( this.scaleTransition ) {
			if( !open )
				removeClass( this.modal, '--w-open' );

			setTimeout( () => {
				this._setTransforms();
			}, !open ? this.scaleTransitionDelay : 0 );

			if( open ) {
				setTimeout( () => {
					addClass( this.modal, '--w-open' );
				}, open ? this.scaleTransitionDelay : 0 );
			}
		}

		this.onClose( open );
		publish( 'closeModal', [this.modal] );
	}

   /*
	* Event callbacks
	* ---------------
	*/
	
	_openHandler( e ) {
		e.preventDefault();
		this._toggle( true );
	}

	_closeHandler( e ) {
		e.preventDefault();
		this._toggle( false );
	}

	_resizeHandler() {
        // throttles resize event
        clearTimeout( this._resizeTimer );

        this._resizeTimer = setTimeout( () => {
        	this._viewportWidth = window.innerWidth;
        	this._viewportHeight = window.innerHeight;

			this._windowWidth = this.window.clientWidth;
			this._windowHeight = this.window.clientHeight;

        	if( this.scaleTransition ) {
            	this._setMatrix();
            	this._setTransforms();
        	} else {
        		this._verticallyCenter();
        	}
        }, 100 );
    }

} // end Modal

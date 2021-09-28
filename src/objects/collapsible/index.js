
/*
 * Imports
 * -------
 */

import { mergeObjects, subscribe } from '../../utils';

/*
 * Collapse height of specified element by trigger elements
 * --------------------------------------------------------
 */

export default class Collapsible {

 /*
	* Constructor
	* -----------
	*/

	constructor( args ) {

	 /*
		* Public variables
		* ----------------
		*/

		// items
		this.container = null;
		this.collapsible = null;
		this.trigger = null;
		this.closeOnLastBlur = false;
		this.accordianInstances = [];
		this.startOpen = false;
		this.resize = true;

		// merge default variables with args
		mergeObjects( this, args );

	 /*
		* Internal variables
		* ------------------
		*/

		// for resize event
		this._resizeTimer;
		this._viewportWidth = window.innerWidth;

		// track height
		this._collapsibleHeight = 0;

		// used in set method
		this._set = true;

		// keep track of state
		this._open = false;

		// for this.closeOnLastBlur
		this._focusableItems = [];
		this._tabbing = false;

		subscribe( 'tabState', t => {
			this._tabbing = t[0];
		} );

	 /*
		* Initialize
		* ----------
		*/

		let init = this._initialize();

		if( !init ) {
			return false;
		} else {
			return true;
		}
	}

 /*
	* Initialize
	* ----------
	*/

	_initialize() {
		// check that required items exist
		if( !this.collapsible || !this.trigger )
			return false;

    // get focusable elements
    this._focusableItems = Array.from( this.container.querySelectorAll( 'a, area, input, select, textarea, button, [tabindex], iframe' ) );

    if( this.closeOnLastBlur ) {
      this._blurHandler = this._blur.bind( this );
      document.addEventListener( 'focusout', this._blurHandler );
    }

		// event listeners
		this._triggerHandler = this._trigger.bind( this );
		this._resizeHandler = this._resize.bind( this );

		this.trigger.addEventListener( 'click', this._triggerHandler );

		window.addEventListener( 'resize', this._resizeHandler.bind( this ) );

		window.addEventListener( 'load', () => {
			this._setCollapsibleHeight();
			this._toggleCollapsible( this.startOpen );
			this._setContainer();
		} );

		return true;
	}

 /*
	* Internal helpers
	* ----------------
	*/

	_setContainer() {
		if( !this.container )
			return;

		if( this._set ) {
			this.container.setAttribute( 'data-set', '' );
		} else {
			this.container.removeAttribute( 'data-set' );
		}
	}

	_setCollapsibleHeight() {
		this.collapsible.style.height = 'auto';

		if( !this._set )
			return;

		this._collapsibleHeight = this.collapsible.clientHeight;
	}

	_toggleCollapsible( open = true, source = '' ) {
		if( !this._set )
			return;

		this._open = open;
		this.trigger.setAttribute( 'aria-expanded', open );

		if( open ) {
			if( this.trigger !== document.activeElement && source === 'tap' ) {
				this.trigger.focus(); // ios safari not focusing on buttons
			}

			if( this.accordianInstances.length ) {
				this.accordianInstances.forEach( a => {
					if( a._open )
						a.toggle( false );
				} );
			}
		}

		if( open ) {
			if( this.container )
				this.container.setAttribute( 'data-expanded', 'true' );

			this.collapsible.style.height = this._collapsibleHeight + 'px';
		} else {
			if( this.container )
				this.container.setAttribute( 'data-expanded', 'false' );

			this.collapsible.style.height = '';
		}

		if( this.container )
			this.container.setAttribute( 'data-source', source );
	}

 /*
	* Event handlers
	* --------------
	*/

	_resize() {
		if( !this.resize )
			return;

		// throttles resize event
		clearTimeout( this._resizeTimer );

		this._resizeTimer = setTimeout( () => {
			let viewportWidth = window.innerWidth;

			if( viewportWidth != this._viewportWidth ) {
				this._viewportWidth = viewportWidth;
			} else {
				return;
			}

			this._setCollapsibleHeight();
			this._toggleCollapsible( this._open );
		}, 100 );
	}

	_trigger() {
		let open = !this._open;
		this._toggleCollapsible( open, 'tap' );
	}

  _blur() {
    setTimeout( () => {
    	// close if focus outside
  		if( !this._focusableItems.includes( document.activeElement ) && this._open ) {
      	this._toggleCollapsible( false, 'blur' );
  		}
    }, 0 );
  }

 /*
	* Public methods
	* --------------
	*/

	set( set = true ) {
		this._set = set;
		this._setContainer();

		if( set ) {
			this._setCollapsibleHeight();
			this._toggleCollapsible( this._open );
		} else {
			this.collapsible.style.height = '';
		}
	}

	toggle( open = true ) {
		this._toggleCollapsible( open );
	}

} // end Collapsible

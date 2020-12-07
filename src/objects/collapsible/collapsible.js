
/*
 * Imports
 * -------
 */

import { mergeObjects, prefix } from '../../utils/utils';

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
		this.nestedInstances = [];
		this.accordianInstances = [];
		this.transitionDuration = 300;
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

		// for keydown event
		this._keyCodes = {
			27: 'ESC',
			Escape: 'ESC'
		};

		this._nestedInstancesCallbacks = [];

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

		// event listeners
		this.collapsible.addEventListener( 'keydown', this._keyDownHandler.bind( this ) );
		this.trigger.addEventListener( 'click', this._triggerHandler.bind( this ) );

		window.addEventListener( 'resize', this._resizeHandler.bind( this ) );

		if( this.nestedInstances.length ) {
			this.nestedInstances.forEach( ( n ) => {
				const c = () => {
					this._setCollapsibleHeight();
					this._toggleCollapsible( this._open );
				};

				n._nestedInstancesCallbacks.push( c );
			} );
		}

		window.addEventListener( 'load', () => {
			this._setCollapsibleHeight();
			this._toggleCollapsible( false );
			this._setContainer();
		} );

		return true;
	}

 /*
	* Internal helpers
	* ----------------
	*/

	_onSet() {
		if( !this._nestedInstancesCallbacks.length )
			return;

		this._nestedInstancesCallbacks.forEach( ( n ) => {
			n();
		} );
	}

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
		if( !this._set )
			return;

		this.collapsible.style.height = '';
		this._collapsibleHeight = this.collapsible.scrollHeight;
	}

	_toggleCollapsible( open = true ) {
		if( !this._set )
			return;

		this._open = open;
		this.trigger.setAttribute( 'aria-expanded', open );

		if( open ) {
			if( this.accordianInstances.length ) {
				this.accordianInstances.forEach( ( a ) => {
					if( a._open )
						a.toggle( false );
				} );
			}
		}

		this.collapsible.style.height = this._collapsibleHeight + 'px';

		if( open ) {
			if( this.container )
				this.container.setAttribute( 'data-expanded', '' );

			setTimeout( () => {
				this.collapsible.style.height = '';
				this._onSet();
			}, this.transitionDuration );
		} else {
			setTimeout( () => {
				this.collapsible.style.height = 0;

				setTimeout( () => {
					if( this.container )
						this.container.removeAttribute( 'data-expanded' );

					this._onSet();
				}, this.transitionDuration );
			}, this.transitionDuration );
		}
	}

 /*
	* Event handlers
	* --------------
	*/

	_resizeHandler() {
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

	_triggerHandler() {
		let open = !this._open;
		this._toggleCollapsible( open );
	}

	_keyDownHandler( e ) {
		let key = e.key || e.keyCode || e.which || e.code;

		if( !this._keyCodes.hasOwnProperty( key ) )
			return;

		let keyCode = this._keyCodes[key];

		if( keyCode === 'ESC' ) {
			this._toggleCollapsible( false );
			this.trigger.focus();
		}
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

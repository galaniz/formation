
/*
 * Imports
 * -------
 */

import {
  setCookie,
  getCookie,
  mergeObjects
} from '../../utils';

/*
 * Remove elements ( if cookie or other condition + trigger click )
 * ---------------
 */

export default class Remove {

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
		this.trigger = null;
		this.condition = () => {};
		this.cookie = {
			name: '',
			value: '',
			expirationDays: ''
		};

		// merge default variables with args
		mergeObjects( this, args );

	 /*
		* Internal variables
		* ------------------
		*/

		this._hide = false;

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
		if( !this.item || !this.trigger )
			return false;

		if( this.cookie.name )
			this._cookieCondition = true;

		// add event listeners
		this.trigger.addEventListener( 'click', this._clickHandler.bind( this ) );

		// set display
		this._setDisplay( true );

		window.addEventListener( 'load', () => {
			this._remove();
		} );
	
		return true;
	}

 /*
	* Helpers
	* -------
	*/

	_setDisplay( init = false, hide = false ) {
		if( init ) {
			if( this.cookie.name ) {
				this._hide = getCookie( this.cookie.name ) ? true : false;
			} else {
				this._hide = this.condition( true ); // init true
			}
		} else {
			this._hide = hide;
		} 
	}

	_remove() {
		if( this._hide ) {
			this.item.parentNode.removeChild( this.item );
		}
	}

 /*
	* Event callbacks
	* ---------------
	*/

	_clickHandler( e ) {
		let hide = false;

		if( this.cookie.name ) {
			setCookie( 
				this.cookie.name, 
				this.cookie.value, 
				this.cookie.expirationDays 
			);
			
			hide = true;
		} else {
			hide = this.condition( false ); // init false
		}

		this._setDisplay( false, hide );
		this._remove();
	}

 /*
	* Public methods
	* ---------------
	*/

	getHide() {
		return this._hide;
	}

} // end Remove

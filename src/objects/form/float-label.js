
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
 * Float labels above inputs 
 * -------------------------
 */

export default class FloatLabel {

   /*
	* Constructor
	* -----------
	*/

	constructor( args ) {
		
       /*
        * Public variables
        * ----------------
        */

        this.input = null;
        this.label = null;

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
		// check that required variables not null
		if( !this.input || !this.label )
			return false;

		// add event listeners
		this.input.addEventListener( 'focus', this._inputHandler.bind( this ) );
		this.input.addEventListener( 'blur', this._inputHandler.bind( this ) );

		// init
		this._inputHandler();

		return true;
	}

	/*
	 * Event Handlers
	 * --------------
	 */

	_inputHandler( e ) {
		let type = e !== undefined ? e.type : false,
			float = false;

		if( type == 'focus' ) {
			float = true;
		} else {
			let value = this.input.value.trim();

			if( value ) {
				float = true;
			} else {
				float = false;
			}
		}

		if( float ) {
			addClass( this.label, '--float' );
		} else {
			removeClass( this.label, '--float' );
		}
	}

} // end FloatLabel


/*
 * Imports
 * -------
 */

import { mergeObjects } from '../../utils';

/*
 * Collapse table dynamically
 * --------------------------
 */

export default class Table {

 /*
	* Constructor
	* -----------
	*/

	constructor( args ) {

	 /*
		* Public variables
		* ----------------
		*/

		this.table = null;
		this.equalWidthTo = null;

		// merge default variables with args
		mergeObjects( this, args );

	 /*
		* Internal variables
		* ------------------
		*/

		// for throttling resize event
		this._resizeTimer;

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
		if( !this.table || !this.equalWidthTo )
			return false;

		window.addEventListener( 'resize', this._resizeHandler.bind( this ) );

		this._go();

		return true;
	}

	_go() {
		this.table.setAttribute( 'data-collapse', false );
		this.table.style.maxWidth = 'none';

		let targetWidth = this.equalWidthTo.clientWidth,
				currentWidth = this.table.clientWidth,
				collapse = currentWidth > targetWidth ? true : false;

		this.table.style.maxWidth = '';
		this.table.setAttribute( 'data-collapse', collapse );
	}

 /*
	* Event callbacks
	* ---------------
	*/

	_resizeHandler() {
		// throttles resize event
		clearTimeout( this._resizeTimer );

		this._resizeTimer = setTimeout( () => {
			this._go();
		}, 100 );
	}

} // end Table

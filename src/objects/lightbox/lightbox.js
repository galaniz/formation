
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
 * Click and enlarge assets
 * ------------------------
 */

export default class Lightbox {

	/* 

		links.forEach( ( l ) => {
			// get link to larger version or use self replace src with larger one with applicable...

			// add click event listener
			// this could be the nav for the fade slider
			// divide into groups

			// pinch to zoom
		} );




	*/

   /*
	* Constructor
	* -----------
	*/

	constructor( args ) {

       /*
        * Public variables
        * ----------------
        */

        this.items = null;
        
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
		if( !this.items )
			return false;

		// create slider

		/*
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

		*/


		// append to body

		this.items.forEach( ( item ) => {
			item.addEventListener(  );
		} );
		
		return true;
	}

} // end Lightbox


/*
 * Imports
 * -------
 */

import { assetLoaded } from '../../../utils';

/*
 * Lazy load ( images + iframes )
 * ---------
 */

export default class Lazy {

 /*
	* Constructor
	* -----------
	*/

	constructor( items = [] ) {

	 /*
		* Public variables
		* ----------------
		*/

		this.items = items;

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
		if( !this.items.length ) return false;

		// check if IntersectionObserver is supported

		let ioSupported = false;

		if (
      "IntersectionObserver" in window &&
      "IntersectionObserverEntry" in window &&
      "intersectionRatio" in window.IntersectionObserverEntry.prototype
    ) {
      this._ioSupported = true;
    }

    this.items.forEach( item => {
	    if( this._ioSupported ) {
	      this._show( item );
	    } else {
	      this._setSrc( item );
	    }
    } );
	}

 /*
	* Set src and show asset
	* ----------------------
	*/

	// source: https://web.dev/lazy-loading-images/
	_show( item ) {
		const observer = new IntersectionObserver( ( entries, obs ) => {
      entries.forEach( entry => {
        if( entry.isIntersecting ) {
          this._setSrc( item );
          observer.unobserve( item );
        }
      } );
    } );

    observer.observe( item );
	}

	_setSrc( item ) {
		const url = item.getAttribute( 'data-src' );

		if( !url )
			return;

		item.src = url;

		if( item.hasAttribute( 'data-srcset' ) )
			item.srcset = item.getAttribute( 'data-srcset' );

		if( item.hasAttribute( 'data-sizes' ) )
			item.sizes = item.getAttribute( 'data-sizes' );

		assetLoaded( item )
    .then( asset => {
    	item.setAttribute( 'data-loaded', true );
    } )
    .catch( err => {
    	item.setAttribute( 'data-loaded', 'err' );
    } );
	}

} // end Lazy

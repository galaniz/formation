
/*
 * Imports
 * -------
 */

import { prefix } from '../../utils/utils';

import BaseSlider from './base-slider';

/*
 * Slider that fades in and out
 * ----------------------------
 */

export default class FadeSlider extends BaseSlider {

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
			transitionDuration: 500,
			overlayItems: false,
			showLast: false
		};

		for( let prop in childDefaults ) {
			this[prop] = args.hasOwnProperty( prop ) ? args[prop] : childDefaults[prop];
		}

	 /*
		* Set up
		* ------
		*/

		/* Overlay items on top of each other */

		if( this.overlayItems ) {
			this.items.forEach( ( item, i ) => {
				prefix( 'transform', item, `translate( -${ i * 100 }% )` );
			} );
		}

		/* Nav set up */

		this._setUpNav();

		this._goTo( this.currentIndex, true );
	}

 /*
	* Helpers
	* -------
	*/

	_doGoTo( index ) {
		let ogIndex = this.currentIndex,
				lastIndex = super._doGoTo( index );

		if( this.showLast )
			this.items[lastIndex].style.opacity = 1;
		
		this.items[ogIndex].removeAttribute( 'data-active' );
		this.items[this.currentIndex].addAttribute( 'data-active', '' );

		// fade without flash of background
		setTimeout( () => {
			if( this.showLast )
				this.items[lastIndex].style.opacity = '';
		}, this.transitionDuration );
	}

} // end FadeSlider

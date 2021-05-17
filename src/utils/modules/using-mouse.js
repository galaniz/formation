
/*
 * Add attr to body if using mouse
 * -------------------------------
 * source: https://bit.ly/2GpioBO
 */

/* Dependencies */

import { publish } from './pub-sub';

export const usingMouse = () => {
	let body = document.body;

	body.setAttribute( 'data-using-mouse', '' );
	publish( 'tabState', [false] );

	// mouse is being used
	body.addEventListener( 'mousedown', () => {
		body.setAttribute( 'data-using-mouse', '' );
		publish( 'tabState', [false] );
	} );

	let tab = [9, 'Tab'];

	window.focus(); // to prevent keydown delay

	// check for tabbing to remove class
	body.addEventListener( 'keydown', ( e ) => {
		let key = e.key || e.keyCode || e.which || e.code;

		if( tab.indexOf( key ) !== -1 ) {
			body.removeAttribute( 'data-using-mouse' );
			publish( 'tabState', [true] );
		}
	} );
};

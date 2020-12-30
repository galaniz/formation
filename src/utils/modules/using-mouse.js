
/*
 * Add attr to body if using mouse
 * -------------------------------
 * ssource: https://bit.ly/2GpioBO
 */

export const usingMouse = () => {
	let body = document.body;

	body.setAttribute( 'data-using-mouse', '' );

	// mouse is being used
	body.addEventListener( 'mousedown', () => {
		body.setAttribute( 'data-using-mouse', '' );
	} );

	let tab = [9, 'Tab'];

	window.focus(); // to prevent keydown delay

	// check for tabbing to remove class
	body.addEventListener( 'keydown', ( e ) => {
		let key = e.key || e.keyCode || e.which || e.code;

		if( tab.indexOf( key ) !== -1 ) {
			body.removeAttribute( 'data-using-mouse' );
		}
	} );
};


/*
 * Add class to body if using mouse
 * --------------------------------
 * source: https://bit.ly/2GpioBO
 */

const usingMouse = () => {
	let body = document.body;

	body.setAttribute( 'data-using-mouse', '' );

	// mouse is being used
	body.addEventListener( 'mousedown', () => {
		body.setAttribute( 'data-using-mouse', '' );
	} );

	let tab = [9, 'Tab'];

	// check for tabbing to remove class
	body.addEventListener( 'keydown', ( e ) => {
		let key = e.key || e.keyCode || e.which || e.code;

		if( tab.indexOf( key ) !== -1 ) {
			body.removeAttribute( 'data-using-mouse' );
		}
	} );
};

export default usingMouse;


/*
 * Skip link to main content
 * -------------------------
 */

const focusHandler = ( e ) => {
	let link = e.currentTarget;

	if( e.type == 'focus' ) {
		link.setAttribute( 'data-show', true );
	} else {
		link.removeAttribute( 'data-show' );
	}
};

const skipLink = ( link ) => {
	link.addEventListener( 'focus', focusHandler );
	link.addEventListener( 'blur', focusHandler );
};

export default skipLink;

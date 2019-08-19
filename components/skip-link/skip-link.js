
/*
 * Imports
 * -------
 */

import { addClass, removeClass } from '../../utils';

/*
 * Skip link to main content
 * -------------------------
 */

const focusHandler = ( e ) => {
	let link = e.currentTarget;

	if( e.type == 'focus' ) {
		addClass( link, '--show' );
	} else {
		removeClass( link, '--show' );
	}
};

const skipLink = ( link ) => {
	link.addEventListener( 'focus', focusHandler );
	link.addEventListener( 'blur', focusHandler );
};

export default skipLink;

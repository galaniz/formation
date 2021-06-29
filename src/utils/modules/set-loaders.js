
/*
 * Toggle display of loaders / disable buttons
 * -------------------------------------------
 * 
 * @param loaders [array] of [HTMLElement]
 * @param buttons [array] of [HTMLElement]
 * @param show [boolean]
 */

export const setLoaders = ( loaders = [], buttons = [], show = true ) => {
	if( loaders.length ) {
		loaders.forEach( l => {
			if( show ) {
				l.removeAttribute( 'data-hide' );
			} else {
				l.setAttribute( 'data-hide', '' );
			}
		} );
	}

	if( buttons.length ) {
		buttons.forEach( b => {
			b.disabled = show;
			b.setAttribute( 'aria-disabled', show.toString() );
		} );
	}
};

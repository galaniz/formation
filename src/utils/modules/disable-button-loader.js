
/*
 * Disable button / show loader
 * ----------------------------
 * 
 * @param button [HTMLElement]
 * @param loader [HTMLElement]
 * @param class [string]
 * @param hide [boolean]
 */

export const disableButtonLoader = ( button = null, loader = null, hide = true, disable = false ) => {
    if( !button || !loader )
        return;

    if( hide ) {
    	loader.setAttribute( 'data-hide', '' );
    } else {
    	loader.removeAttribute( 'data-hide' );
    }

    button.disabled = disable;
    button.setAttribute( 'aria-disabled', disable.toString() );
};

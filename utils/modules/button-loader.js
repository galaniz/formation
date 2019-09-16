
/*
 * Disable button / show loader
 * ----------------------------
 * 
 * @param button [HTMLElement]
 * @param loader [HTMLElement]
 * @param class [string]
 * @param hide [boolean]
 */

/* Dependencies */

import { addClass } from './add-class';
import { removeClass } from './remove-class';

export const buttonLoader = ( button = null, loader = null, className = '', add = true, disable = false ) => {
    if( !button || !loader || !className )
        return;

    if( add ) {
    	addClass( loader, className );
    } else {
    	removeClass( loader, className );
    }

    button.disabled = disable;
    button.setAttribute( 'aria-disabled', disable.toString() );
};

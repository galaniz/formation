
/*
 * Imports
 * -------
 */

import { addClass, removeClass, hasClass } from '../../utils/utils';

/*
 * Add custom focus ring to focusable elements
 * -------------------------------------------
 * source: https://zellwk.com/blog/keyboard-focusable-elements/
 */

const getKeyboardFocusableElements = ( selector ) => {
    return [...document.querySelectorAll( selector)].filter( el => !el.hasAttribute( 'disabled' ) );
};

const focusRing = ( className = 'focus-ring', selector = 'a, button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])' ) => {
    let focusableItems = getKeyboardFocusableElements( selector );

    if( focusableItems ) {
        let tab = [9, 'Tab'];

        focusableItems.forEach( ( item ) => {
            item.addEventListener( 'keyup', ( e ) => {
                let key = e.key || e.keyCode || e.which || e.code;

                if( tab.indexOf( key ) !== -1 ) {
                    if( hasClass( item, className ) ) {
                        removeClass( item, className );
                    } else {
                        addClass( item, className );
                    }
                }
            } );

            item.addEventListener( 'blur', ( e ) => {
                removeClass( item, className );
            } );
        } );
    }
};

export default focusRing;

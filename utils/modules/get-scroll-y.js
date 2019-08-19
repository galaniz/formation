
/*
 * Cross browser way to get scroll y position
 * ------------------------------------------
 * 
 * @return [int] scroll y value
 *
 */

export const getScrollY = () => {
    let supportPageOffset = window.pageXOffset !== undefined,
        isCSS1Compat = ( ( document.compatMode || '' ) === 'CSS1Compat' );

    return supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
};

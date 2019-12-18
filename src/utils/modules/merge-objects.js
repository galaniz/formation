
/*
 * Merge objects only one nested level deep
 * ----------------------------------------
 *
 * @dependency Object.assign()
 *
 * @param x [object]
 * @param y [object] overwrite x values
 *
 * @return [object] x
 */

export const mergeObjects = ( x, y ) => {
    for( let i in y ) {
        // if not null or an html element and an object run again
        if( y[i] !== undefined &&
            y[i] !== false &&
            y[i] !== null &&
            !Array.isArray( y[i] ) &&
            typeof( y[i] ) == 'object' &&
            !( y[i] instanceof HTMLElement ) &&
            !( y[i] instanceof HTMLCollection ) &&
            !( y[i] instanceof NodeList ) &&
            !( y[i] instanceof SVGElement ) ) {
            if( x.hasOwnProperty( i ) ) {
                x[i] = Object.assign( x[i], y[i] );
            }
        } else {
            if( x.hasOwnProperty( i ) )
                x[i] = y[i];
        }
    }

    return x;
};

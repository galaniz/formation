
/*
 * Fetch and set elements by selector
 * ----------------------------------
 *
 * @param meta [object] of props and placeholder values
 * @param e [array] of objects { 
 *      @prop prop [string] from meta
 *      @prop selector [string]
 *      @prop all [boolean]
 *      @prop array [boolean]
 * }
 * @param done [function] callback when done recursing through e and setting meta object
 */

export const setElements = ( meta, e, done = () => {} ) => {
    const recursive = ( i, array, arrayLength, context = document ) => {
        if( i < arrayLength ) {
            let m = array[i],
                all = false,
                convertToArray = false,
                el = null;

            if( m.hasOwnProperty( 'all' ) )
                all = true;

            if( m.hasOwnProperty( 'array' ) )
                convertToArray = true;

            if( all ) {
                if( context )
                    el = context.querySelectorAll( m.selector );
            } else {
                if( context )
                    el = context.querySelector( m.selector );
            }

            if( convertToArray )
                el = Array.from( el );

            e[m.prop] = el;

            if( m.hasOwnProperty( 'descendants' ) )
                recursive( 0, m.descendants, m.descendants.length, el );

            recursive( i + 1, array, arrayLength );
        } 

        if( i === meta.length - 1 )
            done();
    };

    recursive( 0, meta, meta.length );
};

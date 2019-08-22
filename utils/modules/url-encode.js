
/*
 * Recursively convert object key value pairs into url encoded string
 * ------------------------------------------------------------------
 *
 * @param o [object] ( only param that needs to be passed by user )
 * @param key [string] ( for iteration )
 * @param list [array] store key value pairs ( for iteration )
 * 
 * @return [string]
 */

export const urlEncode = ( o, key, list = [] ) => {
    if( typeof( o ) == 'object' ) {
        for( let idx in o )
            urlEncode( o[idx], key ? key + '[' + idx + ']' : idx, list );
    } else {
        list.push( key + '=' + encodeURIComponent( o ) );
    }

    return list.join( '&' );
};

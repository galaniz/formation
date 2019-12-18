
/*
 * Recursively convert object key value pairs into url encoded string
 * ------------------------------------------------------------------
 *
 * @param o [object] ( only param that needs to be passed by user )
 * @param _key [string] ( for iteration )
 * @param _list [array] store key value pairs ( for iteration )
 *
 * @return [string]
 */

export const urlEncode = ( o, _key, _list = [] ) => {
    if( typeof( o ) == 'object' ) {
        for( let idx in o )
            urlEncode( o[idx], _key ? _key + '[' + idx + ']' : idx, _list );
    } else {
        _list.push( _key + '=' + encodeURIComponent( o ) );
    }

    return _list.join( '&' );
};

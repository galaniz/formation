
/*
 * Handle ajax requests
 * --------------------
 *
 * @param args [object] {
 *	method = string,
 *	url = string
 *	headers = object
 *	body = url encoded string or form data
 * }
 *
 * @return [promise] with response / error passed to it
 *
 */

export const request = ( args ) => { 
    return new Promise( ( resolve, reject ) => {
        let xhr = new XMLHttpRequest();

        xhr.open( args.method || 'GET', args.url );
        
        if( args.headers ) {
            Object.keys( args.headers ).forEach( key => {
                xhr.setRequestHeader( key, args.headers[key] );
            } );
        }

        xhr.onload = () => {
            if( xhr.status >= 200 && xhr.status < 300 ) {
                try {
                    resolve( xhr.responseText );
                } catch( e ) {
                    reject( 'Oops something went wrong.' );
                }
            } else {
                reject( xhr );
            }
        };

        xhr.onerror = () => reject( xhr );

        xhr.send( args.body || null );
    } );
};

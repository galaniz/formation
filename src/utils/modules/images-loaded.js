
/*
 * Check if images are loaded
 * --------------------------
 *
 * @param images [array] of image elements
 * @param done callback [function] when finished loading
 */

const _imageLoaded = ( image ) => {
    return new Promise( ( resolve, reject ) => {
        let proxyImage = new Image();
        proxyImage.src = image.src;

        if( proxyImage.complete )
            resolve( image );

        proxyImage.onload = () => {
        	resolve( image );
        };

        proxyImage.onerror = () => {
        	resolve( image );
        };
    } );
};

export const imagesLoaded = ( images = [], done = () => {} ) => {
    if( images.length == 0 ) {
        done( false );
        return;
    }

	Promise.all( images.map( _imageLoaded ) )
    .then( ( data ) => {
		done( data );
	} )
    .catch( ( err ) => {
        console.log( err );
        done( false );
    } );
};

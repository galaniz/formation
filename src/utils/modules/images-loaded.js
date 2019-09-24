
/*
 * Check if images are loaded
 * --------------------------
 *
 * @param images [array] of image elements
 * @param done callback [function] when finished loading
 */

const _imageLoaded = ( image ) => {
    return new Promise( ( resolve ) => {
        if( image.complete )
        	resolve( image );

        image.onload = () => {
        	resolve( image );
        };

        image.onerror = () => {
        	resolve( image );
        };
    } );
};

export const imagesLoaded = ( images = [], done ) => {
    if( images.length == 0 ) {
        done( 'No images' );
        return;
    }

	Promise.all( images.map( _imageLoaded ) ).then( ( data ) => {
		done( data );
	} );
};

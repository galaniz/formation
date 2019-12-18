
/*
 * Object fit fallback for cover/contain
 * -------------------------------------
 *
 * @param images [array] of image elements
 */

export const objectFit = ( images = [], type = 'cover' ) => {
    if( images.length == 0 )
        return;

    images.forEach( ( image ) => {
        let classes = image.className;

        if( type == 'contain' ) {
            classes = classes.replace( 'js-object-contain', '' );
            classes = classes.replace( 'u-object-contain', '' );
            classes += ' u-object-contain-fallback';
        } else {
            classes = classes.replace( 'js-object-cover', '' );
            classes = classes.replace( 'u-object-cover', '' );
            classes += ' u-object-cover-fallback';
        }

        image.insertAdjacentHTML( 'afterend',
            `<div class="${ classes }" style="background-image: url(${ image.src })"></div>`
        );
    } );
};

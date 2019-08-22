
/*
 * Object fit fallback for cover
 * -----------------------------
 * 
 * @param images [array] of image elements
 */

export const objectFitCover = ( images = [] ) => {
    if( images.length == 0 )
        return;

    images.forEach( ( image ) => {
        let classes = image.className;
            classes = classes.replace( 'js-object-cover', '' );
            classes = classes.replace( 'u-object-cover', '' );
            classes += ' u-object-cover-fallback';

        image.insertAdjacentHTML( 'afterend', 
            `<div class="${ classes }" style="background-image: url(${ image.src })"></div>` 
        );
    } );
};


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
      classes = classes.replace( 'js-obf-cn', '' );
      classes = classes.replace( 'u-obf-cn', '' );
      classes += ' u-obf-cn-f';
    } else {
      classes = classes.replace( 'js-obf-cv', '' );
      classes = classes.replace( 'u-obf-cv', '' );
      classes += ' u-obf-cv-f';
    }

    image.insertAdjacentHTML( 'afterend',
      `<div class="${ classes }" style="background-image: url(${ image.src })"></div>`
    );
  } );
};

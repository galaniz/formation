
/*
 * Object fit fallback for cover/contain
 * -------------------------------------
 *
 * @param images [array] of image elements
 */

export const objectFit = ( images = [], type = 'cover' ) => {
  if( images.length == 0 )
    return;

  images.forEach( image => {
    let classes = image.className,
        dataAttrs = '';

    if( type == 'contain' ) {
      classes = classes.replace( 'js-obf-cn', '' );
      classes = classes.replace( 'u-obf-cn', '' );
      classes += ' u-obf-cn-f';
    } else {
      classes = classes.replace( 'js-obf-cv', '' );
      classes = classes.replace( 'u-obf-cv', '' );
      classes += ' u-obf-cv-f';
    }

    if( image.hasAttributes() ) {
      let attrs = Array.from( image.attributes );

      attrs = attrs.filter( a => {
        return a.name.startsWith( 'data' );
      } );

      if( attrs.length ) {
        dataAttrs = attrs.map( a => {
          return `${ a.name }="${ a.value }"`;
        } );

        dataAttrs = ' ' + dataAttrs.join( ' ' );
      }
    }

    image.insertAdjacentHTML( 'afterend',
      `<div class="${ classes }" style="background-image: url(${ image.src })"${ dataAttrs }></div>`
    );
  } );
};

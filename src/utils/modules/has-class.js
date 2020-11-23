
/*
 * Check if element contains class(es)
 * -----------------------------------
 * 
 * @param item [HTMLElement]
 * @param classes [string] of classes separated by space
 * @param all [boolean] contains all classes
 */

export const hasClass = ( item, classes, all = true ) => {
  if( !item || !classes )
    return;

  let currentClasses = item.className.split( ' ' ),
      hasClasses = all;
      classes = classes.split( ' ' );
      
  classes.forEach( ( c ) => {
    let classPos = currentClasses.indexOf( c ); 

    if( all ) {
      if( classPos === -1 ) {
        hasClasses = false;
        return;
      }
    } else {
      if( classPos !== -1 ) {
        hasClasses = true;
        return;
      }
    }
  } );

  return hasClasses;
};

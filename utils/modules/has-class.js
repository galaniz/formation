
/*
 * Check if element contains class(es)
 * -----------------------------------
 * 
 * @param item [HTMLElement]
 * @param classes [string] of classes separated by space
 */

export const hasClass = ( item, classes ) => {
    if( !item || !classes )
        return;

    let currentClasses = item.className.split( ' ' ),
        hasClasses = true;
        classes = classes.split( ' ' );
        
    classes.forEach( ( c ) => {
        let classPos = currentClasses.indexOf( c ); 

        if( classPos === -1 ) {
            hasClasses = false;
            return;
        }
    } );

    return hasClasses;
};

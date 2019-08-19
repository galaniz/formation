
/*
 * Remove class(es) from element
 * -----------------------------
 * 
 * @param item [HTMLElement]
 * @param classes [string] of classes separated by space
 *
 */

export const removeClass = ( item, classes ) => {
    if( !item || !classes )
        return;

    let currentClasses = item.className.split( ' ' );
        classes = classes.split( ' ' );

    classes.forEach( ( c ) => {
        let classPos = currentClasses.indexOf( c ); 

        if( classPos != -1 )
            currentClasses.splice( classPos, 1 );
    } );

    item.className = currentClasses.join( ' ' );
};

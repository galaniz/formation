
/*
 * Prefix transition or transform props on element
 * -----------------------------------------------
 * 
 * @param type [string] with value 'transition' or 'transform'
 * @param item [HTMLElement]
 * @param val [string] property value
 */

export const prefix = ( type, item, val ) => {
	if( !type || !item || !val ) 
		return;

    let typePrefixes = {
        transform( el, val ) {
            item.style.webkitTransform = val;
            item.style.MozTransform = val;
            item.style.msTransform = val;
            item.style.OTransform = val;
            item.style.transform = val;
        },
        transition( el, val ) {
            item.style.webkitTransition = val;
            item.style.MozTransition = val;
            item.style.msTransition = val;
            item.style.OTransition = val;
            item.style.transition = val;
        }
    }

    typePrefixes[type]( item, val );
};

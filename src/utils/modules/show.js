
/*
 * Show / hide html element
 * ------------------------
 * 
 * @param item [HTMLElement]
 * @param show [boolean]
 */

export const show = ( item, show = true ) => {
	if( !item )
		return; 

	let display = show ? 'block' : 'none';

	item.style.display = display;
};

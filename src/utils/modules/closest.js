
/*
 * Traverse up DOM until find element with class
 * ---------------------------------------------
 *
 * @param item [HTMLElement]
 * @param className [string]
 */

/* Dependencies */

import { hasClass } from './has-class';

export const closest = ( item, className, max = 10 ) => {
	if( !item || !className )
		return;

		let parent = item.parentElement,
				counter = 0;

		while( hasClass( parent, className ) === false ) {
			parent = parent.parentElement;
			counter++;

			if( counter === max ) {
				parent = false;
				break;
			}
		}

		return parent;
};

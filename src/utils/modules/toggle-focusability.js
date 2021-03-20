
/*
 * Toggle focusability of specified elements
 * -----------------------------------------
 * source: https://bit.ly/3paRHkt
 *
 * @param focusContext [boolean]
 * @param items [array] of [HTMLElement]
 */

export const toggleFocusability = ( on = true, items = [] ) => {
	if( !items.length )
		return;

	let formTags = ['BUTTON','INPUT','SELECT','TEXTAREA'];

	items.forEach( item => {
		if( on ) {
			if( item.hasAttribute( 'data-context-inert-aria-hidden' ) ) {
			  item.setAttribute( 'aria-hidden', item.getAttribute( 'data-context-inert-aria-hidden' ) );
			  item.removeAttribute( 'data-context-inert-aria-hidden' );
			}

			if( item.hasAttribute( 'data-context-inert-tabindex' ) ) {
			  item.setAttribute( 'tabindex', item.getAttribute( 'data-context-inert-tabindex' ) );
			  item.removeAttribute( 'data-context-inert-tabindex' );
			}

			if( item.hasAttribute( 'data-context-inert-href' ) ) {
			  item.setAttribute( 'href', item.getAttribute( 'data-context-inert-href' ) );
			  item.removeAttribute( 'data-context-inert-href' );
			}

			if( formTags.indexOf( item.tagName ) != -1 ) {
			  item.removeAttribute( 'disabled', true );

			  if( item.hasAttribute( 'data-context-inert-disabled' ) ) {
			    item.setAttribute( 'disabled', item.getAttribute( 'data-context-inert-disabled' ) );
			    item.removeAttribute( 'data-context-inert-disabled' );
			  }
			}
		} else {
			let ariaHiddenValue = item.getAttribute( 'aria-hidden' );

			if( !ariaHiddenValue )
				ariaHiddenValue = false;

	    item.setAttribute( 'data-context-inert-aria-hidden', ariaHiddenValue );
	    item.setAttribute( 'aria-hidden', true );

	    if( item.hasAttribute( 'tabindex' ) ) {
	      item.setAttribute( 'data-context-inert-tabindex', item.getAttribute( 'tabindex' ) );
	      item.removeAttribute( 'tabindex' );
	    }

	    if( item.hasAttribute( 'href' ) ) {
	      item.setAttribute( 'data-context-inert-href', item.getAttribute( 'href' ) );
	      item.removeAttribute( 'href' );
	    }

	    if( formTags.indexOf( item.tagName ) != -1 ) {
	      if( item.hasAttribute( 'disabled' ) )
	        item.setAttribute( 'data-context-inert-disabled', item.getAttribute( 'disabled' ) );

	      item.setAttribute( 'disabled', true );
	    }
		}
	} );
};

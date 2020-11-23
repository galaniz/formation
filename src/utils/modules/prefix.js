
/*
 * Prefix transition or transform props on element
 * -----------------------------------------------
 *
 * @param type [string] with value 'transition', 'transform', 'transformOrigin' or 'transitionDelay'
 * @param item [HTMLElement]
 * @param val [string] property value
 */

export const prefix = ( type, item, val ) => {
	if( !type || !item || !val )
		return;

	let typePrefixes = {
		transform() {
			item.style.webkitTransform = val;
			item.style.MozTransform = val;
			item.style.msTransform = val;
			item.style.OTransform = val;
			item.style.transform = val;
		},
		transformOrigin() {
			item.style.webkitTransformOrigin = val;
			item.style.MozTransformOrigin = val;
			item.style.msTransformOrigin = val;
			item.style.OTransformOrigin = val;
			item.style.transformOrigin = val;
		},
		transition() {
			item.style.webkitTransition = val;
			item.style.MozTransition = val;
			item.style.msTransition = val;
			item.style.OTransition = val;
			item.style.transition = val;
		},
		transitionDelay() {
      item.style.webkitTransitionDelay = val;
      item.style.MozTransitionDelay = val;
      item.style.msTransitionDelay = val;
      item.style.OTransitionDelay = val;
      item.style.transitionDelay = val; 
		}
	}

	typePrefixes[type]();
};

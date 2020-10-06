
/*
 * Complete page transition on link click
 * --------------------------------------
 */

let t = null,
	d = 800,
	run = true;

const clickHandler = ( e ) => {
	e.preventDefault();

	if( !run )
		return;

	let url = e.currentTarget.href;

	t.setAttribute( 'data-show', '' );

	setTimeout( () => {
		window.location = url;
	}, d );
};

const transition = ( links = null, transitionElement = null, delay = 800 ) => {
	if( !links || !transitionElement )
		return;

	t = transitionElement;
	d = delay;

	links.forEach( ( link ) => {
		if( link.href.indexOf( '#' ) == -1 )
			link.addEventListener( 'click', clickHandler );
	} );
};

const setTransitionRun = ( r ) => {
	run = r;
};

export { transition, setTransitionRun };


/*
 * Complete page transition on link click
 * --------------------------------------
 */

let t = null,
		d = 800,
		run = true,
		b = () => {};

const clickHandler = ( e ) => {
	e.preventDefault();

	if( !run )
		return;

	let url = e.currentTarget.href;

	b();
	t.setAttribute( 'data-show', '' );

	setTimeout( () => {
		window.location = url;
	}, d );
};

const transition = ( links = null, transitionElement = null, delay = 800, init = false, beforeShow = false ) => {
	if( !links || !transitionElement )
		return;

	t = transitionElement;
	d = delay;

	if( beforeShow )
		b = beforeShow;

	links.forEach( ( link ) => {
		if( link.href.indexOf( '#' ) == -1 )
			link.addEventListener( 'click', clickHandler );
	} );

	if( init )
		init();
};

const setTransitionRun = ( r ) => {
	run = r;
};

export { transition, setTransitionRun };

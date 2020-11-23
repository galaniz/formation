
/*
 * Small publish / subscribe to events module
 * ------------------------------------------
 *
 * Publish
 *
 * @param name [string]
 * @param args [array] pass to callback function
 *
 * Subscribe
 *
 * @param name [string] ( same as publish name )
 * @param callback [function]
 */

let subscriptions = {};

const publish = ( name, args = [] ) => {
	if( !subscriptions.hasOwnProperty( name ) )
			return;

	let callbacks = subscriptions[name];

	if( callbacks )
		callbacks.forEach( ( callback ) => {
			callback( args );
		} );
};

const subscribe = ( name, callback = () => {} ) => {
	if( !subscriptions.hasOwnProperty( name ) )
		subscriptions[name] = [];

	let index = subscriptions[name].push( callback ) - 1;

	// remove subscription
	return {
		remove: () => {
			delete subscriptions[name][index];
		}
	};
};

export { publish, subscribe };

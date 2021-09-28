
/*
 * Check if assets are loaded
 * --------------------------
 *
 * assetLoaded
 *
 * @param assets [HTML element]
 * @param return [promise]
 *
 * assetsLoaded
 *
 * @param assets [array] of [HTML elements]
 * @param done callback [function] when finished loading
 */

const assetLoaded = ( asset ) => {
  let type = asset.tagName;

  return new Promise( ( resolve, reject ) => {
    let proxy = null;

    if( type === 'IMG' )
      proxy = new Image();

    if( type === 'IFRAME' )
      proxy = new Iframe();

    if( type === 'VIDEO' )
      proxy = new Video();

    proxy.src = asset.src;

    const res = () => {
      resolve( asset );
    };

    const err = ( message ) => {
      reject( message );
    };

    if( proxy.complete )
      res();

    proxy.onload = res;
    proxy.onerror = err;
  } );
};

const assetsLoaded = ( assets = [], done = () => {} ) => {
  if( assets.length == 0 ) {
    done( false );
    return;
  }

	Promise.all( assets.map( assetLoaded ) )
  .then( data => {
		done( data );
	} )
  .catch( err => {
    console.log( err );
    done( false );
  } );
};

export { assetLoaded, assetsLoaded };

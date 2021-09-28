
/*
 * Set and get browser cookie
 * --------------------------
 *
 * setCookie
 *
 * @param name [string]
 * @param value [string]
 * @param expirationDays [int]
 *
 * getCookie
 *
 * @param name [string]
 * @return [string]
 */

const setCookie = ( name, value, expirationDays ) => {
	let expires = '';

	if( expirationDays ) {
	  const d = new Date();

	  d.setTime( d.getTime() + expirationDays * 24 * 60 * 60 * 1000 );
	  
	  expires = `expires=${ d.toUTCString() };`;
	}

  document.cookie = `${ name }=${ value };${ expires }path=/`;
};

const getCookie = ( name ) => {
  const cookies = document.cookie.split( ';' );

  for( let i = 0; i < cookies.length; i++ ) {
  	let cookie = cookies[i];
  	let c = cookie.split( '=' );

  	if( c[0].trim() === name ) {
  		return c[1];
  	}
  }

  return '';
};

export { setCookie, getCookie };
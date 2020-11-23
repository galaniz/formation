
/*
 * Loop through object recursively
 * -------------------------------
 * 
 * @param obj [object]
 * @param callback [boolean/function] if function pass property and value
 * @param condition [function] returns boolean
 */

export const recurseObject = ( obj, callback = false, condition = () => true ) => {
  for( let o in obj ) {
    if( condition( o, obj[o] ) && 
      obj[o] !== null && 
      typeof( obj[o] ) == 'object' && 
      !( obj[o] instanceof HTMLElement ) && 
      !( obj[o] instanceof HTMLCollection ) && 
      !( obj[o] instanceof NodeList ) &&
      !( obj[o] instanceof SVGElement ) ) {
      recurseObject( obj[o], callback, condition );
    } else {
      if( condition( o, obj[o] ) && callback )
        callback( o, obj[o] );
    }
  }
};

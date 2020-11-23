
/*
 * Call functions sequentially and with delay
 * ------------------------------------------
 *
 * @param events [array] of objects {
 *    @prop action [function] with optional callback
 *    @prop delay [int]
 *    @prop increment [int]
 * }
 * @param repeat [int]
 */

export const cascade = ( events, repeat = 1 ) => {
  let eventsLength = events.length,
      increment = 0,
      delay = 0;

  for( let j = 0; j < repeat; j++ ) {
    const recursive = ( i ) => {
      if( i < eventsLength ) {
        let event = events[i],
            eventDelay = event.hasOwnProperty( 'delay' ) ? event.delay : delay;

        if( event.hasOwnProperty( 'increment' ) ) {
          if( !increment && eventDelay )
              delay = eventDelay;

          increment = event.increment;
        } else {
          delay = eventDelay;
        }

        setTimeout( () => {
          let indexArg = repeat > 1 ? j : i;

          // check if contains two args ( second arg is done callback )
          if( event.action.length === 2 ) {
            event.action( indexArg, () => {
              recursive( i + 1 );
            } );
          } else {
            event.action( indexArg );
            recursive( i + 1 );
          }
        }, delay );

        delay += increment;
      }
    };

    recursive( 0 );
  }
};

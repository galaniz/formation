
/*
 * Call functions sequentially and with delay
 * ------------------------------------------
 * 
 * @param events [array] of objects { 
 *      @prop action [function] with optional callback
 *      @prop delay [int]
 *      @prop increment [int]
 * }
 */

export const cascade = ( events ) => {
    let eventsLength = events.length,
        increment = 0,
        delay = 0;

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
                // check if contains two args ( second arg is done callback )
                if( event.action.length === 2 ) {
                    event.action( i, () => {
                        recursive( i + 1 );
                    } );
                } else {
                    event.action( i );
                    recursive( i + 1 );
                }
            }, delay );

            delay += increment;
        }
    };  

    recursive( 0 );
};

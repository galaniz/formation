
/*
 * Imports
 * -------
 */

import { mergeObjects } from '../utils/utils';

/*
 * Places items into columns to emulate masonry effect
 * ---------------------------------------------------
 */

export default class Masonry {

   /*
    * Constructor
    * -----------
    */

    constructor( args ) {

       /*
        * Public variables
        * ----------------
        */

        this.container = null;
        this.items = null;
        this.breakpoints = [];
        this.column = {
            tag: 'div',
            class: ''
        };

        // merge default variables with args
        mergeObjects( this, args );

       /*
        * Internal variables ( more set in init )
        * ------------------
        */

        // store break point ranges
        this._bkRanges = [];

        // for throttling resize event
        this._resizeTimer;

        // for resize event and arrange
        this._viewportWidth = window.innerWidth;

       /*
        * Initialize
        * ----------
        */

        let init = this._initialize();

        if( !init )
            return false;
    }

   /*
    * Initialize
    * ----------
    */

    _initialize() {
        // check that required variables not null
        if( !this.container || !this.items || this.items.length === 0 )
            return false;

        // convert items to array
        this.items = Array.from( this.items );

        // store number of items
        this._itemsLength = this.items.length;

        // set breakpoint ranges
        let breakpointLength = this.breakpoints.length;

        this.breakpoints.forEach( ( bk, i ) => {
            let low = 0,
                high = bk.width,
                cols = 1;

            if( i > 0 ) {
                low = this.breakpoints[i - 1]['width'];
                cols = this.breakpoints[i - 1]['cols'];
            }

            this._bkRanges.push( {
                high: high,
                low: low,
                cols: cols
            } );

            if( i == breakpointLength - 1 ) {
                low = bk.width;
                high = 99999;
                cols = bk.cols;

                this._bkRanges.push( {
                    high: high,
                    low: low,
                    cols: cols
                } );
            }
        } );

        // store number of breakpoint ranges
        this._bkRangesLength = this._bkRanges.length;

        // event listeners
        window.addEventListener( 'resize', this._resizeHandler.bind( this ) );

        // arrange into columns
        this._arrange();
    }

    /*
     * Determine columns from what range currently in
     * ----------------------------------------------
     */

    _arrange() {
        // get currentRange
        let currentRange;

        for( let i = 0; i < this._bkRangesLength; i++ ) {
            let bkRange = this._bkRanges[i],
                low = bkRange.low,
                high = bkRange.high;

            if( this._viewportWidth >= low && this._viewportWidth < high ) {
                currentRange = this._bkRanges[i];
                break;
            }
        }

        this._wrapItems( currentRange.cols );
    }

    /*
     * Wrap and unwrap helper methods
     * ------------------------------
     */

    _wrapItems( cols ) {
        let fragment = document.createDocumentFragment(),
            interval = Math.round( this._itemsLength / cols ),
            intervalCounter = interval,
            indexTracker = 0,
            // keep track of heights to not fetch more than need
            itemHeights = {},
            colItems = {},
            colHeights = {},
            colKeys = [];

        for( let i = 0; i < cols; i++ ) {
            colItems[i] = [];
            colHeights[i] = 0;
            colKeys.push( i );
        }

        this.items.forEach( ( item, index ) => {
            let currentItemHeight = itemHeights[index] || item.clientHeight,
                currentColHeight = colHeights[indexTracker] + currentItemHeight,
                nextIndexTracker = indexTracker + 1,
                nextColHeight = colHeights.hasOwnProperty( nextIndexTracker ) ? ( colHeights[nextIndexTracker] + currentItemHeight ) : false,
                diff = index === this._itemsLength - 1 ? -50 : -100;

            if( nextColHeight && ( nextColHeight - currentColHeight <= diff ) ) {
                if( index < this._itemsLength - 1 ) {
                    let nextItemIndex = index + 1,
                        nextItem = this.items[nextItemIndex],
                        nextItemHeight = nextItem.clientHeight;

                    if( currentItemHeight - nextItemHeight > 50 )
                        indexTracker = nextIndexTracker;

                    itemHeights[nextItemIndex] = nextItemHeight;
                } else {
                    indexTracker = nextIndexTracker;
                }
            }

            colItems[indexTracker].push( item );
            colHeights[indexTracker] += currentItemHeight;
            indexTracker++;

            if( colKeys.indexOf( indexTracker ) == -1 )
                indexTracker = 0;

            indexTracker = colKeys[indexTracker];
        } );

        for( let index in colItems ) {
            let elem = document.createElement( this.column.tag );
                elem.setAttribute( 'class', this.column.class );

            colItems[index].forEach( ( item ) => {
                elem.appendChild( item );
            } );

            fragment.appendChild( elem );
        }

        this.container.innerHTML = '';
        this.container.appendChild( fragment );
    }

    /*
     * Event Handlers
     * --------------
     */

    _resizeHandler() {
        // throttles resize event
        clearTimeout( this._resizeTimer );

        this._resizeTimer = setTimeout( () => {
            let viewportWidth = window.innerWidth;

            if( viewportWidth != this._viewportWidth ) {
                this._viewportWidth = viewportWidth;
            } else {
                return;
            }

            this._arrange();
        }, 100 );
    }

    /*
     * Public methods
     * --------------
     */

     addItems( items ) {
         items = Array.from( items );

         items.forEach( ( item ) => {
             this.items.push( item );
         } );

         this._itemsLength = this.items.length;

         this._arrange();
     }

} // end Masonry

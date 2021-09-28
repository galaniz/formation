
/*
 * Imports
 * -------
 */

import { mergeObjects, getScrollY } from '../../utils';

/*
 * Create masonry layout with negative margins
 * -------------------------------------------
 */

export default class MarginMasonry {

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
    this.itemSelector = '';
    this.breakpoints = [];

    // merge default variables with args
    mergeObjects( this, args );

   /*
    * Internal variables
    * ------------------
    */

    this._itemInfo = [];
    this._rows = {};

    this._cumulativeOffset = 0;

    this._currentColumns = 0;
    this._currentMargin = 0;

    // for throttling resize event
    this._resizeTimer;

    this._viewportWidth = window.innerWidth;
    this._viewportHeight = window.innerHeight;

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
    if( !this.container || !this.items || !this.itemSelector || !this.breakpoints )
      return false;

    this.items = Array.from( this.items );
    this._containerParent = this.container.parentNode;

    /* Set breakpoint ranges */

    let breakpointLength = this.breakpoints.length;

    this.breakpoints.forEach( ( bk, i ) => {
      let low = bk.width,
          high = 99999;

      if( breakpointLength > 1 && i < breakpointLength - 1 )
        high = this.breakpoints[i + 1]['width'];

      bk.low = low;
      bk.high = high;
    } );

    let set = this._setVars( true );

    if( set ) {
      this._getMargins();
      this._setMargins();
    }

    this._resizeHandler = this._resize.bind( this );
    window.addEventListener( 'resize', this._resizeHandler );

    return true;
  }

 /*
  * Internal helpers
  * ----------------
  */

  _setVars( init = false ) {

    /* Current columns and margin */

    this._currentColumns = 0;
    this._currentMargin = 0;

    this.breakpoints.forEach( ( bk ) => {
      if( this._viewportWidth >= bk.low && this._viewportWidth < bk.high ) {
        this._currentColumns = bk.columns;
        this._currentMargin = bk.margin;
      }
    } );

    if( !this._currentColumns && !this._currentMargin ) {
      this._setMargins( true );
      return false;
    }

    // get actual number of columns ( eg. user zoomed in )

    let firstOffset = 0,
        c = 0;

    for( let i = 0; i < this.items.length; i++ ) {
      let offset = this.items[i].offsetTop;
      
      if( i === 0 )
        firstOffset = offset;

      if( offset === firstOffset ) {
        c++;
      } else {
        break;
      }
    }

    if( c )
      this._currentColumns = c;

    /* Item and row info */

    if( !init )
      this._setMargins( true );

    this._cumulativeOffset = 0;

    this._rows = {};
    this._itemInfo = [];

    let scrollY = getScrollY();

    this.items.forEach( ( item, i ) => {
      let rect = item.getBoundingClientRect(),
          offsetTop = rect.top + scrollY,
          height = rect.height;

      if( !this._rows.hasOwnProperty( offsetTop ) )
      this._rows[offsetTop] = {
        items: [],
        ogHeights: [],
        ogHeight: 0,
        heights: [],
        height: 0
      };

      let indexInRow = this._rows[offsetTop].items.push( item );

      this._rows[offsetTop].ogHeights.push( height );
      this._rows[offsetTop].heights.push( height );

      let sI = i - this._currentColumns,
          sisterIndex = this.items[sI] ? sI : undefined;

      this._itemInfo.push( {
        item: item,
        top: offsetTop,
        bottom: rect.bottom + scrollY,
        height: height,
        sisterIndex: sisterIndex,
        indexInRow: indexInRow - 1,
        marginTop: 0
      } );
    } );

    for( let r in this._rows ) {
      let rr = this._rows[r];
      rr.ogHeight = Math.max( ...rr.ogHeights );
    }

    return true;
  }

  _getMargins() {
    this._itemInfo.forEach( ( it, i ) => {
      if( it.sisterIndex == undefined )
        return;

      let sister = this._itemInfo[it.sisterIndex],
          sisterOffset = sister.bottom,
          itOffset = it.top - this._cumulativeOffset,
          marginTop = itOffset - sisterOffset - this._currentMargin;

      if( marginTop < 0 )
        marginTop = 0;

      let newItHeight = it.height - marginTop;

      let row = this._rows[it.top];

      row.heights[it.indexInRow] = newItHeight;

      it.marginTop = marginTop;
      it.bottom = it.bottom - marginTop - this._cumulativeOffset;

      // set cumulative height at end of row
      if( it.indexInRow === row.heights.length - 1 ) {
        row.height = Math.max( ...row.heights );
        this._cumulativeOffset += row.ogHeight - row.height;
      }
    } );
  }

  _setMargins( unset = false ) {
    let frag = new DocumentFragment();

    frag.appendChild( this.container );

    let items = Array.from( frag.querySelectorAll( this.itemSelector ) );

    items.forEach( ( item, i ) => {
      item.parentNode.replaceChild( this.items[i], item );
    } );

    let actualItems = Array.from( frag.querySelectorAll( this.itemSelector ) );

    actualItems.forEach( ( item, i ) => {
      let val = 0;
      
      if( !unset )
        val = this._itemInfo[i].marginTop;
      
      let marginTop = unset ? '' : `-${ val }px`;

      item.style.marginTop = marginTop;
    } );

    this._containerParent.appendChild( frag );
  }

 /*
  * Event callbacks
  * ---------------
  */

  _resize() {
    // throttles resize event
    clearTimeout( this._resizeTimer );

    this._resizeTimer = setTimeout( () => {
      let viewportWidth = window.innerWidth;

      this._viewportHeight = window.innerHeight;

      if( viewportWidth != this._viewportWidth ) {
        this._viewportWidth = viewportWidth;
      } else {
        return;
      }

      this._setMargins( true );

      let set = this._setVars();

      if( set ) {
        this._getMargins();
        this._setMargins();
      }
    }, 100 );
  }

} // end MarginMasonry


/*
 * Imports
 * -------
 */

import { 
    mergeObjects, 
    prefix, 
    addClass, 
    removeClass, 
    hasClass 
} from '../../utils/utils';

/*
 * Collapse height of specified element by trigger elements
 * --------------------------------------------------------
 */

export default class Collapsible {

   /*
    * Constructor
    * -----------
    */

    constructor( args ) {

       /*
        * Public variables
        * ----------------
        */

        // items
        this.collapsible = null;
        this.trigger = null;

        // merge default variables with args
        mergeObjects( this, args );

       /*
        * Internal variables
        * ------------------
        */

        // for resize event
        this._resizeTimer; 
        this._viewportWidth = window.innerWidth;

        this._collapsibleHeight = 0;
        this._currentHeight = 0;

        this._set = true;

        // keep track of state
        this._open = false;

        // for keydown event
        this._keyCodes = {
            9: 'TAB',
            27: 'ESC',
            Tab: 'TAB',
            Escape: 'ESC'
        };

       /*
        * Initialize
        * ----------
        */

        let init = this._initialize();

        if( !init ) {
            return false;
        } else {
            return true;
        }
    }

   /*
    * Initialize
    * ----------
    */

    _initialize() {
        // check that required items exist
        if( !this.collapsible || !this.trigger )
            return false;

        // event listeners
        this.collapsible.addEventListener( 'keydown', this._keyDownHandler.bind( this ) );
        this.trigger.addEventListener( 'click', this._triggerHandler.bind( this ) );
        
        window.addEventListener( 'resize', this._resizeHandler.bind( this ) );

        window.addEventListener( 'load', () => {
            this._setCollapsibleHeight();
            this._toggleCollapsible( false );
        } );

        return true;
    }

   /*
    * Internal helpers
    * ----------------
    */

    _setCollapsibleHeight() {
        if( !this._set )
            return;

        this.collapsible.style.height = '';
        this._collapsibleHeight = this.collapsible.clientHeight;

        this.collapsible.style.height = this._currentHeight + 'px';
    }

    _toggleCollapsible( open = true ) {
        if( !this._set )
            return;

        this._open = open;
        this.trigger.setAttribute( 'aria-expanded', open );

        if( open ) {
            this.collapsible.style.height = this._collapsibleHeight + 'px';
            this._currentHeight = this._collapsibleHeight;
        } else {
            this.collapsible.style.height = 0;
            this._currentHeight = 0;
        }       
    }

   /*
    * Event handlers
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

            this._setCollapsibleHeight();
        }, 100 );
    }

    _triggerHandler() {
        this._toggleCollapsible( !this._open );
    }

    _keyDownHandler( e ) {
        let key = e.key || e.keyCode || e.which || e.code;

        if( !this._keyCodes.hasOwnProperty( key ) )
            return;

        let keyCode = this._keyCodes[key];

        if( keyCode === 'ESC' ) {
            this._toggleCollapsible( false );
        }
    }

   /*
    * Public methods
    * --------------
    */

    set( set = true ) {
        this._set = set;

        if( set ) {
            this._setCollapsibleHeight();
            this._toggleCollapsible( false );
        } else {
            this.collapsible.style.height = '';
        }
    }

} // end Collapsible

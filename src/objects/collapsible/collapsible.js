
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
        this.container = null;
        this.collapsible = null;
        this.trigger = null;
        this.nestedInstances = [];
        this.transitionDuration = 300;
        this.resize = true;
        this.onSet = () => {};

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

        // used in set method
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

        if( this.nestedInstances.length ) {
            this.nestedInstances.forEach( ( n ) => {
                n.onSet = () => {
                    let ogHeight = '';

                    if( this._open === false ) {
                        ogHeight = n.collapsible.style.height;
                        n.collapsible.style.height = '0';
                    }

                    this._setCollapsibleHeight( true );
                    this._toggleCollapsible( this._open );

                    if( this._open === false )
                        n.collapsible.style.height = ogHeight;
                };
            } );
        }

        window.addEventListener( 'load', () => {
            this._setCollapsibleHeight();
            this._toggleCollapsible( false );
            this._setClass();
        } );

        return true;
    }

   /*
    * Internal helpers
    * ----------------
    */

    _setClass() {
        if( this._set ) {
            addClass( this.container, '--set' );
        } else {
            removeClass( this.container, '--set' );
        }
    }

    _setCollapsibleHeight( onSet = false ) {
        if( !this._set )
            return;

        this.collapsible.style.height = '';
        this._collapsibleHeight = this.collapsible.scrollHeight;
    }

    _toggleCollapsible( open = true ) {
        if( !this._set )
            return;

        this._open = open;
        this.trigger.setAttribute( 'aria-expanded', open );

        this.collapsible.style.height = this._collapsibleHeight + 'px';

        if( open ) {
            if( this.container )
                addClass( this.container, '--expanded' );

            setTimeout( () => {
                this.collapsible.style.height = '';
                this.onSet();
            }, this.transitionDuration );
        } else {
            setTimeout( () => {
                this.collapsible.style.height = 0;

                setTimeout( () => {
                    if( this.container )
                        removeClass( this.container, '--expanded' );

                    this.onSet();
                }, this.transitionDuration );
            }, this.transitionDuration );
        }
    }

   /*
    * Event handlers
    * --------------
    */

    _resizeHandler() {
        if( !this.resize )
            return;

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
            this._toggleCollapsible( this._open );
        }, 100 );
    }

    _triggerHandler() {
        let open = !this._open;
        this._toggleCollapsible( open );
    }

    _keyDownHandler( e ) {
        let key = e.key || e.keyCode || e.which || e.code;

        if( !this._keyCodes.hasOwnProperty( key ) )
            return;

        let keyCode = this._keyCodes[key];

        if( keyCode === 'ESC' )
            this._toggleCollapsible( false );
    }

   /*
    * Public methods
    * --------------
    */

    set( set = true ) {
        this._set = set;
        this._setClass();

        if( set ) {
            this._setCollapsibleHeight();
            this._toggleCollapsible( this._open );
        } else {
            this.collapsible.style.height = '';
        }
    }

} // end Collapsible

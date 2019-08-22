
/*
 * Imports
 * -------
 */

import { mergeObjects } from '../../utils';

/*
 * Handles adding and removing multi fields
 * ----------------------------------------
 */

export default class Multi {

   /*
	* Constructor
	* -----------
	*/

	constructor( args ) {

       /*
        * Public variables
        * ----------------
        */

        this.item = null;
        this.itemAsString = null;
        this.buttonSelector = '';
        this.inputSelector = '';

        // merge default variables with args
        mergeObjects( this, args );

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
		if( !this.item || !this.itemAsString || !this.buttonSelector || !this.inputSelector )
			return false;

		this._parent = this.item.parentElement;
		
		let buttons = Array.from( this.item.querySelectorAll( this.buttonSelector ) );

		// event listener
		buttons.forEach( ( b ) => {
			b.addEventListener( 'click', this._clickHandler.bind( this ) );
			b.dataType = b.getAttribute( 'data-type' );
		} );
		
		return true;
	}	

   /*
	* Helper methods
	* --------------
	*/

	// get siblings
	_setItems() {
		this._items = Array.from( this._parent.children );
	}

	// append new item and add event listeners
	_setCopy() {
		this._setItems();

		// get index of current item
		let itemIndex = this._items.indexOf( this.item ),
			newItemIndex = itemIndex !== -1 ? itemIndex + 1 : false;

		// insert new item
		this.item.insertAdjacentHTML( 'afterend', this.itemAsString );

		if( newItemIndex === false )
			return;

		// delay for getting elements
		setTimeout( () => {
			let o = new Multi( {
				item: this._parent.children[newItemIndex], 
				itemAsString: this.itemAsString,
				buttonSelector: this.buttonSelector,
				inputSelector: this.inputSelector
			} );
		}, 100 );
	}

	// reset indexes on all items
	_reIndex() {
		// document fragment...

		this._items.forEach( ( item, i ) => {
			let inputs = Array.from( item.querySelectorAll( this.inputSelector ) );

			inputs.forEach( ( input ) => {
				input.name = input.name.replace( '%i', i );
				input.id = input.id.replace( '%i', i );
			} );
		} );
	}

   /*
	* Event Handlers
	* --------------
	*/

	_clickHandler( e ) {
		e.preventDefault();

		let button = e.currentTarget;

		if( button.dataType === 'add' ) {
			this._setCopy();
		} else {
			this._parent.removeChild( this.item );
		}

		this._setItems();
		this._reIndex();
	}

} // end Multi

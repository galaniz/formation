
/*
 * Imports
 * -------
 */

import {
	addClass,
	removeClass,
	mergeObjects,
	setLoaders,
	request
} from '../../utils/utils';

import Form from './form';

/*
 * Handle validating and sending forms with Google reCAPTCHA
 * ---------------------------------------------------------
 */

export default class SendForm {

 /*
	* Constructor
	* -----------
	*/

	constructor( args ) {

	 /*
		* Public variables
		* ----------------
		*/

		this.id = '';
		this.form = null;
		this.groupClass = '';
		this.fieldClass = '';
		this.labelClass = '';
		this.errorClass = '';
		this.submit = null;
		this.inputs = null;
		this.filterInputs = false;
		this.data = {};
		this.loaders = [];
		this.shake = false;
		this.siteKey = '';
		this.url = '';

		this.success = () => {};
		this.error = () => {};

		this.result = {
			container: null,
			textContainer: null,
			text: {
				error: '',
				success: ''
			}
		};

		// merge default variables with args
		mergeObjects( this, args );

	 /*
		* Internal variables
		* ------------------
		*/

		// form for validation
		this._form = null;

		// keep track of error / success
		this._error = false;

		// default messages
		this._defaultErrorMessage = 'Oops! Looks like something went wrong. Please try again later.';
		this._defaultSuccessMessage = 'Successfully sent!';

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
		// check that required variables not empty / null
		if( !this.id ||
				!this.form || 
				!this.groupClass ||
				!this.fieldClass ||
				!this.labelClass || 
				!this.submit || 
				!this.inputs ||
				!this.loaders || 
				!this.siteKey ||
				!this.url )
			return false;

		// default messages if none
		if( !this.result.text.hasOwnProperty( 'error' ) )
			this.result.text.error = this._defaultErrorMessage;

		if( !this.result.text.error )
			this.result.text.error = this._defaultErrorMessage;

		if( !this.result.text.hasOwnProperty( 'success' ) )
			this.result.text.success = this._defaultSuccessMessage;

		if( !this.result.text.success )
			this.result.text.success = this._defaultSuccessMessage;

		// prepare for validation
		this._form = new Form( {
			groupClass: this.groupClass,
			fieldClass: this.fieldClass,
			labelClass: this.labelClass,
			errorClass: this.errorClass,
			errorShake: this.shake,
			inputs: this.inputs
		} );

		// add event listeners
		this.form.addEventListener( 'submit', this._submit.bind( this ) );

		return true;
	}

 /*
	* Helper methods
	* --------------
	*/

	// display results of form submission
	_displayResult( error = false ) {
		let message = error ? this.result.text.error : this.result.text.success;

		this.result.textContainer.textContent = message;
		this.result.container.setAttribute( 'data-type', error ? 'error' : 'success' );
		this._error = error;

		setLoaders( this.loaders, [this.submit], false );
	}

 /*
	* Event Handlers
	* --------------
	*/

	_submit( e ) {
		e.preventDefault();

		// on change for inputs
		this._form.submitted = true;

		if( this.shake )
			removeClass( this.submit, 'a-shake' );

		let valid = this._form.validate();

		if( !valid ) {
			if( this.shake )
				addClass( this.submit, 'a-shake' );

			return;
		}

		setLoaders( this.loaders, [this.submit], true );

		// hide results container
		this.result.container.removeAttribute( 'data-type' );

		let formValues = this._form.getFormValues( true, this.filterInputs ),
				data = `id=${ this.id }&${ formValues }`;

		if( this.data ) {
			for( let d in this.data ) {
				data += `&${ d }=${ this.data[d] }`;
			}
		}

		// get recaptcha token to send to server
		grecaptcha.execute( this.siteKey, { action: 'send_form' } ).then( ( token ) => {
			data += `&recaptcha=${ token }`;

			console.log( 'DATA', data );

			request( {
				method: 'POST',
				url: this.url,
				headers: { 'Content-type': 'application/x-www-form-urlencoded' },
				body: data
			} )
			.then( response => {
				console.log( 'RESPONSE', response );

				try {
					this.success.call( this, JSON.parse( response ) );
					this._displayResult();
				} catch( e ) {
					this._displayResult( true );
				}
			} )
			.catch( xhr => {
				console.log( 'ERROR', xhr );

				this._displayResult( true );
				this.error();
			} );
		} );
	}

 /*
	* Public methods
	* --------------
	*/

	clear( exclude = [] ) {
		if( this._form )
			this._form.clear( exclude );

		// end loader
		this.loader.setAttribute( 'data-hide', '' );

		// hide results container
		this.result.container.removeAttribute( 'data-type' );
	}

} // end SendForm

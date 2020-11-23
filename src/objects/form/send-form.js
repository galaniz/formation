
/*
 * Imports
 * -------
 */

import {
	addClass,
	removeClass,
	recurseObject,
	mergeObjects,
	disableButtonLoader,
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
		this.loader = null;
		this.shake = false;
		this.siteKey = '';
		this.url = '';

		this.success = () => {};
		this.error = () => {};

		this.result = {
			container: null,
			textContainer: null,
			text: {
				error: 'Oops! Looks like something went wrong. Please try again later.',
				success: 'Successfully submitted!'
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
		let requiredError = false;

		recurseObject( this,
			( prop, value ) => {
				if( prop != 'errorClass' && prop != 'filterInputs' && prop != 'data' && !value )
					requiredError = true;
			},
			( prop, value ) => {
				if( prop.indexOf( '_' ) > -1 )
					return false;

				return true;
			}
		);

		if( requiredError )
			return false;

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

		// disable button
		disableButtonLoader( this.submit, this.loader, false, true );

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

				// enable button
				disableButtonLoader( this.submit, this.loader );

				try {
					this.success.call( this, JSON.parse( response ) );
					this._displayResult();
				} catch( e ) {
					this._displayResult( true );
				}
			} )
			.catch( xhr => {
				console.log( 'ERROR', xhr );

				// enable button
				disableButtonLoader( this.submit, this.loader );

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


/*
 * Imports
 * -------
 */

import {
	addClass, 
	removeClass, 
	closest,
	urlEncode,
	mergeObjects
} from '../../utils';

/*
 * Validate and get values from form inputs
 * ----------------------------------------
 */

export default class Form {

   /*
	* Constructor
	* -----------
	*/

	constructor( args ) {

       /*
        * Public variables
        * ----------------
        */

        this.inputs = null;
        this.fieldClass = '';
		this.submitted = false;
		this.errorShake = false;
		this.errorShakeClass = 'a-shake';

        // merge default variables with args
        mergeObjects( this, args );

       /*
        * Internal variables
        * ------------------
        */

		// regex for url, email inputs
		this._exp = {
			url: /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
			email: /^[a-zA-Z0-9.!#$%&'*+-\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
		};

		// input data goes here
		this._inputGroups = {};

		// input types by name
		this._inputTypes = {};

		// input labels by name
		this._inputLabels = {};

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
		if( !this.inputs || !this.fieldClass )
			return false;

		this.inputs = Array.from( this.inputs );

		// convert input types to names wp accept for sanitization
		let inputTypeTranslations = {
			text: 'text_field',
			select: 'text_field',
			textarea: 'textarea_field',
			email: 'email'
		};

		// loop through inputs to insert input data into inputGroups
		this.inputs.forEach( ( input ) => {
			let name = input.name;

			// already exists in inputGroups so just push input into inputs array
			if( this._inputGroups.hasOwnProperty( name ) ) {
				this._inputGroups[name].inputs.push( input );
			} else {
				// doesn't exist so create new object of input data 
				let reqAttr = input.getAttribute( 'aria-required' ),
					required = ( reqAttr == 'true' || reqAttr == '1' ),
					type = input.tagName.toLowerCase();

				if( type === 'input' ) type = input.type;

				if( inputTypeTranslations.hasOwnProperty( type ) ) {
					this._inputTypes[name] = inputTypeTranslations[type];
				} else {
					this._inputTypes[name] = '';
				}

				if( type === 'radio' || type === 'checkbox' ) {
					this._inputLabels[name] = input.nextElementSibling.nextElementSibling.textContent;
				} else {
					this._inputLabels[name] = input.previousElementSibling.textContent;
				}

				this._inputGroups[name] = {
					inputs: [input], // array for checkboxes and radio buttons
					field: closest( input, this.fieldClass ),
					required: required,
					type: type,
					values: [],
					valid: false
				};
			}

			// listen on change so can validate then rather than submit
			input.addEventListener( 'change', this._onChange.bind( this ) );
		} );

		return true;
	}

   /*
	* Internal helper methods
	* -----------------------
	*/

	_validateInputs( inputs, type, required ) {
		let values = [],
			message = '',
			valid = false;

		// get values from inputGroup
		inputs.forEach( ( input ) => {
			let value = '';
			
			switch( type ) {
				case 'checkbox':
				case 'radio':
					value = ( input.checked ? input.value.trim() : '' );
					break;
				case 'select':
					value = input.options[input.selectedIndex].value.trim();
					break;
				default:
					value = input.value.trim();
			} // end of switch

			if( value !== '' )
				values.push( value );
		} );

		// if inputGroup has no values
		if( values.length === 0 ) {
			if( required ) {
				valid = false;
				message = 'This field is required';
			} else {
				valid = true;
			}
		} else { // inputGroup has values
			// check if inputs like email, url etc are valid 
			switch( type ) {
				case 'email':
					if( values[0].match( this._exp.email ) ) {
						valid = true;
					} else {
						valid = false;
						message = 'Please enter a valid email';
					}
					break;
				case 'url':
					if( values[0].match( this._exp.url ) ) {
						valid = true;
					} else {
						valid = false;
						message = 'Please enter a valid URL';
					}
					break;
				default:
					valid = true;
			} // end of switch
		}

		return {
			values: values,
			message: message,
			valid: valid
		}
	}

	_validateGroup( inputGroup, name ) {
		// get inputGroup data
		let validGroup = true,
			inputs = inputGroup.inputs,
			field = inputGroup.field,
			type = inputGroup.type,
			required = inputGroup.required;

		// validate inputGroup
		let validate = this._validateInputs( inputs, type, required ),
			values = validate.values,
			valid = validate.valid,
			message = validate.message;

		if( !valid ) {
			this._setErrorMessage( inputs, name, field, message );
			validGroup = false;
		} else {
			this._removeErrorMessage( inputs, name, field );
		}

		// save valid state and values in inputGroup
		inputGroup.values = values;
		inputGroup.valid = valid;

		return validGroup;
	}

	_setErrorMessage( inputs, name, field, message ) {
		// error element id 
		let errorID = name + '-error';

		// check if error element exists
		let error = document.getElementById( errorID );

		if( error !== null ) { // exists
			let messageElement = error.querySelector( '.o-form-error__message' );
			messageElement.textContent = message;
		} else { // doesn't exist
			field.insertAdjacentHTML( 'beforeend', 
				`<div id="${ errorID }" class="o-form-error">
					<span class="o-form-error__message">
						${ message }
					</span>
				</div>` 
			);
		}

		if( this.errorShake )
			addClass( field, this.errorShakeClass );

		// set inputs as invalid
		inputs.forEach( ( input ) => {
			input.setAttribute( 'aria-invalid', true );
			input.setAttribute( 'aria-describedby', errorID );
		} );
	}

	_removeErrorMessage( inputs, name, field ) {
		// error element id 
		let errorID = name + '-error';

		// check if error element exists
		let error = document.getElementById( errorID );
		
		if( error !== null ) // exists
			field.removeChild( error );

		if( this.errorShake )
			removeClass( field, this.errorShakeClass );

		// set inputs as valid
		inputs.forEach( ( input ) => {
			input.setAttribute( 'aria-invalid', false );
			input.setAttribute( 'aria-describedby', '' );
		} );
	}

	_onChange( e ) {
		let input = e.currentTarget,
			name = input.name,
			inputGroup = this._inputGroups[name];

		if( this.submitted )
			this._validateGroup( inputGroup, name );
	}

   /*
	* Public methods
	* --------------
	*/

	validate() {
		let validForm = true;

		// validate individual input groups
		for( let name in this._inputGroups ) {
			let validGroup = this._validateGroup( this._inputGroups[name], name );

			if( !validGroup ) 
				validForm = false;
		}

		return validForm;
	}

	getFormValues( urlEncoded = false ) {
		let formValues = {};

		for( let name in this._inputGroups ) {
			let inputGroup = this._inputGroups[name],
				values = inputGroup.values;

			if( values.length === 0 ) {
				values = '';
			} else if( values.length === 1 ) {
				values = values[0];
			} else {
				values = values;
			}

			formValues[name] = {
				value: values,
				type: this._inputTypes[name],
				label: this._inputLabels[name]
			};
		}

		formValues = { inputs: formValues };

		if( urlEncoded )
			formValues = urlEncode( formValues );

		return formValues;
	}

	clear( exclude = [] ) {
		for( let name in this._inputGroups ) {
			let inputGroup = this._inputGroups[name],
				inputs = inputGroup.inputs,
				field = inputGroup.field,
				type = inputGroup.type;

			// remove error markup if exists
			this._removeErrorMessage( inputs, name, field );

			if( exclude.indexOf( name ) == -1 ) {
				inputs.forEach( ( input ) => {
					switch( type ) {
						case 'checkbox':
						case 'radio':
							input.checked = false;
							break;
						default:
							input.value = '';
					}

					// clear floated label
					setTimeout( () => {
						input.focus();
						input.blur();
					}, 100 );
				} );
			}
		}
	}

} // end Form

module.exports.Form = Form;

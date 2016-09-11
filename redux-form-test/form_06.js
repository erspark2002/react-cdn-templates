const { Component } = React;
const { Provider, connect } = ReactRedux;
const { combineReducers, createStore } = Redux;
const { reducer: formReducer, reduxForm } = ReduxForm;

const notes = 'NOTES: Uses <input> component - Synchronous Validation Example. Can specified required, and custom validator.';

/*
Form data is passed to validate() on every keypress.
this.props.errors is passed to component, so errors can be shown.

Note: validate is called on form load.
Need to check fields.username.touched to check whether to show errors or not.

Functions
	validate
		validates form every keypress, and When submit pressed.

	handlesubmit
		<form onSubmit={handleSubmit(this.handleSubmit)}>
		Submit the form when correct.
		Can dispatch actions.
		Reset fields.

http://redux-form.com/6.0.2/examples/syncValidation/
Internal this.handleSubmit received data onSubmit

*/

const onSubmit = (data, dispatch) => {
	console.log('#onSubmit data:', data);
};

const isNumber = (num) => {
	return !isNaN(Number(num));
};
const isLessThan =(num, target) => {
	return isNumber(num) && num < target;
};


//-------------------
// REGEX VALIDATORS
//-------------------
const REGEX_EMAIL = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
//phone
//alpha


//------------------------
// VALIDATION HELPERS
//------------------------
// const emailValidator = value => REGEX_EMAIL.test(value);
// @param fieldName optional - provide custom name using generic message

// @param message optional - override default message
// @param value to validate
// @return false if no error, else return error message
const emailValidator = (message = 'Please enter a valid email address') => value => {
	if (!REGEX_EMAIL.test(value)) {
		return message;
	}
};
const numberValidator = (message = 'Please enter a number') => value => {
	if (isNaN(Number(value))) {
		return message;
	}
};

// Handle 'required' validators, and custom validators
const validate = rules => values => {
	console.log('##validate');
	const errors = {};
	Object.keys(rules).forEach(fieldName=>{
		const fieldRules = rules[fieldName];
		const fieldValue = values[fieldName];
		if((fieldRules.required && !fieldValue) || (fieldValue && fieldValue.trim() === '')) {
			errors[fieldName] = `Please enter ${fieldName}`;
		} else if(fieldValue && fieldRules.validator) {
			const message = fieldRules.validator(fieldValue);
			message && (errors[fieldName] = message);
		}
	});
	return errors;
};

// -------------------
// COMPONENTS
// -------------------
class ContactForm extends Component {
	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	// called when valid.
	handleSubmit(data) {
		console.log('#this.handleSubmit data:', data);
		//this.props.dispatch();
		console.log('done handleSubmit');
		// this.setState({fakeSaving: true, fakeSubmitted: data});
		// clear values

		
	}

	render() {
		const {fields: {firstName, lastName, email, age}, handleSubmit, onSubmit, errors} = this.props;
		return (
			<div>
				<p>{notes}</p>
				<form onSubmit={handleSubmit(this.handleSubmit)}>
					<label>First Name</label>
					<div>
						<input type="text" placeholder="First Name" isRequired {...firstName}/>
						<div>{firstName.touched && errors.firstName}</div>
					</div>
					<p></p>
					<label>Email</label>
					<div>
						<input type="text" placeholder="Email" {...email}/>
						<div>{email.touched && errors.email}</div>
					</div>
					<p></p>
					<label>Age</label>
					<div>
						<input type="text" placeholder="Age" {...age}/>
						<div>{age.touched && errors.age}</div>
					</div>
					<p></p>
					<button type="submit">Submit</button>
				</form>
			</div>
		);
	}
}

// validation rules are separate from form, so form can be reused.
const required = true;
const validationRules = {
	firstName: {required},
	email: {
		required,
		validator: emailValidator(),
		// validator: emailValidator('Enter your email')
	},
	age: {
		validator: numberValidator()
	}
};
const getFields = rules => Object.keys(rules);
const ContactFormConnected = reduxForm({ 
	form: 'contact',
	fields: getFields(validationRules),
	validate: validate(validationRules),
	onSubmit
})(ContactForm);

//--------------------
// Redux / Main App
//--------------------
const reducers = {
	form: formReducer
};
const reducer = combineReducers(reducers);
const store = createStore(reducer);
class App extends Component {render() {return(<ContactFormConnected />)}}
ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('app')
);

console.log('done');

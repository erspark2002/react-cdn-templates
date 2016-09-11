const { Component } = React;
const { Provider, connect } = ReactRedux;
const { combineReducers, createStore } = Redux;
const { reducer: formReducer, reduxForm } = ReduxForm;

const notes = 'NOTES: Uses <input> component - Synchronous Validation Example. REQUIRED prop';

/*
Form data is passed to validate() on every keypress.
this.props.errors is passed to 

http://redux-form.com/6.0.2/examples/syncValidation/
Internal this.handleSubmit received data onSubmit

*/

const onSubmit = (data, dispatch) => {
	console.log('#onSubmit data:', data);
};

// const validRequired = (field, options = {}) => (value = '') => {
// 	if (!trim(value)) {
// 		return options.selectable ? selectRequired(field, options.connector) : textRequired(field);
// 	}
// };

// const textRequired = field => `Enter your ${field}?`;
// const validRequired = field => (value = '') => {
// 	if (!trim(value)) {
// 		return textRequired(field);
// 	}
// };

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
	return false;
};

// Handle 'required' validators, and custom validators
const validate = rules => values => {
// const validate = () => rules => values => {
	console.log('#validate');
	console.log('  #rules:', rules);
	console.log('  #values:', values);
	const errors = {};

	Object.keys(rules).forEach(fieldName=>{
		const fieldRules = rules[fieldName];
		const fieldValue = values[fieldName];
		console.log('--#field:', fieldName);
		console.log('  #fieldRules:', fieldRules);
		// handle 'required' rules
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
		// alert('submitted');
		console.log('#this.props.dispatch:', this.props.dispatch);
		console.log('done handleSubmit');
		// this.setState({fakeSaving: true, fakeSubmitted: data});
		// setTimeout(() => this.setState({fakeSaving: false}), 2000);
	}

	render() {
		console.log('#this.props 222:', this.props);
		const {fields: {firstName, lastName, email, age}, handleSubmit, onSubmit, errors} = this.props;
				// <form onSubmit={this.props.handleSubmit(this.handleSubmit)}>

				// <form onSubmit={handleSubmit}>
		return (
			<div>
				<p>{notes}</p>
				<form onSubmit={handleSubmit(this.handleSubmit)}>
					<label>First Name</label>
					<div>
						<input type="text" placeholder="First Name" isRequired {...firstName}/>
						<div>{errors.firstName}</div>
					</div>
					<p></p>
					<label>Email</label>
					<div>
						<input type="text" placeholder="Email" {...email}/>
						<div>{errors.email}</div>
					</div>
					<p></p>
					<label>Age</label>
					<div>
						<input type="text" placeholder="Age" {...age}/>
						<div>{errors.age}</div>
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

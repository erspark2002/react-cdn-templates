const { Component, PropTypes } = React;
const { Provider, connect } = ReactRedux;
const { combineReducers, createStore, compose } = Redux;
const { reducer: formReducer, reduxForm } = ReduxForm;

//---
// Thunk and chrome reactDevTools
const {applyMiddleware} = Redux;
const thunk = ReduxThunk.default;
// const thunk = null;

const notes = 'NOTES: Uses <input> component - Synchronous Validation Example. Can specified required, and custom validator.';

const imports = {
	Component,
	Provider,
	connect,
	combineReducers,
	createStore,
	formReducer,
	reduxForm,
	thunk
};
const nullCheck = (obj) => {
	const keys = Object.keys(obj);
	console.log('#keys:', keys);
	for (const k of keys) {
		if (!obj[k] || typeof obj[k] === 'undefined') {
			console.log('###############################');
			console.log(`# KEY ${k} IS NOT DEFINED`);
			console.log('###############################');
		} else {
			// console.log(`#key ${k} IS defined. value: ${obj[k]}`);
			// console.log(`#key ${k} IS defined.`);
			const value = obj[k].toString();
			if (value.indexOf('native') > 0) {
				console.log('###############################');
				console.log(`# WARNING. KEY ${k} refers to native code`);
				console.log('###############################');
			}
		}
	}
};
nullCheck(imports);

//---------------------

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
		const {fields: {firstName, lastName, email, age, phones}, handleSubmit, onSubmit, errors} = this.props;

		console.log('-------- ContactForm render ---------');
		console.log('  #this.state:', this.state);
		console.log('  #this.props:', this.props);

		if (!phones.length) {
			phones.addField();
		}

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

					<label>Phones</label>
					<p></p>
					{phones.map((phone, index)=>
						<div key={index}>
							<input type="text" placeholder="Phone Number" {...phone}/>
						</div>
					)}
					<button onClick={(e) => {
						e.preventDefault();
						phones.addField();
					}}>Add Phone</button>
					<p></p>
					<button type="submit">Submit</button>
				</form>
			</div>
		);
	}
}

ContactForm.propTypes = {
	firstName: PropTypes.object,
	email: PropTypes.object,
	age: PropTypes.object,
	phones: PropTypes.arrayOf(PropTypes.object)
};

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
	},
	'phones[]': {}
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

//-------
// const store = createStore(reducer);
window.thunk = thunk;

let devTools = f => f;
if (window && window.devToolsExtension) {
	devTools = window.devToolsExtension();
}

const initialState = {
	form: {}
};

const store = createStore(
	reducer,
	initialState,
	compose(
		applyMiddleware(thunk),
		devTools
	)
);
console.log('#store:', store);

//-------


class App extends Component {render() {return(<ContactFormConnected />)}}
ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('app')
);

console.log('done');

const { Component } = React;
const { Provider, connect } = ReactRedux;
const { combineReducers, createStore } = Redux;
const { reducer: formReducer, reduxForm, Field, Fields } = ReduxForm;

const notes = 'NOTES: ReduxForm with initialValues';

/*
version 5.3

use initialValues
load form with previous values.

redux-logger

form data passed

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
const _onSubmit = (data, dispatch) => {
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
const numberValidator = (message = 'Please enter a number') => (value, values) => {
	console.log('#numberValidator value:', value);
	console.log('#values:', values);
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
			// const message = fieldRules.validator(fieldValue);
			const message = fieldRules.validator(fieldValue, values);
			message && (errors[fieldName] = message);
		}
	});
	return errors;
};

// -------------------
// COMPONENTS
// -------------------

class Button extends Component {
	constructor() {
		super();
		console.log('--> Button constructor called.');
	}

	render() {
		return(
			<button>Submit</button>
		);
	}
}

class User extends Component {
	constructor() {
		super();
		this.state = {
			name: 'bob'
		};
		console.log('--> User constructor called.');
	}

	render() {
		return(
			<div>
				<ul>
					<li onClick={() => this.setState({name: 'bob', key: 1})}><a href="#">bob</a></li>
					<li onClick={() => this.setState({name: 'greg', key: 2})}><a href="#">greg</a></li>
				</ul>
				{this.state.name && (
					<ContactFormConnected user={this.state.name} key={this.state.key}/>
				)}
			</div>
		);
	}
}

class ContactForm extends Component {
	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);

		this.state = {
			showButton: true
		};
		console.log('--> ContactForm constructor called.');
	}

	// called when valid.
	handleSubmit(data) {
		console.log('#this.handleSubmit data:', data);
		//this.props.dispatch();
		// this.setState({fakeSaving: true, fakeSubmitted: data});
		// clear values


	}

	toggleButton() {
		this.setState({showButton: !this.state.showButton});
	}

	render() {
		// const {fields: {firstName, lastName, email, age}, handleSubmit, onSubmit, errors} = this.props;
		const {handleSubmit, onSubmit, errors} = this.props;
		console.log('#handleSubmit:', handleSubmit);
		console.log('#onSubmit:', onSubmit);
		console.log('#errors:', errors);

		// const showButton = this.state.showButton;
		// <p>{notes}</p>

					// <button type="submit" onClick={data => this.handleSubmit(data)}>Submit</button>
{/*
				<form onSubmit={handleSubmit(this.handleSubmit)}>
				<form onSubmit={(values)=>{
					console.log('submitted values:', values);
					//handleSubmit(this.handleSubmit);
				}}>
*/}
		return (
			<div>
				<form onSubmit={(event)=>{
					event.preventDefault();
				}}>
					<label>First Name</label>
					<Field name="firstName" component={firstName=>(
						<div>
							<input type="text" placeholder="First Name" {...firstName} />
							<div>{firstName.touched && firstName.error}</div>
							TYPE: "{firstName.value}"
							{

							}
						</div>
					)} />

					<button type="submit" onClick={()=>{
						console.log('submit clicked.');
						// handleSubmit(data=>this.handleSubmit(data))();
						handleSubmit(data=>{
							console.log('## handleSubmit data:', data);
							this.handleSubmit(data);
						})();
						console.log('submit clicked - done.');
					}}>Submit</button>

{/*
	value="harry"
					<button type="submit" onClick={handleSubmit(this.handleSubmit)}>Submit</button>

					<button type="submit" onClick={event => {
						console.log('#event:', event);
						// handleSubmit(data=>this.handleSubmit(data))();
						handleSubmit(this.handleSubmit);
					}}>Submit</button>

*/}
				</form>
			</div>
		);

		// return (
		// 	<div>
		// 		<form onSubmit={handleSubmit(this.handleSubmit)}>
		// 			<label>First Name</label>
		// 			<div>

		// 				<input type="text" placeholder="First Name" {...firstName}/>
		// 				<div>{firstName.touched && errors.firstName}</div>
		// 			</div>
		// 			<p></p>
		// 			<label>Email</label>
		// 			<div>
		// 				<input type="text" placeholder="Email" {...email}/>
		// 				<div>{email.touched && errors.email}</div>
		// 			</div>
		// 			<p></p>
		// 			<label>Age</label>
		// 			<div>
		// 				<input type="text" placeholder="Age" {...age}/>
		// 				<div>{age.touched && errors.age}</div>
		// 			</div>
		// 			<p></p>
		// 			<button type="submit" onClick={() => this.toggleButton()}>Toggle</button>
		// 		</form>
		// 	</div>
		// );
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
// const ContactFormConnected = reduxForm({
// 	form: 'contact',
// 	fields: getFields(validationRules),
// 	validate: validate(validationRules),
// 	onSubmit
// })(ContactForm);

const _validateHardcodedSuccess = (values) => {
	console.log('#_validateHardcodedSuccess values:', values);
	return {};
};

const ContactFormConnected = reduxForm({
	form: 'contact',
	fields: getFields(validationRules),
	// validate: validate(validationRules),
	validate: _validateHardcodedSuccess
	// onSubmit: _onSubmit
},(state, ownProps) => {
	console.log('#state:', state);
	console.log('#ownProps:', ownProps);

	return ({
		initialValues: {
			firstName: ownProps.user
		}
	});

})(ContactForm);

//--------------------
// Redux / Main App
//--------------------
const reducers = {
	form: formReducer
};
const reducer = combineReducers(reducers);

// const store = createStore(reducer);
// let store = createStore(reducer, window.devToolsExtension && window.devToolsExtension());

// Test that ReduxDevTools is installed correctly.
	// http://zalmoxisus.github.io/examples/counter/

// Note: passing enhancer as last argument requires redux@>=3.1.0. For older versions apply it like here or here.
// https://github.com/zalmoxisus/redux-devtools-extension#usage

const initialState = {
	form: {}
};
let store = createStore(reducer, initialState,
	window.devToolsExtension && window.devToolsExtension()
);

// class App extends Component {render() {return(<ContactFormConnected />)}}
class App extends Component {render() {return(<User />)}}

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('app')
);

console.log('done');

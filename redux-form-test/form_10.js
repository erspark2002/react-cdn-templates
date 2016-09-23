const { Component } = React;
const { Provider, connect } = ReactRedux;
const { combineReducers, createStore} = Redux;
const { reducer: formReducer, reduxForm, Field, Fields } = ReduxForm;

//---
const {applyMiddleware} = Redux;
// const thunk = ReduxThunk;
const thunk = ReduxThunk.default;

// const {constructor} = ReduxThunk;
// window.thunk = constructor;
// const thunk = constructor;

// console.log('#Component:', Component);
// console.log('#Provider:', Provider);
// console.log('#connect:', connect);
// console.log('#combineReducers:', combineReducers);
// console.log('#createStore:', createStore);
// console.log('#formReducer:', formReducer);
// console.log('#reduxForm:', reduxForm);
// console.log('#Field:', Field);
// console.log('#Fields:', Fields);

// console.log('#applyMiddleware:', applyMiddleware);
// console.log('#thunk:', thunk);
// console.log('#Provider:', Provider);

const imports = {
	Component,
	Provider,
	connect,
	combineReducers,
	createStore,
	formReducer,
	reduxForm,
	Field,
	Fields,
	thunk
};
const nullCheck = (obj) => {
	const keys = Object.keys(obj);
	// console.log('#keys:', keys);
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


// import {createStore, applyMiddleware} from 'redux';

// import thunk from 'redux-thunk';
// import createLogger from 'redux-logger';

const notes = 'NOTES: ReduxForm with initialValues';

/*
version 6.0.2

use initialValues from ownProps - passed in from parent component.

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

const onSubmitExternal = data => {
	console.log('#onSubmitExternal data:', data);
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

	renderField(props) {
		console.log('#renderField props:', props);
		const { input, label, type, meta: { touched, error } } = props;
		return (
			<div>
				<label>{label}</label>
				<div>
					<input {...input} placeholder={label} type={type}/>
				</div>
			</div>
		);
	}

	render() {
		// const {fields: {firstName, lastName, email, age}, handleSubmit, onSubmit, errors} = this.props;
		const {handleSubmit, onSubmit, errors} = this.props;
		// console.log('#handleSubmit:', handleSubmit);
		// console.log('#onSubmit:', onSubmit);
		// console.log('#errors:', errors);

		console.log('#ContactForm this.props:', this.props);
		// console.log('#this.state:', this.state);

		return (
			<div>
				<form>
					<label>First Name</label>
					<Field name="firstName" component={this.renderField} />
					<button type="submit" onClick={handleSubmit(onSubmit)}>Submit</button>
{/*
					<button type="submit" onClick={()=>{
						console.log('submit clicked.');
						// handleSubmit(data=>this.handleSubmit(data))();
						handleSubmit(data=>{
							console.log('## handleSubmit data:', data);
							this.handleSubmit(data);
						})();
						console.log('submit clicked - done.');
					}}>Submit</button>
*/}
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
const _validateHardcodedError = (values) => {
	console.log('#_validateHardcodedError values:', values);
	return {firstName: 'please enter first name.'};
};

const _initialValues = {
	firstName: 'bob2'
};

// ***
// const ContactFormConnected = reduxForm({
// 	form: 'contact',
// 	fields: getFields(validationRules),
// 	validate: _validateHardcodedSuccess,
// 	// validate: _validateHardcodedError,
// 	onSubmit: onSubmitExternal,
// 	initialValues: _initialValues
// },(state, ownProps) => {
// 	console.log('#11 state:', state);
// 	console.log('#11 ownProps:', ownProps);

// 	// return ({
// 	// 	initialValues: {
// 	// 		firstName: ownProps.user
// 	// 	}
// 	// });
// 	return {};
// })(ContactForm);

const ContactFormConnectedRf = reduxForm({
	form: 'contact',
	fields: getFields(validationRules),
	validate: _validateHardcodedSuccess,
	// validate: _validateHardcodedError,
	onSubmit: onSubmitExternal,
	// initialValues: _initialValues
	enableReinitialize: true
})(ContactForm);

// NOTE: In version 6, you need to connect separately.
const ContactFormConnected = connect(
	(state, ownProps) => {
		console.log('#11 state:', state);
		console.log('#11 ownProps:', ownProps);

		return ({
			initialValues: {
				firstName: ownProps.user
			}
		});
	}
)(ContactFormConnectedRf);


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
	// http://zalmoxisus.gizxb.io/examples/counter/

// Note: passing enhancer as last argument requires redux@>=3.1.0. For older versions apply it like here or here.
// https://github.com/zalmoxisus/redux-devtools-extension#usage

//------------------
// Original Store
const initialState = {
	form: {}
};
// works for simple store.
// let store = createStore(reducer, initialState,
// 	window.devToolsExtension && window.devToolsExtension()
// );

//------------------
// Add middleware with devTools
// const middlewares = [thunk, unauthorizeMiddleware, redirectMiddleware];
const middlewares = [thunk];

// // export default (initialState = {}) => createStore(
// let store = createStore(
//   // rootReducer,
//   reducer,
//   initialState,
//   applyMiddleware(...middlewares)
//   // devTools
// );

// // http://stackoverflow.com/questions/32804097/redux-middleware-is-not-defined
// let store = applyMiddleware(
//     thunk
// )(createStore);
// #store: (reducer, initialState, enhancer) {  //function
// console.log('#store:', store);

window.thunk = thunk;

let devTools = f => f;
if (window && window.devToolsExtension) {
  devTools = window.devToolsExtension();
}

// NOTE: Get 'no store found' if initialState passed as 2nd param.

// dan
const store = createStore(
  reducer,
  // initialState,
  applyMiddleware(thunk),
  devTools
);
console.log('#store:', store);

//------------------

// class App extends Component {render() {return(<ContactFormConnected />)}}
class App extends Component {render() {return(<User />)}}

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('app')
);

console.log('done');

const { Component } = React;
const { Provider, connect } = ReactRedux;
const { combineReducers, createStore } = Redux;
const { reducer: formReducer, reduxForm, Field, Fields } = ReduxForm;

console.log('#formReducer:', formReducer);

const notes = 'NOTES: ReduxForm with initialValues';

/*
v6.0.5
sync validation.

use initialValues
load form with previous values.
*/

// import React from 'react'
// import { Field, reduxForm } from 'redux-form'

const validate = values => {
	console.log('#validate values:',  values);
	// const errors = {}
	// if (!values.username) {
	//   errors.username = 'Required'
	// } else if (values.username.length > 15) {
	//   errors.username = 'Must be 15 characters or less'
	// }
	// if (!values.email) {
	//   errors.email = 'Required'
	// } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
	//   errors.email = 'Invalid email address'
	// }
	// if (!values.age) {
	//   errors.age = 'Required'
	// } else if (isNaN(Number(values.age))) {
	//   errors.age = 'Must be a number'
	// } else if (Number(values.age) < 18) {
	//   errors.age = 'Sorry, you must be at least 18 years old'
	// }
	// return errors
};

// const renderField = ({ input, label, type, meta: { touched, error } }) => (
// 	<div>
// 		<label>{label}</label>
// 		<div>
// 			<input {...input} placeholder={label} type={type}/>
// 			{touched && error && <span>{error}</span>}
// 		</div>
// 	</div>
// );

const renderField = ({ input, label, type, meta: { touched, error } }) => (
	<div>
		<label>{label}</label>
		<div>
			<input {...input} placeholder={label} type={type}/>
		</div>
	</div>
);

const _handlesubmit = data => {
	console.log('#_handlesubmit data:', data);
};

const SyncValidationForm = (props) => {
	const { handleSubmit, pristine, reset, submitting } = props;
	return (
		<form onSubmit={handleSubmit}>
			<Field name="username" type="text" component={renderField} label="Username"/>
			<Field name="email" type="email" component={renderField} label="Email"/>
			<Field name="age" type="number" component={renderField} label="Age"/>
			<div>
				<button type="submit" disabled={submitting}>Submit</button>
				<button type="button" disabled={pristine || submitting} onClick={reset}>Clear Values</button>
			</div>
		</form>
	);
};

// export default reduxForm({
const SyncValidationFormConnected = reduxForm({
	form: 'syncValidation',  // a unique identifier for this form
	validate,                 // <--- validation function given to redux-form
	handlesubmit: _handlesubmit
})(SyncValidationForm);

//--------------------
// Redux / Main App
//--------------------
const reducers = {
	form: formReducer
};
const reducer = combineReducers(reducers);

const store = createStore(reducer);
// let store = createStore(reducer, window.devToolsExtension && window.devToolsExtension());

// Test that ReduxDevTools is installed correctly.
	// http://zalmoxisus.github.io/examples/counter/

// Note: passing enhancer as last argument requires redux@>=3.1.0. For older versions apply it like here or here.
// https://github.com/zalmoxisus/redux-devtools-extension#usage

// const initialState = {
// 	form: {}
// };
// let store = createStore(reducer, initialState,
// 	window.devToolsExtension && window.devToolsExtension()
// );

// class App extends Component {render() {return(<ContactFormConnected />)}}
class App extends Component {render() {return(<SyncValidationFormConnected />)}}

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('app')
);

console.log('done');

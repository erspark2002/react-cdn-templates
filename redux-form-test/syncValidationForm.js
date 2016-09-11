// Example from:
// http://redux-form.com/6.0.2/examples/syncValidation/

/*
NOTES:
- needs version 6, but v6 passes fields as an array!!??
*/

// import React from 'react';
// import { Field, reduxForm } from 'redux-form';

const { Component } = React;
const { Provider, connect } = ReactRedux;
const { combineReducers, createStore } = Redux;
// const { reducer: formReducer, reduxForm, Field } = ReduxForm;
const { reducer: formReducer, reduxForm } = ReduxForm;

const notes = 'NOTES: Uses <input> component - Synchronous Validation Example. REQUIRED prop';

const validate = values => {
	const errors = {};
	if (!values.username) {
		errors.username = 'Required';
	} else if (values.username.length > 15) {
		errors.username = 'Must be 15 characters or less';
	}
	if (!values.email) {
		errors.email = 'Required';
	} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
		errors.email = 'Invalid email address';
	}
	if (!values.age) {
		errors.age = 'Required';
	} else if (isNaN(Number(values.age))) {
		errors.age = 'Must be a number';
	} else if (Number(values.age) < 18) {
		errors.age = 'Sorry, you must be at least 18 years old';
	}
	return errors;
};

const SyncValidationForm = (props) => {
	console.log('--> SyncValidationForm props:', props);
	const { handleSubmit, pristine, reset, submitting, fields: {username}, errors } = props;
	// console.log('#username:', username);
	// console.log('#handleSubmit:', handleSubmit);

	// const onSubmit = () => (data) => {
	// const onSubmit = event => {
	const onSubmit = props => event => {
		event.preventDefault();
		event.stopPropagation();

		const {username} = props.fields;
		console.log('#onSubmit');
		console.log('  #username:', username.value);

		return false;
	};
					// {touched && error && <span>{errors.username}</span>}
					// <form onSubmit={handleSubmit(onSubmit)}>
	return (
		<form onSubmit={onSubmit(props)}>
			<div>
				<label>Username:</label>
				<div>
					<input placeholder="username" type="text" {...username}/>
				</div>
				<div>
					{errors && <span>{errors.username}</span>}
				</div>
			</div>			

			<div>
				<button type="submit" disabled={submitting}>Submit</button>
				<button type="button" disabled={pristine || submitting} onClick={reset}>Clear Values</button>
			</div>

		</form>
	);
  
	// return (
	// 	<form onSubmit={handleSubmit}>
	// 		<Field name="username" type="text" component={renderField} label="Username"/>
	// 		<Field name="email" type="email" component={renderField} label="Email"/>
	// 		<Field name="age" type="number" component={renderField} label="Age"/>
	// 	</form>
	// );
};
console.log('2');

// export default reduxForm({
const SyncValidationFormConnected = reduxForm({
	form: 'syncValidation',	// a unique identifier for this form
	fields: ['username', 'email', 'age'],
	validate
})(SyncValidationForm);
const appChildren = (<SyncValidationFormConnected/>);
console.log('3');

//--------------------
// Redux / Main App
//--------------------
const reducers = {
	form: formReducer
};
const reducer = combineReducers(reducers);
const store = createStore(reducer);
class App extends Component {render() {return(<div>{appChildren}</div>)}}
ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('app')
);

console.log('done');

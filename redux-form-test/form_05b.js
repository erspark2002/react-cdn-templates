const { Component } = React;
const { Provider, connect } = ReactRedux;
const { combineReducers, createStore } = Redux;
const { reducer: formReducer, reduxForm } = ReduxForm;

const notes = 'NOTES: Uses <input> component - Synchronous Validation Example. firstName, email, age. Validation on every keypress. REGEX';

/*
Form data is passed to validate() on every keypress.
this.props.errors is passed to 

http://redux-form.com/6.0.2/examples/syncValidation/
Internal this.handleSubmit received data onSubmit

*/

const onSubmit = (data, dispatch) => {
	console.log('#onSubmit data:', data);
};

//-------------------
// REGEX VALIDATORS
//-------------------
const REGEX_EMAIL = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

//-------------------
// VALIDATION HELPERS
//-------------------
// const validRequired = (field, options = {}) => (value = '') => {
// 	if (!trim(value)) {
// 		return options.selectable ? selectRequired(field, options.connector) : textRequired(field);
// 	}
// };

const textRequired = field => `Enter your ${field}?`;
const validRequired = field => (value = '') => {
	if (!trim(value)) {
		return textRequired(field);
	}
};

const isNumber = (num) => {
	return !isNaN(Number(num));
};
const isLessThan =(num, target) => {
	return isNumber(num) && num < target;
};

// const validate = values => {
const validate = values => {
	console.log('#validate values:', values);
	const errors = {};
	if (!values.firstName) {
		errors.firstName = 'Required';
	} else if (values.firstName.length < 2) {
		errors.firstName = 'Must be at least 2 characters long';
	}
	if (!values.email) {
		errors.email = 'Required';
	} else if (!REGEX_EMAIL.test(values.email)) {
		errors.email = 'Invalid email address';
	}
	if (!values.age) {
		errors.age = 'Required';
	// } else if (isNaN(Number(values.age))) {
	} else if (!isNumber(values.age)) {
		errors.age = 'Must be a number';
	// } else if (isNumber(values.age) && values.age < 18) {
	} else if (isLessThan(values.age, 18)) {
		errors.age = 'Sorry, you must be at least 18 years old';
	}
	console.log('#errors:', errors);
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
	handleSubmit(data) {
		console.log('#handleSubmit data:', data);
		// alert('submitted');
		console.log('#this.props.dispatch:', this.props.dispatch);
		console.log('done handleSubmit');
		// this.setState({fakeSaving: true, fakeSubmitted: data});
		// setTimeout(() => this.setState({fakeSaving: false}), 2000);
	}

	render() {
		console.log('#this.props:', this.props);
		const {fields: {firstName, lastName, email, age}, handleSubmit, onSubmit, errors} = this.props;
		return (
			<div>
				<p>{notes}</p>
				<form onSubmit={this.props.handleSubmit(this.handleSubmit)}>
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

const ContactFormConnected = reduxForm({ 
	form: 'contact',
	fields: ['firstName', 'email', 'age'],
	onSubmit,
	validate
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

const { Component } = React;
const { Provider, connect } = ReactRedux;
const {reducer: formReducer, reduxForm, Field, SubmissionError} = ReduxForm;

/*
NOTES: Uses <input> component

	Submit all form data.
	No validation.

	check name of formReducer
	Reducer 'form' is passed to the component.

	This just submits the form - form data is then available in the 'form' store, as specified in the reducer.
	<form onSubmit={handleSubmit}>

	VALIDATE DATA
		_onSubmit - perform validation here, then:
			display errors if any.
			can dispatch actions here.
			- navigate to another page or show different components based on result.

*/

const onSubmit = (data, dispatch) => {
	console.log('#onSubmit data:', data);

	// return dispatch(checkEmail(data.email))
	// 	.then(passValidationErrorsToReduxForm);
};

// -------------------
// COMPONENTS
// -------------------

// NOTE: handleSubmit is passed in by ReduxForm.
// Blank form values are NOT passed to _onSubmit.

// const validate = values => {
//   const errors = {};
//   if (!values.firstName) {
//     errors.firstName = 'Required';
//   } else if (values.firstName.length < 2) {
//     errors.firstName = 'Must be at least 2 characters';
//   }
//   return errors;
// };


// const SimpleForm = (props) => {
// 	console.log('#props:', props);
// 	const { handleSubmit, pristine, reset, submitting, fields: {firstName} } = props;
// 	// const {fields: {firstName, lastName, email}, handleSubmit} = this.props;
// 	console.log('#firstName:', firstName);
// 	// const formDisabled = pristine || submitting;
// 	const formDisabled = false;
// 	const _onSubmit = (data) => {
// 		console.log('-->_onSubmit:',data);
// 		// required check
// 		if(!data.firstName) {
// 			console.log('error: no first name');
// 			throw new SubmissionError({firstName: 'first name required', _error: 'err.'});
// 		}
// 		console.log('_onSubmit end');
// 	};
// 	return (
// 		<form>
// 			<div>
// 				<label>First Name</label>
// 				<div>
// 					<input name="firstName" type="text" {...firstName}/>
// 				</div>
// 				<label>Age</label>
// 				<div>
// 					<Field name="age" component="input" type="text" placeholder="Age" value="2"/>
// 				</div>
// 			</div>
// 			<div>
// 				<button type="submit" disabled={formDisabled} onClick={handleSubmit(_onSubmit)}>Submit</button>
// 				<button type="button" disabled={formDisabled} onClick={reset}>Clear Values</button>
// 			</div>
// 		</form>
// 	);
// };

class SimpleForm extends Component {
	_onSubmit(data) {
		console.log('-->_onSubmit:',data);
		// required check
		if(!data.firstName) {
			console.log('error: no first name');
			throw new SubmissionError({firstName: 'first name required', _error: 'err.'});
		}
		console.log('_onSubmit end');
	}

	render() {
		console.log('#props:', this.props);
		const { handleSubmit, pristine, reset, submitting, fields: {firstName} } = this.props;
		// const {fields: {firstName, lastName, email}, handleSubmit} = this.props;
		console.log('#firstName:', firstName);
		// const formDisabled = pristine || submitting;
		const formDisabled = false;

		return (
			<form>
				<div>
					<label>First Name</label>
					<div>
						<input name="firstName" type="text" {...firstName}/>
					</div>
					<label>Age</label>
					<div>
						<Field name="age" component="input" type="text" placeholder="Age" value="2"/>
					</div>
				</div>
				<div>
					<button type="submit" disabled={formDisabled} onClick={handleSubmit(this._onSubmit)}>Submit</button>
					<button type="button" disabled={formDisabled} onClick={reset}>Clear Values</button>
				</div>
			</form>
		);
	}
}


//	export default reduxForm({
const SimpleFormConnected = reduxForm(
	{
		form: 'simple',
		fields: ['firstName']
	}
)(SimpleForm);

class App extends Component {
	render() {
		return (
			<SimpleFormConnected />
		);
	}
}

//--------------------
// Redux
//--------------------
const rootReducer = Redux.combineReducers({
	form: formReducer
});
const store = Redux.createStore(rootReducer);

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('app')
);

console.log('done');

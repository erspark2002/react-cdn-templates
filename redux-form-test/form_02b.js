console.log('start');
const { Component } = React;
const { Provider, connect } = ReactRedux;
const {reducer: formReducer, reduxForm, Field, SubmissionError} = ReduxForm;

/*
NOTES: Uses ReduxForm 'Field' component

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

// function submit_orig(values) {
//   return sleep(1000) // simulate server latency
//     .then(() => {
//       if (![ 'john', 'paul', 'george', 'ringo' ].includes(values.username)) {
//         throw new SubmissionError({ username: 'User does not exist', _error: 'Login failed!' })
//       } else if (values.password !== 'redux-form') {
//         throw new SubmissionError({ password: 'Wrong password', _error: 'Login failed!' })
//       } else {
//         window.alert(`You submitted:\n\n${JSON.stringify(values, null, 2)}`)
//       }
//     });
// }

function submit(values) {
	console.log('#values:', values);
  // return sleep(1000) // simulate server latency
  //   .then(() => {
  //     if (![ 'john', 'paul', 'george', 'ringo' ].includes(values.username)) {
  //       throw new SubmissionError({ username: 'User does not exist', _error: 'Login failed!' })
  //     } else if (values.password !== 'redux-form') {
  //       throw new SubmissionError({ password: 'Wrong password', _error: 'Login failed!' })
  //     } else {
  //       window.alert(`You submitted:\n\n${JSON.stringify(values, null, 2)}`)
  //     }
  //   })
}

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

const SimpleForm = (props) => {
	console.log('#props:', props);
	const { handleSubmit, pristine, reset, submitting, firstName } = props;
	// const formDisabled = pristine || submitting;
	const formDisabled = false;

	// 
	const _onSubmit = (data) => {
		console.log('-->_onSubmit:',data);

		// required check
		if(!data.firstName) {
			console.log('error: no first name');
			throw new SubmissionError({firstName: 'first name required', _error: 'err.'});
		}
	};

	return (
		<form>
			<div>
				<label>First Name</label>
				<div>
					<Field name="firstName" component="input" type="text" placeholder="First Name"/>
				</div>
				<label>Age</label>
				<div>
					<Field name="age" component="input" type="text" placeholder="Age" value="2"/>
				</div>
{/* 
					<input type="text" {...firstName}/>
 */}
			</div>
			<div>
				<button type="submit" disabled={formDisabled} onClick={handleSubmit(_onSubmit)}>Submit</button>
				<button type="button" disabled={formDisabled} onClick={reset}>Clear Values</button>
			</div>
		</form>
	);
};
//	export default reduxForm({
const SimpleFormConnected = reduxForm(
	{
		form: 'simple',	// a unique identifier for this form,
		fields: ['firstName', 'age']
		// handleSubmit,
		// onSubmit
	// })(SimpleForm);
	},
	state => {
		console.log('#state:', state);
		return {
			formData: state.form
		};
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

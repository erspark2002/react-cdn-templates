console.log('start');
const { Component } = React;
const { Provider, connect } = ReactRedux;
const {reducer: formReducer, reduxForm, Field} = ReduxForm;

/*
NOTES:
 v6.0.5 - <Field component={renderField}

getting started - redux store

<Field> component is present with ReduxForm version 6.0.2 - but other things don't work as expected.
redux-form-6.0.2_broken

	getting started.
	Submit and clear buttons disabled until values entered.

	Used ReduxForm component: Field

	check name of formReducer
	Reducer 'form' is passed to the component.
*/

const onSubmitExternal = (data, dispatch) => {
	console.log('#onSubmitExternal data:', data);

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
//     })
// }
// function submit(values) {
// 	console.log('#values:', values);
//   // return sleep(1000) // simulate server latency
//   //   .then(() => {
//   //     if (![ 'john', 'paul', 'george', 'ringo' ].includes(values.username)) {
//   //       throw new SubmissionError({ username: 'User does not exist', _error: 'Login failed!' })
//   //     } else if (values.password !== 'redux-form') {
//   //       throw new SubmissionError({ password: 'Wrong password', _error: 'Login failed!' })
//   //     } else {
//   //       window.alert(`You submitted:\n\n${JSON.stringify(values, null, 2)}`)
//   //     }
//   //   })
// }

// const handleSubmit = (proxy, data, event) => {
// 	// console.log('#handleSubmit args:', args);
// 	event.preventDefault();
// 	event.stopPropagation();
// 	console.log('# ----- handleSubmit -----');
// 	console.log('#proxy:', proxy);
// 	console.log('#data:', data);
// 	// console.log('#event:', event);
// 	console.log('#event:', JSON.stringify(event, null, 2));
// 	// console.log('#args:', args);
// 	console.log('#arguments:', arguments);
// 	return false;
// };

// const handleSubmit = () => {
// 	console.log('-->#handleSubmit');
// };

// -------------------
// COMPONENTS
// -------------------

// const renderField = ({ input, label, type, meta: { touched, error } }) => (
// 	<div>
// 		<label>{label}</label>
// 		<div>
// 			<input {...input} placeholder={label} type={type}/>
// 		</div>
// 	</div>
// );

const renderField = (props) => {
	console.log('#renderField props:', props);
	const { input, label, type, meta: { touched, error } } = props;
	return (
		<div>
			<label>{label}</label>
			<div>
				<input {...input} placeholder={label} type={type}/>
				{touched && error && <span>{error}</span>}
			</div>
		</div>
	);
};

const SimpleForm = (props) => {
	const { handleSubmit, pristine, reset, submitting, firstName, onSubmit } = props;
	const formDisabled = pristine || submitting;
		// <form>
		// <form onSubmit={handleSubmit} method="POST"> - POST NOT allowed!?
		// <form onSubmit={handleSubmit}>
		// <form onSubmit={handleSubmit(submit)}>

	const _onSubmit = (data) => {
		console.log('-->onSubmit:',data);
	};

	return (
		<form>
			<div>
				<label>First Name</label>
				<div>
					<Field name="firstName" component={renderField} type="text" placeholder="First Name"/>
				</div>
			</div>

			<div>
{/*
				<button type="submit" disabled={formDisabled} onClick={handleSubmit(_onSubmit)}>Submit</button>
*/}
				<button type="submit" disabled={formDisabled} onClick={handleSubmit(onSubmit)}>Submit</button>
				<button type="button" disabled={formDisabled} onClick={reset}>Clear Values</button>
			</div>
		</form>
	);
};

const _validate = data => {
	console.log('#_validate data:', data);
	// return {};
	return {firstName: 'please enter firstName'};
};
//	export default reduxForm({

// NOTE: fields and handleSubmit are NOT specified when connecting.
// 		fields: ['firstName'],
// 		handleSubmit,

const SimpleFormConnected = reduxForm({
	form: 'simple',	// a unique identifier for this form,
	validate: _validate,
	onSubmit: onSubmitExternal
})(SimpleForm);

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

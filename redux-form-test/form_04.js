const { Component } = React;
const { Provider, connect } = ReactRedux;
const { combineReducers, createStore } = Redux;
const { reducer: formReducer, reduxForm } = ReduxForm;

/*
NOTES: Uses <input> component - no validation. Internal this.handleSubmit received data onSubmit

*/

const onSubmit = (data, dispatch) => {
	console.log('#onSubmit data:', data);
};

// -------------------
// COMPONENTS
// -------------------
class ContactForm extends Component {
	handleSubmit(data) {
		console.log('#handleSubmit data:', data);
		// this.setState({fakeSaving: true, fakeSubmitted: data});
		// setTimeout(() => this.setState({fakeSaving: false}), 2000);
	}

	render() {
		const {fields: {firstName, lastName, email}, handleSubmit, onSubmit} = this.props;
		console.log('#firstName:', firstName);

			// <form onSubmit={handleSubmit}>
			// <form onSubmit={handleSubmit(this.props.onSubmit)}>
		return (
			<form onSubmit={this.props.handleSubmit(this.handleSubmit)}>
				<div>
					<label>First Name</label>
					<input type="text" placeholder="First Name" {...firstName}/>
				</div>
				<div>
					<label>Email</label>
					<input type="text" placeholder="Email" {...email}/>
				</div>
{/* 
				<input type="email" placeholder="Email" {...email}/>
				<button type="submit" onClick={handleSubmit(onSubmit)}>Submit</button>
*/}
				<button type="submit">Submit</button>
			</form>
		);
	}
}

const ContactFormConnected = reduxForm({ // <----- THIS IS THE IMPORTANT PART!
	form: 'contact',                           // a unique name for this form
	// fields: ['firstName', 'lastName', 'email'], // all the fields in your form
	fields: ['firstName', 'email'],
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

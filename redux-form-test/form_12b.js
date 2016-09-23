const { Component, PropTypes } = React;
const { Provider, connect } = ReactRedux;
const { combineReducers, createStore, compose } = Redux;
const { reducer: formReducer, reduxForm, addArrayValue } = ReduxForm;

//---
// Thunk and chrome reactDevTools
const {applyMiddleware} = Redux;
const thunk = ReduxThunk.default;
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


// -------------------
// COMPONENTS
// -------------------

// DeepForm.js

// import React, { Component, PropTypes } from 'react'
// import { reduxForm, addArrayValue } from 'redux-form'
// import Address from './Address'
// import PureInput from '../components/PureInput'
// import validate from './validateDeepForm'

// export const fields = [
const fields = [
	'name',
	'shipping.street',
	'shipping.city',
	'shipping.phones[]',
	'billing.street',
	'billing.city',
	'billing.phones[]',
	'children[].name',
	'children[].age',
	'children[].awards[]'
];

class DeepForm extends Component {
	_onSubmit(data) {
		console.log('-------- _onSubmit ---------');
		console.log('#data:', data);
	}

	render() {
		const {
			addValue,
			fields: { name, shipping, billing, children },
			handleSubmit,
			resetForm,
			invalid,
			submitting
		} = this.props;

		return (<form onSubmit={handleSubmit(data=>this._onSubmit(data))}>
				<div>
					<button type="button" onClick={() => {
						for (let childIndex = 0; childIndex < 30; childIndex++) {
							addValue('deep', 'children');
							for (let awardIndex = 0; awardIndex < 10; awardIndex++) {
								addValue('deep', `children[${childIndex}].awards`);
							}
						}
					}}><i/> Make Form Enormous!</button>
				</div>
				<div>
					<label>Name</label>
					<div>
						<PureInput type="text" placeholder="Name" field={name} title={name.error}/>
					</div>
				</div>
				<div>
					<fieldset>
						<legend>Shipping</legend>
						<Address {...shipping}/>
					</fieldset>
				</div>

				<div>
					<button type="submit" disabled={submitting || invalid}>
						{submitting ? <i/> : <i/>} Submit
					</button>
					<button type="button" disabled={submitting} onClick={resetForm}>
						Clear Values
					</button>
				</div>
			</form>
		);
	}
}

DeepForm.propTypes = {
	addValue: PropTypes.func.isRequired,
	fields: PropTypes.object.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	resetForm: PropTypes.func.isRequired,
	invalid: PropTypes.bool.isRequired,
	submitting: PropTypes.bool.isRequired
};

// export default reduxForm({
const DeepFormConnected = reduxForm({
	form: 'deep',
	fields,
	validate
}, undefined, {
	addValue: addArrayValue // mapDispatchToProps (will bind action creator to dispatch)
})(DeepForm);

// -------------------------------
// Address.js
// -------------------------------

// import React, { Component, PropTypes } from 'react'
// import PureInput from '../components/PureInput'

class Address extends Component {
	shouldComponentUpdate(nextProps) {
		return this.props.street !== nextProps.street ||
			this.props.city !== nextProps.city ||
			this.props.phones !== nextProps.phones;
	}

	render() {
		const { street, city, phones } = this.props;
		return (<div>
				<div>
					<label>Street</label>
					<div>
						<PureInput type="text" placeholder="Street" field={street} title={street.error}/>
					</div>
				</div>
				<div>
					<label>City</label>
					<div>
						<PureInput type="text" placeholder="City" field={city} title={city.error}/>
					</div>
				</div>
				<div>
					<button type="button" onClick={event => {
						event.preventDefault();  // prevent form submission
						phones.addField();       // pushes empty phone field onto the end of the array
					}}><i/> Add Phone
					</button>
				</div>
				{phones.map((phone, index) =>
					<div key={index}>
						<label>Phone #{index + 1}</label>
						<div>
							<PureInput type="text" placeholder="Phone" field={phone} title={phone.error}/>
						</div>
					</div>
				)}
			</div>
		);
	}
}

Address.propTypes = {
	street: PropTypes.object.isRequired,
	city: PropTypes.object.isRequired,
	phones: PropTypes.arrayOf(PropTypes.object).isRequired
};

// export default Address


// -------------------
// validateDeepForm.js
// -------------------

const requireFields = (...names) => data =>
	names.reduce((errors, name) => {
		if (!data[name]) {
			errors[name] = 'Required';
		}
		return errors;
	}, {});
const validateAddress = requireFields('street', 'city');
const validateChild = requireFields('name', 'age');
// const validateDeepForm = data => {
const validateDeepForm = data => {
	const errors = {};
	if (!data.name) {
		errors.name = 'Required';
	}
	errors.shipping = validateAddress(data.shipping);
	errors.billing = validateAddress(data.billing);
	errors.children = data.children.map(validateChild);
	return errors;
};

// export default validateDeepForm
const validate = validateDeepForm;

// -------------------
// PureInput.js
// -------------------

// import React, { Component, PropTypes } from 'react'

class PureInput extends Component {
	shouldComponentUpdate(nextProps) {
		return this.props.field !== nextProps.field;
	}

	render() {
		const { field, ...rest } = this.props;
		return <input {...field} {...rest}/>;
	}
}

PureInput.propTypes = {
	field: PropTypes.object.isRequired
};

// export default PureInput;



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

// NOTE: Get 'no store found' if initialState passed as 2nd param.

const initialState = {
	form: {}
};

// const store = createStore(
// 	reducer,
// 	initialState,
// 	applyMiddleware(thunk),
// 	devTools
// );


// dan
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


class App extends Component {render() {return(<DeepFormConnected />)}}
ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('app')
);

console.log('done');

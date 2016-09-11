console.log('start');
const { Component } = React;
const { Provider, connect } = ReactRedux;

//	import React from 'react'
//	import { Field, reduxForm } from 'redux-form'

const {reduxForm, Field} = ReduxForm;
console.log('#Field:', Field);
class App extends Component {
	render() {
	  return (
	    <SimpleFormConnected />
	  );
	}
}

const SimpleForm = (props) => {
  const { handleSubmit, pristine, reset, submitting } = props
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>First Name</label>
        <div>
          <Field name="firstName" component="input" type="text" placeholder="First Name"/>
        </div>
      </div>
      <div>
        <label>Last Name</label>
        <div>
          <Field name="lastName" component="input" type="text" placeholder="Last Name"/>
        </div>
      </div>
      <div>
        <label>Email</label>
        <div>
          <Field name="email" component="input" type="email" placeholder="Email"/>
        </div>
      </div>
      <div>
        <label>Sex</label>
        <div>
          <label><Field name="sex" component="input" type="radio" value="male"/> Male</label>
          <label><Field name="sex" component="input" type="radio" value="female"/> Female</label>
        </div>
      </div>
      <div>
        <label>Favorite Color</label>
        <div>
          <Field name="favoriteColor" component="select">
            <option></option>
            <option value="ff0000">Red</option>
            <option value="00ff00">Green</option>
            <option value="0000ff">Blue</option>
          </Field>
        </div>
      </div>
      <div>
        <label htmlFor="employed">Employed</label>
        <div>
          <Field name="employed" id="employed" component="input" type="checkbox"/>
        </div>
      </div>
      <div>
        <label>Notes</label>
        <div>
          <Field name="notes" component="textarea"/>
        </div>
      </div>
      <div>
        <button type="submit" disabled={pristine || submitting}>Submit</button>
        <button type="button" disabled={pristine || submitting} onClick={reset}>Clear Values</button>
      </div>
    </form>
  )
}
//	export default reduxForm({
const SimpleFormConnected = reduxForm({
  form: 'simple'  // a unique identifier for this form,
  //fields: []
})(SimpleForm)

//--------------------
// Redux
//--------------------
  const todos = (state = [], action) => {
    switch (action.type) {
      case 'ADD_TODO':
        // return current state plus the next todo item.
        // uses the ES6 'rest' operator on state. eg: ...state
        return [
          ...state,
          {
            id: action.payload.id,
            desc: action.payload.desc,
            completed: false,
          },
        ];
      default:
        return state;
    }
  };
  const todoApp = Redux.combineReducers({
    todos
  });



const store = Redux.createStore(todoApp);

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('app')
  );

console.log('done');

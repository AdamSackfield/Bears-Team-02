import React from 'react';
import { reduxForm, Field, Form } from 'redux-form';
import './FormBuilder.css'; 

const formFieldRender = ({ input, label, type, meta: { touched, error }}) => (
	<div className="field">
		<label className="label">{label}</label>
		<div className="control">
			<input className="input" type={type} { ...input } />
		</div>
		<p className="help is-danger">{touched && ((error && <span>{error}</span> ))}</p>
	</div>
)

let errorFields = [];

const FormBuilder = props => {
	const { handleSubmit } = props;
	const fields = props.fields.map(field => {

		return (
			<Field
				key={field.name}
				label={field.label}
				name={field.name}
				type={field.type}
				component={formFieldRender}
			/>
		);
	});

	return (
		<Form className='Form' onSubmit={handleSubmit}>
      <h1>{props.formTitle}</h1>
			{fields}
			<button className='button is-success' type="submit">{props.buttonText}</button>
			<button className='button is-danger'>Clear</button>
			{props.errors}
		</Form>
	);
};

const validate = values => {
	const errors = {};

	errorFields.map(field => {
		let thisField = field.name;

		if (!values[thisField]) {
			errors[thisField] = field.errorMsg;
		}
		if (thisField === 'confirmPassword' && values.confirmPassword !== values.password) {
			errors[thisField] = 'Passwords do not match';
		}
		return errors; // TODO Check if this return is neeeded
	});
	return errors;
};

export default reduxForm({
  form: 'SignUp', // TODO See about dynamic name here
	validate
})(FormBuilder)
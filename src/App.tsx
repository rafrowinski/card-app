import { Formik, FormikErrors, FormikProps, FormikTouched } from 'formik';
import React from 'react';
import './App.css';

interface FormValues {
    number: string,
    date: string,
    ccv: string,
}

function App() {

    const formatCardNumber = (value: string) => {
        if (!value) {
            return '';
        }
        return value.replace(/\s/g, '').match(/.{1,4}/g)!.join(' ')
    }
    return (
        <div className="App">
            <Formik
                initialValues={{ number: '', date: '', ccv: '' }}
                validate={
                    values => {
                        let errors = {};
                        console.log(values)
                        return errors;
                    }
                }
                onSubmit={(values, { setSubmitting }) => {
                    console.log('here are the values', values);
                    setSubmitting(false);
                }}
            >
                {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting,
                  }: FormikProps<FormValues>) => (
                    <form onSubmit={handleSubmit}>
                        <input type="text"
                               name="number"
                               onChange={handleChange}
                               onBlur={handleBlur}
                               value={formatCardNumber(values.number)}
                        />
                        {errors.number && touched.number && errors.number}
                        <button type="submit" disabled={isSubmitting}>
                            Submit
                        </button>
                    </form>
                )}
            </Formik>
        </div>
    );
}

export default App;

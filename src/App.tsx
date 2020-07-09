import { Formik, FormikProps, FormikErrors } from 'formik';
import React, { useState } from 'react';
import './App.css';
import CreditCard from 'creditcard.js';
import creditCardType from 'credit-card-type';

interface FormValues {
    number: string,
    date: string,
    cvc: string,
}

enum CardType {
    none = 'none',
    visa = 'visa',
    mastercard = 'mastercard',
    'american-express' = 'american-express',
    'diners-club' = 'diners-club',
    discover = 'discover',
    jcb = 'jcb',
    unionpay = 'unionpay',
    maestro = 'maestro',
    mir = 'mir',
    elo = 'elo',
    hiper = 'hiper',
    hipercard = 'hipercard',
}


function App() {
    const [cardType, setCardType] = useState(CardType.none);
    // @ts-ignore
    const creditCardHelper = new CreditCard();

    const formatCardNumber = (value: string) => {
        if (!value) {
            return '';
        }
        return value.replace(/\s/g, '').match(/.{1,4}/g)!.join(' ')
    }
    const formatDate = (value: string) => {
        if (!value) {
            return '';
        }
        return value.replace(/\//g, '').match(/.{1,2}/g)!.join('/')
    }
    const changeFocus = (inputEvent: any) => {
        if (inputEvent && inputEvent.target.value.length >= inputEvent.target.getAttribute('maxlength')) {
            inputEvent.target.nextElementSibling.focus();
        }
    }

    const setCardIconAndChangeFocus = (inputEvent: any) => {
        const number = inputEvent.target.value
        if (number) {
            const creditCardData = creditCardType(number.replace(/\s/g, ''));
            const cardType = creditCardData.length && creditCardData[0].type ? creditCardData[0].type as CardType : CardType.none;
            setCardType(cardType);
        } else {
            setCardType(CardType.none);
        }
        changeFocus(inputEvent);
    }

    return (
        <div className="App">
            <Formik
                initialValues={{ number: '', date: '', cvc: '' }}
                validate={
                    values => {
                        let errors = {} as FormikErrors<FormValues>;
                        const { number, date, cvc } = values;
                        if (!number) {
                            errors.number = 'credit card number is required';
                        } else {
                            const unformattedNumber = number.replace(/\s/g, '');
                            if (!creditCardHelper.isValid(unformattedNumber)) {
                                errors.number = 'invalid card number';
                            }
                        }
                        const cardString = values.number.replace(/\s/g, '');
                        creditCardHelper.isValid('4916108926268679'); // returns true
                        creditCardHelper.isExpirationDateValid('02', '2020'); // returns true
                        creditCardHelper.isSecurityCodeValid('4556603578296676', '250'); // returns true
                        creditCardHelper.getCreditCardNameByNumber('4539578763621486'); // returns 'Visa'
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
                        {cardType}
                        <input type="text"
                               name="number"
                               onChange={handleChange}
                               onBlur={handleBlur}
                               maxLength={19}
                               value={formatCardNumber(values.number)}
                               onInput={setCardIconAndChangeFocus}
                               placeholder="Card number"
                        />

                        <input type="text"
                               name="date"
                               onChange={handleChange}
                               onBlur={handleBlur}
                               maxLength={5}
                               value={formatDate(values.date)}
                               onInput={changeFocus}
                               placeholder="MM/YY"
                        />

                        <input type="text"
                               name="cvc"
                               onChange={handleChange}
                               onBlur={handleBlur}
                               maxLength={3}
                               value={formatCardNumber(values.cvc)}
                               placeholder="CVC"
                        />

                        <button type="submit" disabled={isSubmitting}>
                            Submit
                        </button>
                        {errors.number && touched.number && errors.number}
                        {errors.date && touched.date && errors.date}
                        {errors.cvc && touched.cvc && errors.cvc}
                    </form>
                )}
            </Formik>
        </div>
    );
}

export default App;

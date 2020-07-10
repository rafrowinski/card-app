import { Formik, FormikProps, FormikErrors } from 'formik';
import React, { useState } from 'react';
import './App.css';
import CreditCard from 'creditcard.js';
import creditCardType from 'credit-card-type';
import visa from 'payment-icons/min/flat/visa.svg';
import mastercard from 'payment-icons/min/flat/mastercard.svg';
import amex from 'payment-icons/min/flat/amex.svg';
import diners from 'payment-icons/min/flat/diners.svg';
import discover from 'payment-icons/min/flat/discover.svg';
import jcb from 'payment-icons/min/flat/jcb.svg';
import unionpay from 'payment-icons/min/flat/unionpay.svg';
import maestro from 'payment-icons/min/flat/maestro.svg';
import unknownCardIcon from 'payment-icons/min/mono/default.svg';
import defaultCardIcon from 'payment-icons/min/flat/default.svg';

interface FormValues {
    number: string,
    date: string,
    cvc: string,
}

enum CardType {
    none = 'none',
    visa = 'visa',
    mastercard = 'mastercard',
    americanExpress = 'american-express',
    dinersClub = 'diners-club',
    discover = 'discover',
    jcb = 'jcb',
    unionpay = 'unionpay',
    maestro = 'maestro',
    mir = 'mir',
    elo = 'elo',
    hiper = 'hiper',
    hipercard = 'hipercard',
}

const CardIconMap: Record<CardType, string> = {
    [CardType.none]: unknownCardIcon,
    [CardType.visa]: visa,
    [CardType.mastercard]: mastercard,
    [CardType.americanExpress]: amex,
    [CardType.dinersClub]: diners,
    [CardType.discover]: discover,
    [CardType.jcb]: jcb,
    [CardType.unionpay]: unionpay,
    [CardType.maestro]: maestro,
    [CardType.mir]: defaultCardIcon,
    [CardType.elo]: defaultCardIcon,
    [CardType.hiper]: defaultCardIcon,
    [CardType.hipercard]: defaultCardIcon,
}

function App() {
    const [cardType, setCardType] = useState(CardType.none);
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
            <div className="wrapper">
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
                            if (!date || date.length < 5) {
                                errors.date = 'date is required';
                            } else {
                                const dateStrings = date.split('/');
                                if (!creditCardHelper.isExpirationDateValid(dateStrings[0], '20' + dateStrings[1])) {
                                    errors.date = 'date is not valid';
                                }
                            }
                            if (!cvc) {
                                errors.cvc = 'cvc is required';
                            } else {
                                const unformattedNumber = number.replace(/\s/g, '');
                                if (!creditCardHelper.isSecurityCodeValid(unformattedNumber, cvc)) {
                                    errors.cvc = 'invalid cvc number';
                                }
                            }
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
                        <>

                            <form onSubmit={handleSubmit} className="form">
                                <div className="form__items-wrapper">
                                    {<img src={CardIconMap[cardType]}
                                          className="form__card-image"/>}
                                    <input type="text"
                                           name="number"
                                           onChange={handleChange}
                                           onBlur={handleBlur}
                                           maxLength={19}
                                           value={formatCardNumber(values.number)}
                                           onInput={setCardIconAndChangeFocus}
                                           placeholder="Card number"
                                           className="form__input form__input--number"
                                    />

                                    <input type="text"
                                           name="date"
                                           onChange={handleChange}
                                           onBlur={handleBlur}
                                           maxLength={5}
                                           value={formatDate(values.date)}
                                           onInput={changeFocus}
                                           placeholder="MM/YY"
                                           className="form__input form__input--date"
                                    />

                                    <input type="text"
                                           name="cvc"
                                           onChange={handleChange}
                                           onBlur={handleBlur}
                                           maxLength={3}
                                           value={formatCardNumber(values.cvc)}
                                           placeholder="CVC"
                                           className="form__input form__input--cvc"
                                    />


                                </div>
                                <button type="submit"
                                        disabled={isSubmitting}
                                        className="form__submit">
                                    Submit
                                </button>
                            </form>
                            <div className="errors">
                                <div>{errors.number && touched.number && errors.number}</div>
                                <div>{errors.date && touched.date && errors.date}</div>
                                <div>{errors.cvc && touched.cvc && errors.cvc}</div>
                            </div>
                        </>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default App;

import { useState } from "react";
import Axios from "axios";
import styles from './SignUpPage.module.css';

import TermsAndConditions from '../../components/Modals/TermsAndConditions'
import PrivacyPolicy from '../../components/Modals/PrivacyPolicy'
import Input from '../../components/UI/Input/Input';
import { useHistory } from "react-router";

function SignUpPage() {
    const [email, setEmail] = useState('')
    const [uname, setUname] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [password, setPassword] = useState('')
    const [redonePassword, setRedonePassword] = useState(/*{
        inputConfig: {
            type: 'password',
            placeholder: 'Confirm password',
            name: 'psw-repeat'
        },
        value: '', 
        valid: false,
        touched: false
    }*/)

    const[acceptTerms, setAcceptTerms] = useState();

    const [termsAndConditionsDisplay, setTermsAndConditionsDisplay] = useState(false);
    const [privacyPolicyDisplay, setPrivacyPolicyDisplay] = useState(false);


    function openTermsAndConditionsModal() {
        setTermsAndConditionsDisplay(true);
    }

    function closeTermsAndConditionsModal() {
        setTermsAndConditionsDisplay(false);
    }

    function openPrivacyPolicyModal() {
        setPrivacyPolicyDisplay(true);
    }

    function closePrivacyPolicyModal() {
        setPrivacyPolicyDisplay(false);
    }

    //states for sign up error display
    const [error, setError] = useState(null);

    const errorDisplay = error ? 
    <div className={styles['signup-error-container']}>
        {error}
    </div> : 
    <div className={styles['signup-requirements-container']}>
        Your Password Must Have at Least 8 Characters and Contain: 1 Capital Letter, 1 Number, 1 Special Character
    </div>;

    const history = useHistory();

    function signUp(event) {
        event.preventDefault();
        // if(email && uname && firstName && lastName && password && redonePassword && acceptTerms){
            Axios.post('/api/sign-up', {
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    uname: uname,
                    password: password,
                    redonePassword: redonePassword
            },{withCredentials:true}).then(response => {
                if(response.data.affectedRows === 1){
                    history.push("/SignUpSuccess");
                }
 
            }).catch(error => {
                if (error.response.data === "exists"){
                    setError("An Account using that Email or Username already exists");
                    console.log(error);
                }
                else if (error.response.data === "passwords not matching"){
                    setError("The Passwords Entered Do Not Match");
                    console.log(error);
                }
                else if (error.response.data === "password requirements"){
                    setError("Your Password Must Have: 8-50 Characters and Contain: 1 Capital Letter, 1 Number, 1 Special Character");
                    console.log(error);
                }
                console.log(error);
            })
        // }
    }

    function handleCheck(e) {
        setAcceptTerms(e.target.checked);
    }

    // function onPasswordChangedHandler(event) {
    //     const updatedPassword = {
    //         ...redonePassword,
    //         value: event.target.value,
    //         valid: event.target.value === password,
    //         touched: true
    //     };
    //     setRedonePassword(updatedPassword);
    // }

    return (
        <>
            <form className={styles['signup-container']} onSubmit={signUp}>
                <div className={styles['signup-container-header']}>
                    Sign Up
                </div>
                <div className={styles['signup-fields-container']}>
                    <div className={styles['fname-input-container']}>
                        <label className={styles['fname-input-label']} for='fname'>First Name</label>
                        <input
                            type='text'
                            placeholder='First name'
                            name='fname'
                            onChange={e => setFirstName(e.target.value)}
                            required
                            // pattern="[A-Za-z]"
                            maxlength="40"
                        />
                    </div>

                    <div className={styles['lname-input-container']}>
                        <label className={styles['lname-input-label']} for='lname'>Last Name</label>
                        <input
                            type='text'
                            placeholder='Last name'
                            name='lname'
                            onChange={e => setLastName(e.target.value)}
                            required
                            // pattern="[a-zA-Z]"
                            maxlength="40"
                        />
                    </div>

                    <div className={styles['email-input-container']}>
                        <label className={styles['email-input-label']} for='email'>Email</label>
                        <input
                            type='email'
                            placeholder='Enter email'
                            name='email'
                            onChange={e => setEmail(e.target.value)}
                            required
                            maxlength="320"
                        />
                    </div>

                    <div className={styles['username-input-container']}>
                        <label className={styles['username-input-label']} for='uname'>Username</label>
                        <input
                            type='username'
                            placeholder='Enter username'
                            name='uname'
                            onChange={e => setUname(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles['password-input-container']}>
                        <label className={styles['password-input-label']} for='psw'>Password</label>
                        <input
                            type='password'
                            placeholder='Enter password'
                            name='psw'
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles['confirm-password-input-container']}>
                        <label className={styles['repeat-password-input-label']} for='psw-repeat'>Confirm Password</label>
                        <input
                            type='password'
                            placeholder='Confirm password'
                            name='psw-repeat'
                            onChange={e => setRedonePassword(e.target.value)}
                            required
                        />
                        {/* <Input
                            config={redonePassword.inputConfig}
                            value={redonePassword.value}
                            valid={redonePassword.valid}
                            touched={redonePassword.touched}
                            changed={event => onPasswordChangedHandler(event)}
                        /> */}
                    </div>
                </div>

                <div className={styles['checkbox-container']}>
                    <p>By creating an account you agree to our <button className={styles['terms-button']} onClick={openTermsAndConditionsModal}>Terms</button> &<button className={styles['policy-button']} onClick={openPrivacyPolicyModal}>Privacy Policy</button>
                        <input
                            type='checkbox'
                            required 
                            name='remember'
                            onChange={e => handleCheck(e)}
                        />
                    </p>
                </div>
                <div className={styles['btn-container']}>
                    {/*Why do we have two className for referencing the same style "submit-btn" - Wameedh */}
                    <button className={styles['submit-btn']} type='submit' className={styles['submit-btn']} >Sign Up</button>
                    {/* <button disabled={!redonePassword.valid} type='submit' className={styles['submit-btn']} onClick={OnClickHandler}>Sign Up</button> */}
                </div>
                {errorDisplay}
            </form>
            {/* Modals */}
            <TermsAndConditions display={termsAndConditionsDisplay} onClose={closeTermsAndConditionsModal} />
            <PrivacyPolicy display={privacyPolicyDisplay} onClose={closePrivacyPolicyModal} />
        </>
    );
}

export default SignUpPage;
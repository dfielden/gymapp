'use strict'
import * as c from '../_constsAndEls.js';
import {AJAX} from "../helper.js";
const SIGNUP_SUCCESS_VALUE = 'SIGNUP_SUCCESS'; // must match PSFS SIGNUP_SUCCESS_VALUE in GymAppApplication.java

c.btnSignup.addEventListener('click', async (e) => {
    e.preventDefault();

    // validation
    const email = c.formSignupEmail.value;
    const pw1 = c.formSignupPw1.value;
    const pw2 = c.formSignupPw2.value;

    if (pw1 !== pw2) {
        showFormMessage("Please ensure passwords match", false);
        return;
    }
    const data = await AJAX(c.signupURL, {
        email: email,
        password: pw1,
    });

    if (data === SIGNUP_SUCCESS_VALUE) {
        showFormMessage("Sign-up successful!", true);
        setTimeout(() => {
            //TODO: login and redirect to home
            console.log('redirect to home');
        }, 500)
    } else {
        showFormMessage(data, false);
    }

});

const showFormMessage = (message, success) => {
    c.formMessage.textContent =  message;
    c.formMessage.classList.remove('visibility-hidden');

    if (success) {
        c.formMessage.classList.remove('form-msg--error');
        c.formMessage.classList.add('form-msg--success');
    } else {
        c.formMessage.classList.remove('form-msg--success');
        c.formMessage.classList.add('form-msg--error');
    }
}


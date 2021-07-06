'use strict'
import * as c from '../_constsAndEls.js';
import {AJAX, showFormMessage} from "../helper.js";
const SIGNUP_SUCCESS_VALUE = 'SIGNUP_SUCCESS'; // must match PSFS SIGNUP_SUCCESS_RESPONSE_VALUE in GymAppApplication.java
const LOGIN_SUCCESS_VALUE = 'LOGIN_SUCCESS'; // must match PSFS LOGIN_SUCCESS_RESPONSE_VALUE in GymAppApplication.java

c.btnSignup.addEventListener('click', async (e) => {
    e.preventDefault();

    // validation
    const email = c.formSignupEmail.value;
    const username = c.formSignupUsername.value;
    const pw1 = c.formSignupPw1.value;
    const pw2 = c.formSignupPw2.value;

    if (pw1 !== pw2) {
        showFormMessage("Please ensure passwords match", false, c.formSignup);
        return;
    }
    const data = await AJAX(c.signupURL, {
        email: email,
        password: pw1,
        username: username,
    });

    if (data === SIGNUP_SUCCESS_VALUE) {
        showFormMessage("Sign-up successful!", true, c.formSignup);
        setTimeout(() => {
            // if signup successful, login and redirect to home
            _login(email, pw1);
        }, 500)
    } else {
        showFormMessage(data, false);
    }

});

const _login = async (email, pw) => {
    const data = await AJAX(c.loginURL, {
        email: email,
        password: pw,
        username: "",
    });

    if (data === LOGIN_SUCCESS_VALUE) {
        window.location.href = "/";
    } else {
        showFormMessage(data, false, c.formSignup);
    }
}



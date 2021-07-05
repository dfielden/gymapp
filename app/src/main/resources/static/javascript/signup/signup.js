'use strict'
import * as c from '../_constsAndEls.js';
import {AJAX, showFormMessage} from "../helper.js";
const SIGNUP_SUCCESS_VALUE = 'SIGNUP_SUCCESS'; // must match PSFS SIGNUP_SUCCESS_RESPONSE_VALUE in GymAppApplication.java

c.btnSignup.addEventListener('click', async (e) => {
    e.preventDefault();

    // validation
    const email = c.formSignupEmail.value;
    const username = c.formSignupUsername.value;
    const pw1 = c.formSignupPw1.value;
    const pw2 = c.formSignupPw2.value;

    if (pw1 !== pw2) {
        showFormMessage("Please ensure passwords match", false);
        return;
    }
    const data = await AJAX(c.signupURL, {
        email: email,
        password: pw1,
        username: username,
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



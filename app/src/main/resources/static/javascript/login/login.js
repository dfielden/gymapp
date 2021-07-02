'use strict'
import * as c from '../_constsAndEls.js';
import {AJAX} from "../helper.js";
const LOGIN_SUCCESS_VALUE = 'LOGIN_SUCCESS'; // must match PSFS LOGIN_SUCCESS_RESPONSE_VALUE in GymAppApplication.java

c.btnLogin.addEventListener('click', async (e) => {
    e.preventDefault();

    // validation
    const email = c.formLoginEmail.value;
    const pw = c.formLoginPw.value;

    const data = await AJAX(c.loginURL, {
        email: email,
        password: pw,
        username: "",
    });

    if (data === LOGIN_SUCCESS_VALUE) {
        showFormMessage("Login successful!", true);
        setTimeout(() => {
            //TODO: login and redirect to home
            window.location.href = "/";
        }, 500)
    } else {
        showFormMessage(data, false);
    }
});
// TODO: remove duplicate function
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


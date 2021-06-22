'use strict'
import * as c from '../_constsAndEls.js';
import {AJAX} from "../helper.js";

c.btnSignup.addEventListener('click', (e) => {
    e.preventDefault();

    // validation
    const email = c.formSignupEmail.value;
    const pw1 = c.formSignupPw1.value;
    const pw2 = c.formSignupPw2.value;

    if (pw1 !== pw2) {
        c.formErrorMessage.textContent = "Please ensure passwords match"
        c.formErrorMessage.classList.remove('visibility-hidden');
        return;
    }
    console.log('hello')
    const data = AJAX(c.signupURL, {
        email: email,
        password: pw1,
    });

    console.log(data);

});


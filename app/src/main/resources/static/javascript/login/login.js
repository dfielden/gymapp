'use strict'
import * as c from '../_constsAndEls.js';
import {AJAX, showFormMessage} from "../helper.js";
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
        showFormMessage("Login successful!", true, c.formLogin);
        setTimeout(() => {
            window.location.href = "/";
        }, 500)
    } else {
        showFormMessage(data, false, c.formLogin);
    }
});




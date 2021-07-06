import {ajaxTimeoutMillis} from './_constsAndEls.js';
import * as c from "./_constsAndEls.js";
import {Set} from "./exercise.js";

const timeout = function (millis) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long. Timeout after ${millis} milliseconds`));
        }, millis);
    });
};

// define get vs post dependent on whether upload data added to method call
export const AJAX = async function(url, uploadData = undefined) {
    try {
        // POST if uploadData added to argument
        const fetchPromise = uploadData ?
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(uploadData)
            })

            // GET by default
            : fetch(url);

        const res = await Promise.race([fetchPromise, timeout(ajaxTimeoutMillis)]); // two promises will race - timeout returns reject after time argument - i.e. we can add a timeout for load failure
        const data = await res.json();

        if(!res.ok) throw new Error(`${data.message} (${res.status})`);
        return data;
    } catch(err) {
        // throw err to deal with at point where function is called
        throw err;
    }
};

export const removeElements = (els) => els.forEach(el => el.remove());

export const isEmptyObject = (obj) => Object.keys(obj).length === 0;


export const showFormMessage = (message, success, formEl) => {
    const formMessage = formEl.querySelector('.form-msg');
    formMessage.textContent = message;
    formMessage.classList.remove('visibility-hidden');

    if (success) {
        formMessage.classList.remove('form-msg--error');
        formMessage.classList.add('form-msg--success');
    } else {
        formMessage.classList.remove('form-msg--success');
        formMessage.classList.add('form-msg--error');
    }
}

export const isInt = (n) => {
    return Number(n) === n && n % 1 === 0;
}

export const isFloat = (n) => {
    return Number(n) === n && n % 1 !== 0;
}

export const validateSetFormInputs = (reps, weight) => {
    return (isInt(parseInt(reps)) && !isFloat(parseFloat(reps)) && (isInt(parseInt(weight)) || isFloat(parseFloat(weight))));
}


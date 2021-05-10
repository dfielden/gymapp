/** _slideUpForms.js contains code controlling the showing and hiding of the swipe up forms for adding exercises or
 * editing sets of the current workout.
 * @type {NodeListOf<Element>}
 */

import * as c from './_constsAndEls.js';

export const showForm = function(formElement, slideDistanceREM) {
    formElement.classList.remove('display-none');
    setTimeout(function() {
        formElement.classList.add('display-hidden');
        formElement.classList.remove('display-hidden');
        formElement.style.transform = `translateY(${slideDistanceREM}rem)`;
    }, 0);
}


export const resetAllForms = function() {
    for (let i = 0; i < c.slideUpForms.length; i++) {
        hideFormWithoutAnimation(c.slideUpForms[i]);
    }
}

export const hideForm = function(formElement) {
    clearAllFormValues(formElement);
    formElement.style.transform = 'translateY(0rem)';
    setTimeout(function() {
        formElement.classList.add('display-none');
    }, 500);
}

export const hideFormWithoutAnimation = function(formElement) {
    clearAllFormValues(formElement);
    formElement.style.transform = 'translateY(0rem)';
    formElement.classList.add('display-none');
}

const clearAllFormValues = function(formEl) {
    const inputs = formEl.querySelectorAll('.form-input');
    formEl.querySelector('.form-error-msg').innerText='';
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].classList.contains("form-input--select")) {
            inputs[i].selectedIndex = 0;
        } else {
            inputs[i].value = "";
        }
    }

    c.selectExercises.selectedIndex = 0;
}
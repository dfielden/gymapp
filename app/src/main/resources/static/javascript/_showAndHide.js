/**
 * This file contains code for show/hide animations used in the GymApp.
 * */

import * as c from './_constsAndEls.js';


// SHOW AND HIDE SLIDING BUTTONS TO EDIT AND DELETE SETS OF CURRENT WORKOUT

export const resetSlidingDivs = function() {
    // reassign slidingBtnContainer to account for any newly-created elements.
    c.updateBtnContainer();
    for (let i = 0; i < c.slidingBtnContainer.length; i++) {
        c.slidingBtnContainer[i].style.transform = `translateX(100vw)`;
    }
}

document.addEventListener("touchstart",function(e) {
    if (e.target.closest('.slider') !== null) {
        startTouch(e);
    }
}, {passive: false});


document.addEventListener("touchmove", function(e) {
    if (e.target.closest('.slider') !== null) {
        moveTouch(e);
    }
}, {passive: false});


// Swipe Up / Down / Left / Right
let initialX = null;
let initialY = null;

function startTouch(e) {
    initialX = e.touches[0].clientX;
    initialY = e.touches[0].clientY;
}

function moveTouch(e) {
    if (initialX === null) {
        return;
    }

    if (initialY === null) {
        return;
    }

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = initialX - currentX;
    const diffY = initialY - currentY;

    // sliding horizontally
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // swiped left
        if (diffX > 0) {
            // prevent sideways scrolling
            e.preventDefault();
            // reset position of all sliding divs to off-screen
            resetSlidingDivs();
            // show the sliding div corresponding to the swipe position
            e.target.closest('.slider').querySelector('.slide-on-btn-container').style.transform = `translateX(calc(100vw - 15rem))`; // ensure we are targeting the slider itself
        } else {
            // swiped right
            e.target.closest('.slider').querySelector('.slide-on-btn-container').style.transform = `translateX(100vw)`; // ensure we are targeting the slider itself
        }
    }

    initialX = null;
    initialY = null;
}

// SLIDE FORMS UP/DOWN TO SHOW HIDE

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
    formEl.querySelector('.form-msg').innerText='';
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].classList.contains("form-input--select")) {
            inputs[i].selectedIndex = 0;
        } else {
            inputs[i].value = "";
        }
    }

    if (c.selectExercises) {
        c.selectExercises.selectedIndex = 0;
    }
}


// SLIDE ELEMENT OFF SCREEN WHEN DELETED
export const SlideOffAndDelete = function(el, elClass, parentElClass) {
    const parentEl = el.closest(parentElClass);
    el.style.transform = 'translateX(40rem)';
    el.style.opacity = '0.5';
    setTimeout(function () {
        el.remove();
        if (parentEl.querySelector(elClass) === null) {
            shrinkToNothing(parentEl);
        }
    }, 500);


}


// MAKE EMPTY DIVS SHRINK

export const shrinkToNothing = function(el) {
    el.style.opacity = "0";
    setTimeout(function() {
        //['width = "0%")', 'height = "0%"', 'opacity = "0.5"'].forEach(property => `el.style.${property}`);
        el.remove();
    }, 700);

}
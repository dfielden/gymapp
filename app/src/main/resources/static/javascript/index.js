'use strict';

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.btn--ghost').forEach(btn =>
        btn.addEventListener('click', () => btn.classList.toggle('btn--ghost--selected'))
    );
})

function getAllExercises() {
    return document.querySelectorAll(`.exercise-block__set__info`);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// SLIDING BUTTONS ////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const slidingDivs = document.querySelectorAll(".slider");
const slidingBtnContainer = document.querySelectorAll(".slide-on-btn-container");

for (let i = 0; i < slidingDivs.length; i++) {
    slidingDivs[i].addEventListener("touchstart", startTouch, false);
    slidingDivs[i].addEventListener("touchmove", moveTouch, false);
}

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

function resetSlidingDivs() {
    for (let i = 0; i < slidingBtnContainer.length; i++) {
        slidingBtnContainer[i].style.transform = `translateX(100vw)`;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// SLIDE UP FORMS - EDIT SET AND ADD EXERCISE  ////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const footerAddExercise = document.querySelector(".footer__icon--add");
const footerDeleteGroup = document.querySelector(".footer__icon--delete");
const formAddExerciseToCurrent = document.querySelector(".add-to-current");
const formEditSetInfo = document.querySelector(".edit-set");
const addToCurrentClose = document.querySelector(".add-to-current--close");
const editSetClose = document.querySelector(".edit-set--close");
const editSetBtns = document.querySelectorAll('.slide-on-btn--edit');
const editWeightInput = document.querySelector("#edit-weight");


footerAddExercise.addEventListener('click', function() {
    slideFormUp(formAddExerciseToCurrent, -42);
})

addToCurrentClose.addEventListener('click', function() {
    slideFormDown(formAddExerciseToCurrent);
})

// TODO: Apply this to the body and use bubbling to target future edit btns.
for (let i = 0; i < editSetBtns.length; i++) {
    editSetBtns[i].addEventListener('click', function() {
        slideFormUp(formEditSetInfo, -34);
        //editWeightInput.select(); buggy on iphone - causes large area under footer to become visible
    })
}

editSetClose.addEventListener('click', function() {
    slideFormDown(formEditSetInfo);
})


function slideFormUp(formElement, slideDistanceREM) {
    formElement.classList.remove('display-none');
    setTimeout(function() {
        formElement.classList.add('display-hidden');
        formElement.classList.remove('display-hidden');
        formElement.style.transform = `translateY(${slideDistanceREM}rem)`;
    }, 0);
}

function slideFormDown(formElement) {
    formElement.style.transform = 'translateY(0rem)';
    setTimeout(function() {
        formElement.classList.add('display-none');
    }, 500);
}

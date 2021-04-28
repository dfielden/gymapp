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

let slidingDivs = document.querySelectorAll(".slider");
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

    let currentX = e.touches[0].clientX;
    let currentY = e.touches[0].clientY;
    let diffX = initialX - currentX;
    let diffY = initialY - currentY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // sliding horizontally
        if (diffX > 0) {
            e.preventDefault(); // prevent sideways scrolling
            // swiped left
            console.log("swiped left");
            e.target.closest('.slider').querySelector('.slide-on-btn-container').style.transform = `translateX(calc(100vw - 18.5rem))`; // ensure we are targeting the slider itself
        } else {
            // swiped right
            console.log("swiped right");
            console.log(e.target);
            e.target.closest('.slider').querySelector('.slide-on-btn-container').style.transform = `translateX(100vw)`; // ensure we are targeting the slider itself

        }
    }

    initialX = null;
    initialY = null;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////  ////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
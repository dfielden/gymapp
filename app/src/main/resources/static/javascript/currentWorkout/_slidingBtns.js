/** _slidingBtns.js contains code controlling the swipe behaviour for showing and hiding the 'edit' and 'delete'
 * buttons for each set of the current workout.
 * @type {NodeListOf<Element>}
 */

import * as c from './_constsAndEls.js';

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



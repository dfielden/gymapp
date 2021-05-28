import * as c from '../_constsAndEls.js';
import * as sh from '../_showAndHide.js';
import {AJAX} from "../helper.js";
import {getCurrentWorkoutURL} from "../_constsAndEls.js";



// Declare variable to hold the exercise-block__sets to which we wish to append our new set
let exerciseBlock;

// Declare variable to hold the set block whose values to which we wish to edit
let setBlock;


function getAllExercises() {
    return document.querySelectorAll(`.exercise-block__set__info`);
}



const resetAll = function() {
    unselectAllRows();
    sh.resetSlidingDivs();
    sh.resetAllForms();
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// LOAD WORKOUT DATA UPON PAGE LOAD ////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const getCurrentWorkout = async function() {
    try {
        const url = window.location.href;
        const id = parseInt(url.substring(url.lastIndexOf('/') + 1));
        console.log('id = ' + id);
        const workout = await AJAX(getCurrentWorkoutURL + id);
        console.log(workout);
        c.title.textContent = workout.workoutName;
        // for (let i = 0; i < workout.exercises.length; i++) {
        //     const exercise = workout.exercises[i].exercise;
        //     appendNewExercise(exercise.exerciseName);
        //     const sets = workout.exercises[i].sets
        //     for (let j = 0; j < sets.length; j++) {
        //         appendNewSet(sets[j].weight, sets[j].reps, c.elBody.lastChild);
        //     }
        // }

    } catch (err) {
        console.error('Unable to load workout. Please try again.');
    }
}

window.addEventListener('load', e => {
    getCurrentWorkout();
})


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// COMPLETING AN EXERCISE ////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const unselectAllRows = function() {
    // reassign allSetContainers to account for any newly-created elements.
    c.updateSetContainers();
    c.footerUndo.classList.add('footer__icon--inactive');
    for (let i = 0; i < c.allSetContainers.length; i++) {
        c.allSetContainers[i].closest('.exercise-block__set-container').classList.remove('active', 'undo');
        //c.allSetContainers[i].closest('.exercise-block__set-container').classList.remove('undo');
        c.allSetContainers[i].querySelector('.done-container').classList.add('display-none');
    }
}

// SELECT A SET
const selectSet = function(selectedRow) {
    unselectAllRows();
    if (selectedRow.classList.contains('slider')) {
        selectedRow.classList.add('active');
        selectedRow.querySelector('.done-container').classList.remove('display-none');
    } else {
        selectedRow.classList.add('undo');
        c.footerUndo.classList.remove('footer__icon--inactive');

    }
    sh.resetSlidingDivs();
}



// MARK SET AS COMPLETE
const markSetComplete = function(doneBtn) {
    unselectAllRows();
    // show the completed counter
    doneBtn.previousElementSibling.classList.remove('display-none');

    // remove ability to slide row and format as completed.
    doneBtn.closest('.exercise-block__set-container').classList.add('complete');
    doneBtn.closest('.exercise-block__set-container').classList.remove('active', 'slider', 'undo');
    doneBtn.classList.add('display-none');
    resetAll();
}

// UNDO MARKING SET AS COMPLETE
const undoSetComplete = function() {
    const setContainer = document.querySelector('.undo');
    setContainer.classList.add('slider');
    setContainer.classList.remove('undo', 'complete');
    ['.done-container', '.timer-container'].forEach(el => setContainer.querySelector(el).classList.add('display-none'));
    c.footerUndo.classList.add('footer__icon--inactive');
}

c.footerUndo.addEventListener('click', function(e) {
    if (!e.target.classList.contains('footer__icon--inactive')) {
        undoSetComplete();
    }
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// METHODS FOR SET CONTAINERS ////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// EVENT BUBBLING
c.elBody.addEventListener('click', function(e) {
    // DO NOTHING IF CLICK ON PART OF BLOCK THAT HAS NO ASSOCIATED FUNCTIONALITY
    if (e.target.classList.contains("exercise-block") && e.target.classList.length === 1) {
        return;
    }
    // REMOVE CURRENT SET
    if (e.target.closest('.slide-on-btn--remove') !== null) {
        removeSelectedSet(e);
    // EDIT CURRENT SET
    } else if (e.target.closest('.slide-on-btn--edit') !== null) {
        editSelectedSet(e);
    } else {
        // COMPLETE CURRENT SET
        const doneBtn = e.target.closest('.done-container');
        if (doneBtn != null) {
            markSetComplete(doneBtn);
            return;
        }
        // SELECT CURRENT SET
        if (e.target.closest('.exercise-block__title') == null) {
            const selectedRow = e.target.closest('.exercise-block__set-container');
            selectSet(selectedRow);
        }
    }
})


const editSelectedSet = function(e) {
    c.formEditSetHeader.innerText = 'Update set';
    c.formEditSetSubmit.innerText = 'Update';
    sh.showForm(c.formEditSet, -34);
    setBlock = e.target.closest('.exercise-block__set-container');
    c.formEditSetWeight.value = parseFloat(setBlock.querySelector('.weight').innerText);
    c.formEditSetReps.value = parseInt(setBlock.querySelector('.reps').innerText);
    sh.resetSlidingDivs();
}

const removeSelectedSet = function(e) {
    e.target.closest('.slide-on-btn-container').style.display = 'none';

    const setContainer = e.target.closest('.exercise-block__set-container');
    const parentContainer = setContainer.closest('.exercise-block');
    sh.SlideOffAndDelete(setContainer,'.exercise-block__set-container', '.exercise-block');
    resetAll();

}


c.footerAddExercise.addEventListener('click', function() {
    resetAll();
    sh.showForm(c.formAddToCurrent, -43);
})


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// OTHER FORM FUNCTIONS ////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// INCREASE WEIGHT BTN
for (let i = 0; i < c.weightPlusBtns.length; i++) {
    c.weightPlusBtns[i].addEventListener('click', function(e) {
        const input = e.target.closest('.width45').querySelector('.form-input');
        increaseInputValue(input, 0.25);
    })
}

// INCREASE REPS BTN
for (let i = 0; i < c.repsPlusBtns.length; i++) {
    c.repsPlusBtns[i].addEventListener('click', function(e) {
        const input = e.target.closest('.width45').querySelector('.form-input');
        increaseInputValue(input, 1);
    })
}

// DECREASE WEIGHT BTN
for (let i = 0; i < c.weightMinusBtns.length; i++) {
    c.weightMinusBtns[i].addEventListener('click', function(e) {
        const input = e.target.closest('.width45').querySelector('.form-input');
        decreaseInputValue(input, 1);
    })
}

// DECREASE REPS BTN
for (let i = 0; i < c.repsMinusBtns.length; i++) {
    c.repsMinusBtns[i].addEventListener('click', function(e) {
        const input = e.target.closest('.width45').querySelector('.form-input');
        decreaseInputValue(input, 1);
    })
}

const increaseInputValue = function(formInput, amount) {
    let currentVal;
    if (formInput.value === '') {
        currentVal = 0.0;
    } else {
        currentVal = parseFloat(formInput.value);
    }
    formInput.value = (currentVal + parseFloat(`${amount}`));
}

const decreaseInputValue = function(formInput, amount) {
    formInput.value = Math.max(formInput.value - `${amount}`, 0);
}

c.formAddToCurrentClose.addEventListener('click', function() {
    sh.hideForm(c.formAddToCurrent);
    // Reset exerciseBlock param
    exerciseBlock = "";
})

c.formEditSetClose.addEventListener('click', function() {
    sh.hideForm(c.formEditSet);
    // Reset setBlock param
    setBlock = "";
})


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// ADDING NEW SET ////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// EVENT BUBBLING - BTNS TO ACTIVATE ADD SET FORM
c.elBody.addEventListener('click', function(e) {
    if(e.target.classList.contains('fa-plus-square')) {
        exerciseBlock = e.target.closest('.exercise-block').querySelector('.exercise-block__sets');
        activateFormAddEditSet();

        // POPULATE FORM INPUTS WITH DATA FROM LAST SET IN LIST
        const exBlock = e.target.closest('.exercise-block');
        // last set in list - returns node list - so use [0] to get the html element
        const lastSetBlock = exBlock.querySelectorAll('.exercise-block__set-container:nth-last-of-type(1)')[0];
        c.formEditSetWeight.value = parseFloat(lastSetBlock.querySelector('.weight').innerText);
        c.formEditSetReps.value = parseInt(lastSetBlock.querySelector('.reps').innerText);
    }
})

// ACTIVATE ADD/EDIT SET FORM
const activateFormAddEditSet = function () {
    resetAll();
    c.formEditSetHeader.innerText = 'Add set';
    c.formEditSetSubmit.innerText = 'Add!';
    sh.showForm(c.formEditSet, -35);
    //editWeightInput.select(); buggy on iphone - causes large area under footer to become visible

}

// SUBMIT ADD SET FORM
c.formEditSetSubmit.addEventListener('click', function(e) {
    e.preventDefault();
    if (!validateFormFilledIn(e.target.closest('form'))) {
        c.formEditSetError.innerText = 'Form inputs must not left empty.'
        return;
    }

    const weight = c.formEditSetWeight.value;
    const reps = c.formEditSetReps.value;

    // if not a blank string, exerciseBlock will evaluate to true
    if (exerciseBlock) {
        appendNewSet(weight, reps, exerciseBlock);
        exerciseBlock = "";
    } else {
        console.log('Code for Updating an existing set');
        setBlock.querySelector('.weight').innerText = `${weight} kg`;
        setBlock.querySelector('.reps').innerText = `${reps} reps`;
        setBlock = "";
    }
    sh.resetAllForms();
})

// APPENDING NEW SET
const appendNewSet = function(weight, reps, parentNode) {
    let html = `
        <div class="exercise-block__set-container slider">
        <div class="exercise-block__set-container__stats">
            <div class="weight">${weight} kg</div><div class="reps">${reps} reps</div>
        </div>
        <div class="exercise-block__set-container__timer">
            <div class="timer-container display-none"><span class="far fa-clock"></span> Completed: 00:00</div>
            <div class="done-container display-none"><span class="txt-btn">Done</span>&nbsp&nbsp<span class="fas fa-check-square"></span></div>
        </div>
        <div class="slide-on-btn-container">
            <div class="slide-on-btn slide-on-btn--remove">
                <div class="far fa-trash-alt"></div>
                <div class="icon-descriptor">remove</div>
            </div>
            <div class="slide-on-btn slide-on-btn--edit">
                <div class="far fa-edit"></div>
                <div class="icon-descriptor">edit</div>
            </div>
        </div>
    </div>
    `;
    parentNode.insertAdjacentHTML('beforeend', html);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// ADDING NEW EXERCISE ////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// SUBMIT ADD NEW EXERCISE FORM
c.formAddToCurrentSubmit.addEventListener('click', function(e) {
    e.preventDefault();
    if (!validateFormFilledIn(e.target.closest('form'))) {
        c.formAddToCurrentError.innerText = 'Form inputs must not left empty.'
        return;
    }

    const name = c.formAddToCurrentName.value;
    const weight = c.formAddToCurrentWeight.value;
    const reps = c.formAddToCurrentReps.value;

    appendNewExercise(name, weight, reps);
    sh.resetAllForms();
    exerciseBlock = "";
})

// APPEND NEW EXERCISE
const appendNewExercise = function(name, weight, reps) {
    let html = `
        <div class="exercise-block">
            <div class="exercise-block__title">
                <div class="heading heading--current-exercise heading--3">${name}</div>
                <div class="far fa-plus-square"></div>
            </div>
        
            <div class="exercise-block__sets">
                <div class="exercise-block__set-container slider">
                <div class="exercise-block__set-container__stats">
                    <div class="weight">${weight} kg</div><div class="reps">${reps} reps</div>
                </div>
                <div class="exercise-block__set-container__timer">
                    <div class="timer-container display-none"><span class="far fa-clock"></span> Completed: 00:00</div>
                    <div class="done-container display-none"><span class="txt-btn">Done</span>&nbsp&nbsp<span class="fas fa-check-square"></span></div>
                </div>
                <div class="slide-on-btn-container">
                    <div class="slide-on-btn slide-on-btn--remove">
                        <div class="far fa-trash-alt"></div>
                        <div class="icon-descriptor">remove</div>
                    </div>
                    <div class="slide-on-btn slide-on-btn--edit">
                        <div class="far fa-edit"></div>
                        <div class="icon-descriptor">edit</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    c.elBody.insertAdjacentHTML('beforeend', html);
}


const validateFormFilledIn = function(formEl) {
    const inputs = formEl.querySelectorAll('.form-input');
    let filledIn = true;

    formEl.querySelector('.form-error-msg').innerText='';
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].classList.contains("form-input--select")) {
            if (inputs[i].selectedIndex === 0) {
                filledIn = false;
            }
        } else {
            if (inputs[i].value === '') {
                filledIn = false;
            }
        }
    }

    return filledIn;
}


import * as c from '../_constsAndEls.js';
import * as sh from '../_showAndHide.js';
import {AJAX} from "../helper.js";
import {ExerciseGroup, Exercise, Set} from "../exercise.js";
import {Timer} from "../welcome/timer.js";



// Declare variable to hold the exercise-block__sets to which we wish to append our new set
let exerciseBlock;

// Declare variable to hold the set block whose values to which we wish to edit
let setBlock;

// Declare variable to hold the current workout
let workout;


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
        // load workout in progress if it exists
        workout = await AJAX(c.getWorkoutInProgressURL);
    } catch (err) {
        // otherwise load the selected workout from the workouts table
        try {
            const url = window.location.href;
            const id = parseInt(url.substring(url.lastIndexOf('/') + 1));
            workout = await AJAX(c.getCurrentWorkoutURL + id);

            // add exercise and set keys
            workout.maxExerciseIndex = 0;
            workout.maxKeyId = 0;
            const {exercises} = workout
            for (let i = 0; i < exercises.length; i++) {
                exercises[i].exIndex = i;
                workout.maxExerciseIndex += 1;

                const {sets} = exercises[i];
                for (let j = 0; j < sets.length; j++) {
                    sets[j].key = workout.maxKeyId;
                    sets[j].completed = false;
                    workout.maxKeyId += 1;
                }
            }

            // post the workout to the workout in progress table so user can save progress throughout workout
            try {
                await AJAX(c.createWorkoutInProgressURL, workout);
            } catch (err) {
                console.error("Unable to save current workout progress.")
            }

        } catch (err) {
            console.error('Unable to load workout. Please try again.');
        }
    }

    // finally render workout on screen
    renderWorkout();

    // add timer to completed sets
    const domSetsCompleted = document.querySelectorAll('.done');

    const {exercises} = workout
    for (let i = 0; i < exercises.length; i++) {
        const {sets} = exercises[i];
        for (let j = 0; j < sets.length; j++) {
            if (sets[j].completed) {
                // find representation of set on dom
                domSetsCompleted.forEach(el => {
                    console.log(el);
                    if (parseInt(el.dataset.key) === sets[j].key) {
                        const completedTime = sets[j].completedTime;
                        const counter = el.querySelector('.timer-container');
                        counter.classList.remove('display-none');
                        const timer = new Timer(counter, completedTime);
                        // add id of setInterval to timer so we can stop it running if user 'undoes' completion of exercise
                        counter.setAttribute("data-timerid", String(timer.init()));
                    }
                })
            }
        }
    }



}

const renderWorkout = function() {
    const {workoutName, exercises} = workout;
    c.title.textContent = workoutName;

    for (let i = 0; i < exercises.length; i++) {
        const {exercise, sets, exIndex} = exercises[i];
        renderExercise(new ExerciseGroup(exercise, sets), exIndex);
    }
}

window.addEventListener('load', e => {
    getCurrentWorkout();
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// TRAVERSING JSON WORKOUT ////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const removeSetFromJson = function(dataid) {
    const {exercises} = workout;
    for (let i = 0; i < exercises.length; i++) {
        let {sets} = exercises[i];
        exercises[i].sets = sets.filter(set => set.key !== dataid);
    }

    // if all sets removed from any exercise, remove it from teh
    workout.exercises = exercises.filter(exercise => exercise.sets.length !== 0);
    workout.maxExerciseIndex = workout.exercises.length - 1;
}

const getSetFromKey = function(key) {
    const {exercises} = workout;

    for (let i = 0; i < exercises.length; i++) {
        const {sets} = exercises[i];
        for (let j = 0; j < sets.length; j++) {
            if (sets[j].key === key) {
                return sets[j];
            }
        }
    }
    throw Error("Unable to find set to mark complete");
}

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
    const counter = doneBtn.previousElementSibling;
    counter.classList.remove('display-none');
    const timer = new Timer(counter);
    // add id of setInterval to timer so we can stop it running if user 'undoes' completion of exercise
    counter.setAttribute("data-timerid", String(timer.init()));


    // mark set completed in the workout json object
    const key = doneBtn.closest('.exercise-block__set-container').dataset.key;
    const set = getSetFromKey(parseInt(key));
    set.completed = true;
    set.completedTime = timer.getStartTime();

    // remove ability to slide row and format as completed.
    doneBtn.closest('.exercise-block__set-container').classList.add('complete');
    doneBtn.closest('.exercise-block__set-container').classList.remove('active', 'slider', 'undo');
    doneBtn.classList.add('display-none');
    resetAll();

    updateWorkoutProgress();
}

// UNDO MARKING SET AS COMPLETE
const undoSetComplete = function() {
    const setContainer = document.querySelector('.undo');
    setContainer.classList.add('slider');
    setContainer.classList.remove('undo', 'complete');
    ['.done-container', '.timer-container'].forEach(el => setContainer.querySelector(el).classList.add('display-none'));
    c.footerUndo.classList.add('footer__icon--inactive');

    const timerId = +setContainer.querySelector('.timer-container').dataset.timerid;
    clearInterval(timerId);

    // mark set as not complete in the workout object
    const key = setContainer.dataset.key;
    getSetFromKey(parseInt(key)).completed = false;
    updateWorkoutProgress();
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
    if ((e.target.classList.contains("exercise-block") && e.target.classList.length === 1) || e.target === c.elBody) {
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

}

const removeSelectedSet = function(e) {
    // hide slide-on buttons
    e.target.closest('.slide-on-btn-container').style.display = 'none';

    const setContainer = e.target.closest('.exercise-block__set-container');

    // update json workout
    const setDataKey = parseInt(setContainer.dataset.key);
    removeSetFromJson(setDataKey);

    sh.SlideOffAndDelete(setContainer,'.exercise-block__set-container', '.exercise-block');
    resetAll();
    updateWorkoutProgress();

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
        const set = new Set(weight, reps);
        set.key = workout.maxKeyId;
        workout.maxKeyId += 1;
        renderNewSet(set, exerciseBlock);
        exerciseBlock = "";
    } else {
        // update json workout
        const setDataKey = parseInt(setBlock.dataset.key);
        const set = getSetFromKey(setDataKey);
        set.weight = weight;
        set.reps = reps;

        // update dom
        setBlock.querySelector('.weight').innerText = `${weight} kg`;
        setBlock.querySelector('.reps').innerText = `${reps} reps`;
        setBlock = "";
    }
    sh.resetAllForms();
    updateWorkoutProgress();
})

// APPENDING NEW SET
const renderNewSet = function(set, parentNode) {
    parentNode.insertAdjacentHTML('beforeend', generateNewSetMarkup(set));

    // update workout object
    const exerciseIndex = parseInt(parentNode.closest('.exercise-block').dataset.exindex);
    workout.exercises[exerciseIndex].sets.push({
        weight: set.weight,
        reps: set.reps,
        key: set.key,
        completed: false
    });
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
    const exerciseGroup = new ExerciseGroup(new Exercise(c.formAddToCurrentName.value));
    const set = new Set(c.formAddToCurrentWeight.value, c.formAddToCurrentReps.value);
    set.key = workout.maxKeyId;
    workout.maxKeyId += 1;
    exerciseGroup.addSet(set);

    // update workout object
    workout.exercises.push({
        exercise: {exerciseName: exerciseGroup.exercise.exerciseName, muscleGroups: []},
        sets: [{
            weight: set.weight,
            reps: set.reps,
            key: set.key,
            completed: false
        }],
        exIndex: workout.maxExerciseIndex,
    });

    // render exercise
    renderExercise(exerciseGroup, workout.maxExerciseIndex);
    workout.maxExerciseIndex += 1;
    sh.resetAllForms();
    exerciseBlock = "";
    updateWorkoutProgress();
})

// RENDER EXERCISE
const renderExercise = function(exerciseGroup, index) {
    let html = `
        <div class="exercise-block" data-exindex="${index}">
            <div class="exercise-block__title">
                <div class="heading heading--current-exercise heading--3">${exerciseGroup.exercise.exerciseName}</div>
                <div class="far fa-plus-square"></div>
            </div>
            <div class="exercise-block__sets">
    `;

    // add sets
    for (let i = 0; i < exerciseGroup.sets.length; i++) {
        const set = exerciseGroup.sets[i];
        set.key = exerciseGroup.sets[i].key;
        html += generateNewSetMarkup(set);
    }

    html += `
            </div>
        </div>
    `;

    c.elBody.insertAdjacentHTML('beforeend', html);
}

const generateNewSetMarkup = function(set) {
;    return `
        <div class="exercise-block__set-container ${set.completed ? 'complete done' : 'slider'}" data-key="${set.key}">
            <div class="exercise-block__set-container__stats">
                <div class="weight">${set.weight} kg</div>
                <div class="reps">${set.reps} reps</div>
            </div>
            <div class="exercise-block__set-container__timer">
                <div class="timer-container ${set.completed ? '' : 'display-none'}"><span class="far fa-clock">&nbsp</span><span class="counter">00:00</span>
                </div>
                <div class="done-container display-none"><span class="txt-btn">Done</span>&nbsp&nbsp<span
                    class="fas fa-check-square"></span></div>
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// UPDATE WORKOUT PROGRESS ////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const updateWorkoutProgress = function() {
    try {
        AJAX(c.updateWorkoutInProgressURL, workout);
    } catch (err) {
        console.error(err.message, err.errorCode, "unable to update workout progress");
    }
}
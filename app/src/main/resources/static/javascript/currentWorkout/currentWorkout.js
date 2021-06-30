import * as c from '../_constsAndEls.js';
import * as sh from '../_showAndHide.js';
import {AJAX} from "../helper.js";
import {ExerciseGroup, Exercise, Set} from "../exercise.js";
import {Timer} from "../timer.js";
import {formFinishWorkout, formFinishWorkoutClose} from "../_constsAndEls.js";
const FINISH_VALUE = 'FINISH_SUCCESS'; // must match PSFS FINISH_WORKOUT_SUCCESS_RESPONSE_VALUE in GymAppApplication.java



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
        // otherwise load the selected workout from the workout templates table
        try {
            const url = window.location.href;
            const id = parseInt(url.substring(url.lastIndexOf('/') + 1));
            workout = await AJAX(c.getCurrentWorkoutURL + id);
            // add exercise and set keys
            workout.maxExerciseIndex = 0;
            workout.maxKeyId = 0;
            workout.workoutId = id;
            workout.completedSets = 0;
            console.log(workout);
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
    console.log(workout);
    toggleFinishBtnState();
    renderWorkout();

    // add timer to completed sets
    const allSets = []
    const {exercises} = workout;
    for (let i = 0; i < exercises.length; i++) {
        allSets.push(exercises[i].sets);
    }
    allSets.flat().filter(set => set.completed).forEach(set => {
        const el = document.querySelector(`.exercise-block__set-container[data-key="${set.key}"`)
        const completedTime = set.completedTime;
        const timerContainer = el.querySelector('.timer-container');
        const timer = new Timer(timerContainer, completedTime);
        markSetComplete(el, timer);
    });


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

    // if all sets removed from any exercise, remove it from the json object - do not decrement maxExIndex to avoid duplicates
    workout.exercises = exercises.filter(exercise => exercise.sets.length !== 0);
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

const toggleFinishBtnState = function() {
    if (workout.completedSets > 0) {
        c.footerBtnFinish.classList.remove('footer__btn--inactive');
    } else {
        c.footerBtnFinish.classList.add('footer__btn--inactive');
    }
}

// MARK SET AS COMPLETE
const markSetComplete = function(selectedRow, timer) {
    unselectAllRows();
    // show the completed counter
    const timerContainer = selectedRow.querySelector('.timer-container');
    timerContainer.classList.remove('display-none');
    // add id of setInterval to timer so we can stop it running if user 'undoes' completion of exercise
    timerContainer.setAttribute("data-timerid", String(timer.init()));


    // mark set completed in the workout json object
    const key = selectedRow.dataset.key;
    const set = getSetFromKey(parseInt(key));
    set.completed = true;
    set.completedTime = timer.getStartTime();

    // remove ability to slide row and format as completed.
    selectedRow.classList.add('complete');
    selectedRow.classList.remove('active', 'slider', 'undo');
    selectedRow.querySelector('.done-container').classList.add('display-none');
    toggleFinishBtnState();

    resetAll();
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

    workout.completedSets -= 1;
    toggleFinishBtnState();
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
        const selectedRow = e.target.closest('.exercise-block__set-container');

        // COMPLETE CURRENT SET
        const doneBtn = e.target.closest('.done-container');
        if (doneBtn != null) {
            const timerContainer = selectedRow.querySelector('.timer-container');
            workout.completedSets += 1;
            markSetComplete(selectedRow, new Timer(timerContainer));
            updateWorkoutProgress();
            return;
        }
        // SELECT CURRENT SET
        if (e.target.closest('.exercise-block__title') == null) {
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

    // update workout json object
    const exerciseIndex = parseInt(parentNode.closest('.exercise-block').dataset.exindex);
    workout.exercises.filter(el => el.exIndex === exerciseIndex)[0].sets.push({
        weight: set.weight,
        reps: set.reps,
        key: set.key,
        completed: false
    });
    console.log(workout)
    updateWorkoutProgress();
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
    return `
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
        console.error(err.message, err.errorCode, "Unable to update workout progress");
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// COMPLETE WORKOUT ////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


c.formFinishWorkoutClose.addEventListener('click', function() {
    sh.hideForm(c.formFinishWorkout);
})

c.btnCancelFinish.addEventListener('click', function() {
    sh.hideForm(c.formFinishWorkout);
})

c.btnConfirmFinish.addEventListener('click', async function() {
    const data = await AJAX(c.finishWorkoutURL);
    if (data === FINISH_VALUE) {
        showFormMessage("Successfully saved workout", true);
        setTimeout(() => {
            window.location.href = "/welcome";
        }, 500)
    } else {
        showFormMessage(data, false);
    }
})

c.footerBtnFinish.addEventListener('click', function(e) {
    if (!e.target.classList.contains('footer__btn--inactive')) {
        sh.showForm(c.formFinishWorkout, -35);
        getAllCompletedSets();
    }
})

const getAllCompletedSets = () => {
    const done = document.querySelectorAll('.done');
    const exercises = []
    console.log(done);

    for (let i = 0; i < done.length; i++) {
        const title = done[i].closest('.exercise-block').querySelector('.heading').innerText;
        const weight = parseFloat(done[i].querySelector('.weight'));
        const reps = parseInt(done[i].querySelector('.reps'));;
        const exericseId = 1;
        const timeCompleted =  new Date().toISOString();

        const exercise = {
            exerciseName: title,
            weight: weight,
            reps: reps,
            exericseId: exericseId,
            timeCompleted: timeCompleted
        }
        exercises.push(exercise);
        console.log(exercise);
    }
}

// TODO: remove duplicate function
const showFormMessage = (message, success) => {
    c.formMessage.textContent =  message;
    c.formMessage.classList.remove('visibility-hidden');

    if (success) {
        c.formMessage.classList.remove('form-msg--error');
        c.formMessage.classList.add('form-msg--success');
    } else {
        c.formMessage.classList.remove('form-msg--success');
        c.formMessage.classList.add('form-msg--error');
    }
}
import * as c from '../_constsAndEls.js';
import * as sh from '../_showAndHide.js';
import * as def from "./_defineWorkout.js";
import {ExerciseGroup, Exercise, Set, Workout} from "../exercise.js";
import {createExerciseURL, getExercisesURL, createWorkoutURL, title} from "../_constsAndEls.js";
import {AJAX} from "../helper.js";

let exercises = {};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// LOAD DATA UPON PAGE LOAD ////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const getExercises = async function() {
    try {
        const data = await AJAX(getExercisesURL);
        console.log(data);
        exercises = data;
        for (const key in exercises) {
            addExerciseToSelect(exercises[key].exerciseName, key);
        }

    } catch (err) {
        console.error('Unable to load exercises. Please try again.');
    }
}

window.addEventListener('load', e => {
    getExercises();
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// ADDING EXERCISE TO WORKOUT ////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const addExercise = function() {
    if (c.selectExercise.selectedIndex !== 0) {
        const html = `
            <div class="transparent-form-group">
                <div class="transparent-form-group__title">
                    <div class="heading heading--3 heading--transparent-box">${c.selectExercise.value}<span class="far fa-plus-square far-title"></span></div>
                    <div class="flex-container--col">
                        <div class="fas fa-sort-up"></div>
                        <div class="fas fa-sort-down"></div>
                    </div>
                </div>
                <div class="two-input-container">
                    <span class="two-input-container--label">Weight:</span><input inputmode="decimal" placeholder="kg" min="0" class="form-input form-input--new-workout w">
                    <span class="two-input-container--label">Reps:</span><input inputmode="numeric" placeholder="reps" min="0" class="form-input form-input--new-workout r">
                    <span class="far fa-trash-alt"></span>
            </div>
        `;
        c.exercises.insertAdjacentHTML('beforeend', html);
    }
}

c.addExerciseBtn.addEventListener('click', addExercise);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// UPDATING ORDER OF EXERCISES ////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const swapDivs = function(divGoingDown, divGoingUp) {
    const prev1 = divGoingDown.previousSibling;
    const prev2 = divGoingUp.previousSibling;

    prev1.after(divGoingUp);
    prev2.after(divGoingDown);
}

c.elBody.addEventListener('click', function(e) {
    if (e.target.classList.contains('fa-sort-up')) {
        const currentEl = e.target.closest('.transparent-form-group');
        const prevSiblingEl = currentEl.previousElementSibling;

        if (prevSiblingEl !== null) {
            swapDivs(currentEl, prevSiblingEl);
        }
    }
});

c.elBody.addEventListener('click', function(e) {
    if (e.target.classList.contains('fa-sort-down')) {
        const currentEl = e.target.closest('.transparent-form-group');
        const nextSiblingEl = currentEl.nextElementSibling;

        if (nextSiblingEl !== null) {
            swapDivs(currentEl, nextSiblingEl);
        }
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// ADDING AND REMOVING SETS ////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

c.elBody.addEventListener('click', function(e) {
    if (e.target.classList.contains('fa-plus-square')) {
        appendNewSet(e.target.closest('.transparent-form-group'));
    }
})

const appendNewSet = function(exerciseGroupEl) {
    const html = `
        <div class="two-input-container">
            <span class="two-input-container--label">Weight:</span><input inputmode="decimal" placeholder="kg" min="0" class="form-input form-input--new-workout w">
            <span class="two-input-container--label">Reps:</span><input inputmode="numeric" placeholder="reps" min="0" class="form-input form-input--new-workout r">
            <span class="far fa-trash-alt"></span>
        </div>
    `;
    exerciseGroupEl.insertAdjacentHTML('beforeend', html);
}

c.elBody.addEventListener('click', function(e) {
    if (e.target.classList.contains('fa-trash-alt')) {
        removeSet(e.target.closest('.two-input-container'));
    }
});

const removeSet = function(setContainer) {
    sh.SlideOffAndDelete(setContainer, '.two-input-container', '.transparent-form-group');
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// CREATING COMPLETELY NEW EXERCISE ////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.btn--ghost').forEach(btn =>
        btn.addEventListener('click', () => btn.classList.toggle('btn--ghost--selected'))
    );
});

c.selectExercise.addEventListener('change', function() {
    if (c.selectExercise.value === "NEW") {
        activateNewExerciseForm();
    }
})


const activateNewExerciseForm = function() {
    toggleFooterEls();
    c.createNewExForm.classList.remove('display-none')
}

const toggleFooterEls = function() {
    [c.selectExercise, c.addExerciseBtn, c.btnCreateExercise].forEach(el => el.classList.toggle('display-none'));
}

const addExerciseToSelect = function(text, value) {
    // Add newly-created element to penultimate position of select - so add new exercise always at end
    const option = new Option(text, text);
    option.setAttribute("data-id", value);
    c.selectExercise.options.add(option,c.selectExercise.length-1)

}

const createNewExercise = function() {
    let exerciseName = c.createExerciseName.value;
    if (exerciseName === '') {
        return;
    }
    // TODO: Check exercise of same name does not exist

    // Create new exercise object
    const exercise = new Exercise(exerciseName);

    // Add muscle groups to exercise
    const selectedMuscleGroups = document.querySelectorAll('.btn--ghost--selected');
    selectedMuscleGroups.forEach(btn => exercise.addMuscleGroup(btn.textContent.toUpperCase()));

    // Submit data
    AJAX(createExerciseURL, exercise);

    // Add newly-created exercise to penultimate position of select
    addExerciseToSelect(exerciseName, exerciseName);
    c.selectExercise.value = exerciseName;

    // Add exercise to workout schedule
    addExercise();
    closeCreateExerciseForm(c.selectExercise.length-2);
}

c.btnCreateExercise.addEventListener('click', createNewExercise);

const resetMuscleGroupBtns = function() {
    const btns = c.containerMuscleGroups.querySelectorAll('.btn--ghost');
    for (let i = 0; i < btns.length; i++) {
        btns[i].classList.remove('btn--ghost--selected');
    }
}


const closeCreateExerciseForm = function (index= 0) {
    c.createNewExForm.classList.add('display-none');
    resetMuscleGroupBtns();
    toggleFooterEls();
    c.createExerciseName.value = "";
    c.selectExercise.selectedIndex = index;
}

c.createNewExFormClose.addEventListener('click', closeCreateExerciseForm);

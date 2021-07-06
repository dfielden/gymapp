import {AJAX, showFormMessage} from "../helper.js";
import {createWorkoutFromPage} from "./_defineWorkout.js";
import * as def from "./_defineWorkout.js";
import * as c from "../_constsAndEls.js";
import {ExerciseGroup} from "../exercise.js";

const UPDATE_SUCCESS_VALUE = "UPDATE_SUCCESS" // must match PSFS UPDATE_WORKOUT_SUCCESS_RESPONSE_VALUE in GymAppAp


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// LOAD WORKOUT DATA UPON PAGE LOAD ////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const url = window.location.href;
const workoutId = parseInt(url.substring(url.lastIndexOf('/') + 1));

const getCurrentWorkout = async function() {
    try {
        const workout = await AJAX(c.getCurrentWorkoutURL + workoutId);
        console.log(workout);
        const {workoutName, exercises} = workout;
        c.formWorkoutName.value = workoutName;

        for (let i = 0; i < exercises.length; i++) {
            const {exercise, sets} = exercises[i];
            renderExercise(new ExerciseGroup(exercise, sets));
        }

    } catch (err) {
        console.error('Unable to load workout. Please try again.');
    }
}

window.addEventListener('load', e => {
    getCurrentWorkout();
})

const renderExercise = function(exerciseGroup) {
    let html = `
        <div class="transparent-form-group">
            <div class="transparent-form-group__title">
                <div class="heading heading--3 heading--transparent-box" data-id="${exerciseGroup.exercise.id}">${exerciseGroup.exercise.exerciseName}<span class="far fa-plus-square far-title"></span></div>
                <div class="flex-container--col">
                    <div class="fas fa-sort-up"></div>
                    <div class="fas fa-sort-down"></div>
                </div>
            </div>
    `;

    // add sets
    for (let i = 0; i < exerciseGroup.sets.length; i++) {
        const set = exerciseGroup.sets[i];
        html += generateNewSetMarkup(set.weight, set.reps);
    }

    html += `
        </div>
    `;

    c.exercises.insertAdjacentHTML('beforeend', html);
}

const generateNewSetMarkup = function(weight, reps) {
    return `
        <div class="two-input-container">
            <span class="two-input-container--label">Weight:</span><input inputmode="decimal" value="${weight}" placeholder="kg" min="0" class="form-input form-input--new-workout w">
            <span class="two-input-container--label">Reps:</span><input inputmode="numeric" value="${reps}" placeholder="reps" min="0" class="form-input form-input--new-workout r">
            <span class="far fa-trash-alt"></span>
        </div>
    `;
}


const updateWorkout = async function(workout) {

    // Submit data
    const url = c.updateWorkoutURL + workoutId;
    const data = await AJAX(url, workout);

    if (data === UPDATE_SUCCESS_VALUE) {
        showFormMessage("Successfully updated workout", true, c.formEditWorkout);
        setTimeout(() => {
            window.location.href = "/";
        }, 500)
    } else {
        showFormMessage("Unable to update workout. Please try again.", false, c.formEditWorkout);
    }
}


c.btnEditWorkout.addEventListener('click', async function(e) {
    e.preventDefault();

    if (c.formWorkoutName.value.trim() === '') {
        showFormMessage("Please give workout a name", false, c.formEditWorkout);
        return;
    }

    let workout;
    try {
        workout = await createWorkoutFromPage();
    } catch(err) {
        showFormMessage(err.message, false, c.formEditWorkout);
        return;
    }

    updateWorkout(workout);
});


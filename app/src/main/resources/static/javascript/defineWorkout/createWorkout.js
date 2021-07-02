import {AJAX} from "../helper.js";
import * as c from "../_constsAndEls.js";
import * as def from "./_defineWorkout.js";
import {Exercise, ExerciseGroup, Set, Workout} from "../exercise.js";
import {formWorkoutName, getMuscleGroupsURL} from "../_constsAndEls.js";

const CREATE_SUCCESS_VALUE = "CREATE_SUCCESS" // must match PSFS FINISH_WORKOUT_SUCCESS_RESPONSE_VALUE in GymAppAp

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// CREATE WORKOUT ////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const submitWorkout = async function(workout) {

    // Submit data
    const data = await AJAX(c.createWorkoutURL, workout);

    if (data === CREATE_SUCCESS_VALUE) {
        showFormMessage("Successfully created workout!", true);
        setTimeout(() => {
            window.location.href = "/welcome";
        }, 500)
    } else {
        showFormMessage("Unable to create workout. Please try again.", false);
    }
}


c.btnCreateWorkout.addEventListener('click', async function(e) {
    e.preventDefault();

    if (c.formWorkoutName.value.trim() === '') {
        showFormMessage("Please give workout a name", false);
        return;
    }

    const workout = await createWorkoutFromPage();
    submitWorkout(workout);
});

const createWorkoutFromPage = async() => {
    const workout = new Workout(c.formWorkoutName.value);

    // get all transparent form groups (each contains one exercise)
    const exercises = c.exercises.querySelectorAll('.transparent-form-group');
    for (const el of exercises) {
        const exerciseId = el.querySelector('.heading').dataset.id;
        const muscleGroups = await AJAX(getMuscleGroupsURL + exerciseId);
        const exercise = new Exercise(el.querySelector('.heading').textContent.trim(), muscleGroups);
        exercise.id = parseInt(exerciseId);
        const exerciseGroup = new ExerciseGroup(exercise);
        // get all sets
        const sets = el.querySelectorAll('.two-input-container');
        sets.forEach(set => {
            const weight = set.querySelector('.w').value;
            const reps = set.querySelector('.r').value;
            exerciseGroup.addSet(new Set(weight, reps));
        });
        workout.addExerciseGroup(exerciseGroup);
    }
    return workout;
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
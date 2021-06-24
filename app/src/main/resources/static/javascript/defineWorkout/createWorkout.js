import {AJAX} from "../helper.js";
import * as c from "../_constsAndEls.js";
import * as def from "./_defineWorkout.js";
import {Exercise, ExerciseGroup, Set, Workout} from "../exercise.js";
import {getMuscleGroupsURL} from "../_constsAndEls.js";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// CREATE WORKOUT ////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const submitWorkout = function(workout) {
    console.log(workout);

    // Submit data
    AJAX(c.createWorkoutURL, workout);
}


c.btnCreateWorkout.addEventListener('click', async function(e) {
    e.preventDefault();
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
        console.log(muscleGroups);
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
    console.log(workout);
    return workout;
}


export const setViewForCreate = function(btn) {
    document.title = 'Create workout';
    c.title.innerHTML = 'Create workout';
    btn.setAttribute('id', 'btn-create-workout');
    btn.innerHTML = 'Create workout!';
    formCreateWorkout();
}

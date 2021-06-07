import {AJAX} from "../helper.js";
import * as c from "../_constsAndEls.js";
import {Exercise, ExerciseGroup, Set, Workout} from "../exercise.js";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// CREATE WORKOUT ////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const createWorkout = function(workout) {
    console.log(workout);

    // Submit data
    AJAX(c.createWorkoutURL, workout);
}


c.btnCreateWorkout.addEventListener('click', function(e) {
    e.preventDefault();
    const workout = new Workout(c.formWorkoutName.value);

    // get all transparent form groups (each contains one exercise)
    const exercises = c.exercises.querySelectorAll('.transparent-form-group');
    exercises.forEach(el => {
        const exercise = new Exercise(el.querySelector('.heading').textContent.trim());
        const exerciseGroup = new ExerciseGroup(exercise);
        // get all sets
        const sets = el.querySelectorAll('.two-input-container');
        sets.forEach(set => {
            const weight = set.querySelector('.w').value;
            const reps = set.querySelector('.r').value;
            exerciseGroup.addSet(new Set(weight, reps));
        });
        workout.addExerciseGroup(exerciseGroup);
    });

    console.log(JSON.stringify(workout));
    createWorkout(workout);
});


export const setViewForCreate = function(btn) {
    document.title = 'Create workout';
    c.title.innerHTML = 'Create workout';
    btn.setAttribute('id', 'btn-create-workout');
    btn.innerHTML = 'Create workout!';
    formCreateWorkout();
}

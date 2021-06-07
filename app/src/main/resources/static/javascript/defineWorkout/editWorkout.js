import {AJAX} from "../helper.js";
import {getCurrentWorkoutURL} from "../_constsAndEls.js";
import * as def from "./_defineWorkout.js";
import * as c from "../_constsAndEls.js";
import {ExerciseGroup} from "../exercise.js";


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// LOAD WORKOUT DATA UPON PAGE LOAD ////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const getCurrentWorkout = async function() {
    try {
        const url = window.location.href;
        const id = parseInt(url.substring(url.lastIndexOf('/') + 1));
        const workout = await AJAX(getCurrentWorkoutURL + id);
         console.log(workout);
        // const {workoutName, exercises} = workout;
        // c.title.textContent = workoutName;
        //
        // for (let i = 0; i < exercises.length; i++) {
        //     const {exercise, sets} = exercises[i];
        //     renderExercise(new ExerciseGroup(exercise, sets));
        // }

    } catch (err) {
        console.error('Unable to load workout. Please try again.');
    }
}


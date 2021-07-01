import {AJAX} from "./helper.js";
import {getExercisesURL} from "./_constsAndEls.js";
import * as c from "./_constsAndEls.js";

let exercises = {}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// LOAD DATA UPON PAGE LOAD ////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const getExercises = async function() {
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

export const addExerciseToSelect = function(text, value) {
    // Add newly-created element to penultimate position of select - so add new exercise always at end
    const option = new Option(text, text);
    option.setAttribute("data-id", value);
    c.selectExercise.options.add(option, c.selectExercise.length);
}
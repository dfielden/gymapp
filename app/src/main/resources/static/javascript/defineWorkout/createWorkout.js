import {AJAX, showFormMessage} from "../helper.js";
import * as c from "../_constsAndEls.js";
import * as def from "./_defineWorkout.js";

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
            window.location.href = "/";
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

    const workout = await def.createWorkoutFromPage();
    submitWorkout(workout);
});



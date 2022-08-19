import {AJAX, isEmptyObject} from "../helper.js";
import * as c from "../_constsAndEls.js";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// LOAD WORKOUTS UPON PAGE LOAD ////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let myCompletedWorkouts;

export const getCompletedWorkouts = async function() {
    try {
        const data = await AJAX(c.getAllCompletedWorkoutsURL);

        for (const key in data) {
            const id = key;
            const completedWorkout = JSON.parse(data[key]);
            await displayWorkout(completedWorkout, id);
        }
        if(!isEmptyObject(data)) {
            c.completedWorkoutsContainer.querySelector('.default-msg').classList.add('display-none');
        }
        myCompletedWorkouts = document.querySelectorAll('.completed-workout');

    } catch (err) {
        console.error('Unable to load completed workouts. Please try again.');
    }
}

const displayWorkout = async function(completedWorkout, completedWorkoutId) {
    const workoutTemplateId = completedWorkout.workoutId;
    const workoutTemplate = await AJAX(c.getCurrentWorkoutURL + workoutTemplateId);
    const completedTime = await AJAX(c.getCompletedTime + completedWorkoutId);
    const date = new Date(Number(completedTime));
    const dateText = date.toLocaleString('default', {year: 'numeric', month: 'long', day: 'numeric'})

    const html = `
        <div class="completed-workout" data-workoutid="${completedWorkoutId}">
            <div class="date-text">${dateText}</div>
            <div class="completed-title">${workoutTemplate.workoutName}</div>
        </div>
    `;
    c.completedWorkoutsContainer.insertAdjacentHTML('beforeend', html);
}

window.addEventListener('load', e => {
    getCompletedWorkouts();
})

///////////////////////////////////////////////////////////////////////

c.elBody.addEventListener('click', function(e) {
    const el = e.target.closest('.completed-workout');
    if (el !== null) {
        const id = el.dataset.workoutid;
        window.location.href = c.completedWorkoutURL + id;
    }
})

document.querySelector('.footer__icon--back').addEventListener('click', () => {
    window.location.href = c.indexURL;
});
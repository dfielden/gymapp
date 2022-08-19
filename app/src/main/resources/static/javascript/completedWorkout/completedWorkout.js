import {AJAX} from "../helper.js";
import * as c from "../_constsAndEls.js";



const getCompletedWorkout = async function() {

    try {
        const url = window.location.href;
        const id = parseInt(url.substring(url.lastIndexOf('/') + 1));
        const workout = await AJAX(c.getCompletedWorkoutURL + id);
        await renderWorkout(workout);
    } catch (err) {
        console.error('Unable to load workout. Please try again.');
    }

}

window.addEventListener('load', async (e) => {
    await getCompletedWorkout();
    });

const renderWorkout = async (workout) => {
    const workoutTemplate = await AJAX(c.getCurrentWorkoutURL + workout.workoutId);
    document.querySelector('.heading--3').innerText = workoutTemplate.workoutName;

    renderExercises(workout.exercises);
}

const renderExercises = (exercises) => {
    exercises.sort((a, b) => a.timeCompleted - b.timeCompleted);

    for (let i = 0; i < exercises.length; i++) {
        const html = `<tr><td class="set"> ${exercises[i].exerciseName}</td><td>${exercises[i].weight} kg</td><td>${exercises[i].reps} reps</td></tr>`;
        c.formCompletedSets.insertAdjacentHTML('beforeend', html);
    }
}

document.querySelector('.footer__icon--back').addEventListener('click', () => {
    window.location.href = c.allCompletedWorkoutsURL;
});
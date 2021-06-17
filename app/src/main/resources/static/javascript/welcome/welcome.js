import * as c from '../_constsAndEls.js';
import {AJAX} from "../helper.js";
import {
    btnWorkoutInProgress,
    getCurrentWorkoutURL,
    getUserWorkoutsURL,
    getWorkoutInProgressURL
} from "../_constsAndEls.js";

let myWorkouts;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// LOAD WORKOUTS UPON PAGE LOAD ////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const workoutInProgress = {
    inProgress: false,
    id: -1,
}

const getWorkouts = async function() {
    try {
        const data = await AJAX(getUserWorkoutsURL);
        for (const key in data) {
            const id = key;
            const workout = JSON.parse(data[key]);
            displayWorkout(workout.workoutName, id);
        }
        c.myWorkoutsContainer.querySelector('.default-msg').classList.add('display-none');
        myWorkouts = document.querySelectorAll('.saved-workout');

    } catch (err) {
        console.error('Unable to load user workouts. Please try again.');
    }
}

const getWorkoutInProgress = async function() {
    try {
        const data = await AJAX(getWorkoutInProgressURL);
        if (data.workoutId) {
            workoutInProgress.inProgress = true;
            workoutInProgress.id = data.workoutId;
            c.tabInProgress.classList.remove('display-none');
        }
    } catch (err) {
        console.error('Unable to fetch workout currently in progress.');
    }
}


window.addEventListener('load', e => {
    getWorkouts();
    getWorkoutInProgress()
})

const displayWorkout = function(name, id) {
    const html = `<div class="saved-workout" data-workoutid="${id}">${name}</div>`;
    c.myWorkoutsContainer.insertAdjacentHTML('beforeend', html);
}

c.elBody.addEventListener('click', function(e) {
    unselectAllWorkouts();
    if (e.target.classList.contains('saved-workout') && !(currentWorkout.inProgress)) {
        e.target.classList.add('saved-workout--selected');
        c.footerEditWorkout.classList.remove('footer__icon--inactive');
        c.footerStart.classList.remove('footer__btn--inactive');
    }
})


const navEditSelectedWorkout = function() {
    if (!c.footerEditWorkout.classList.contains('footer__icon--inactive')) {
        const workoutId = document.querySelector('.saved-workout--selected').dataset.workoutid
        window.location = `/editworkout/${workoutId}`;
    }
}

c.footerEditWorkout.addEventListener('click', navEditSelectedWorkout);


const navStartWorkout = function() {
    if (!c.footerStart.classList.contains('footer__btn--inactive')) {
        const workoutId = document.querySelector('.saved-workout--selected').dataset.workoutid;
        window.location = `/currentworkout/${workoutId}`;
    }
}

c.footerStart.addEventListener('click', navStartWorkout);


const navCreateWorkout = function() {
    window.location = '/createworkout';
}

c.footerCreateWorkout.addEventListener('click', navCreateWorkout);


const unselectAllWorkouts = function() {
    const myWorkouts = document.querySelectorAll('.saved-workout');
    myWorkouts.forEach(el => el.classList.remove('saved-workout--selected'));
    c.footerEditWorkout.classList.add('footer__icon--inactive');
    c.footerStart.classList.add('footer__btn--inactive');
}

const navWorkoutInProgress = function() {
    window.location = `/currentworkout/${workoutInProgress.id}`
}

c.btnWorkoutInProgress.addEventListener('click', navWorkoutInProgress);
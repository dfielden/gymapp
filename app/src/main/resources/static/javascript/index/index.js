import * as c from '../_constsAndEls.js';
import * as sh from '../_showAndHide.js';
import {AJAX, removeElements, isEmptyObject, showFormMessage} from "../helper.js";
import {deleteWorkoutURL, loginURL, logoutURL} from "../_constsAndEls.js";

const LOGOUT_SUCCESS_VALUE = "LOGOUT_SUCCESS"; // must match PSFS LOGOUT_SUCCESS_RESPONSE_VALUE in GymAppApplication.java
const DELETE_SUCCESS_VALUE = "DELETE_SUCCESS"; // must match PSFS DELETE_WORKOUT_SUCCESS_RESPONSE_VALUE in GymAppApplication.java

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
        const data = await AJAX(c.getUserWorkoutsURL);
        for (const key in data) {
            const id = key;
            const workout = JSON.parse(data[key]);
            displayWorkout(workout.workoutName, id);
        }
        if(!isEmptyObject(data)) {
            c.myWorkoutsContainer.querySelector('.default-msg').classList.add('display-none');
        }
        myWorkouts = document.querySelectorAll('.saved-workout');

    } catch (err) {
        console.error('Unable to load user workouts. Please try again.');
    }
}

const getWorkoutInProgress = async function() {
    try {
        const data = await AJAX(c.getWorkoutInProgressURL);
        if (data.workoutId) {
            workoutInProgress.inProgress = true;
            workoutInProgress.id = data.workoutId;
            c.tabInProgress.classList.remove('display-none');
            c.btnWorkoutInProgress.textContent = data.workoutName;
        }
    } catch (err) {
        console.error('Unable to fetch workout currently in progress.');
    }
}

const getAndShowUserName = async function() {
    const data = await AJAX(c.userInfoURL);
    if (parseInt(data.userId) > 0) {
        c.title.textContent = `Welcome, ${data.userName}!`;
    }
}


window.addEventListener('load', e => {
    getWorkouts();
    getWorkoutInProgress();
    getAndShowUserName();
})

const displayWorkout = function(name, id) {
    const html = `<div class="saved-workout" data-workoutid="${id}">${name}</div>`;
    c.myWorkoutsContainer.insertAdjacentHTML('beforeend', html);
}

c.elBody.addEventListener('click', function(e) {
    unselectAllWorkouts();
    if (e.target.classList.contains('saved-workout')) {
        e.target.classList.add('saved-workout--selected');
        c.footerEditWorkout.classList.remove('footer__icon--inactive');
        c.footerDeleteWorkout.classList.remove('footer__icon--inactive');

        // Only activate start workout button if no workout is currently in progress
        if (!workoutInProgress.inProgress) {
            c.footerStart.classList.remove('footer__btn--inactive');
        }
    }
})


const navEditSelectedWorkout = function() {
    if (!c.footerEditWorkout.classList.contains('footer__icon--inactive')) {
        const workoutId = document.querySelector('.saved-workout--selected').dataset.workoutid;
        window.location = `/editworkout/${workoutId}`;
    }
}

c.footerEditWorkout.addEventListener('click', navEditSelectedWorkout);

c.footerDeleteWorkout.addEventListener('click', function() {
    sh.showForm(c.formDeleteWorkout, -31);

});

c.formDeleteWorkoutClose.addEventListener('click', function() {
    sh.hideForm(c.formDeleteWorkout);
})

c.btnConfirmDelete.addEventListener('click', async function() {
    const workoutId = document.querySelector('.saved-workout--selected').dataset.workoutid;
    const url = c.deleteWorkoutURL + workoutId;
    const data = await AJAX(url, 'post');

    if (data === DELETE_SUCCESS_VALUE) {
        showFormMessage("Successfully deleted workout.", true, c.formDeleteWorkout)
        removeElements(document.querySelectorAll('.saved-workout'));
        await getWorkouts();
        setTimeout(() => {
            sh.hideForm(c.formDeleteWorkout);
        }, 500);

    } else {
        showFormMessage("Problem deleting workout. Please try again.", false, c.formDeleteWorkout)
    }


})

c.btnCancelDelete.addEventListener('click', function() {
    sh.hideForm(c.formDeleteWorkout);
})


c.footerLogout.addEventListener('click', async function() {
    const data = await AJAX(logoutURL);
    if (data === LOGOUT_SUCCESS_VALUE) {
        window.location.href = c.loginURL;
    }
})


const navStartWorkout = function() {
    if (!c.footerStart.classList.contains('footer__btn--inactive')) {
        const workoutId = document.querySelector('.saved-workout--selected').dataset.workoutid;
        window.location = c.currentWorkoutURL + workoutId;
    }
}

c.footerStart.addEventListener('click', navStartWorkout);


const navCreateWorkout = function() {
    window.location = c.createWorkoutURL;
}

c.footerCreateWorkout.addEventListener('click', navCreateWorkout);


const unselectAllWorkouts = function() {
    const myWorkouts = document.querySelectorAll('.saved-workout');
    myWorkouts.forEach(el => el.classList.remove('saved-workout--selected'));
    c.footerEditWorkout.classList.add('footer__icon--inactive');
    c.footerDeleteWorkout.classList.add('footer__icon--inactive');

    c.footerStart.classList.add('footer__btn--inactive');
}

const navWorkoutInProgress = function() {
    window.location = c.currentWorkoutURL + workoutInProgress.id;
}

c.btnWorkoutInProgress.addEventListener('click', navWorkoutInProgress);
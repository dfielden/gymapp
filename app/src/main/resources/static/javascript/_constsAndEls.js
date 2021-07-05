// CONFIG
export const ajaxTimeoutMillis = 5000;
export const getExercisesURL = '/exercises';
export const createExerciseURL = '/createexercise';
export const createWorkoutURL = '/createworkout';
export const updateWorkoutURL = '/updateworkout/';
export const getUserWorkoutsURL = '/workoutnames';
export const getCurrentWorkoutURL = '/workout/';
export const getMuscleGroupsURL = '/musclegroups/';
export const getWorkoutInProgressURL = '/workoutinprogress';
export const createWorkoutInProgressURL = '/createworkoutinprogress';
export const updateWorkoutInProgressURL = '/updateworkoutinprogress';
export const finishWorkoutURL = '/finishworkout';
export const signupURL = '/signup';
export const loginURL = '/login';
export const logoutURL = '/logout';
export const userInfoURL = '/userinfo';
export const deleteWorkoutURL = '/deleteworkout/{id}'


// SIGNUP
export const btnSignup = document.querySelector('#btn-signup');
export const formSignupEmail = document.querySelector('#signup-email');
export const formSignupUsername = document.querySelector('#signup-username');
export const formSignupPw1 = document.querySelector('#signup-password1');
export const formSignupPw2 = document.querySelector('#signup-password2');

// LOGIN
export const btnLogin = document.querySelector('#btn-login');
export const formLoginEmail = document.querySelector('#login-email');
export const formLoginPw = document.querySelector('#login-password');

// COMMON
export const elContainer = document.querySelector(".container");
export const elBody = document.querySelector(".main-body");
export const elFooter = document.querySelector(".footer");
export const title = document.querySelector(".heading--1");
export const formMessage = document.querySelector('.form-msg');

// INDEX
export const myWorkoutsContainer = document.querySelector('.saved-workouts');
export const footerCreateWorkout = document.querySelector(".footer__icon--create");
export const footerEditWorkout = document.querySelector(".footer__icon--edit");
export const footerDeleteWorkout = document.querySelector(".footer__icon--delete");
export const footerLogout = document.querySelector(".footer__icon--logout");
export const footerStart = document.querySelector(".footer__btn");
export const tabInProgress = document.querySelector(".in-progress");
export const btnWorkoutInProgress = document.querySelector(".in-progress-workout");


// DEFINE WORKOUT
export const addExerciseBtn = document.querySelector('#btn-new-exercise');
export const createNewExForm = document.querySelector('#form-new-exercise');
export const createNewExFormClose = document.querySelector('#new-exercise-close');
export const createExerciseName = document.querySelector('#create-exercise-name');
export const containerMuscleGroups = document.querySelector(".muscle-group-container");
export const btnCreateExercise = document.querySelector('#btn-create-exercise');
export const btnsMoveExerciseUp = document.querySelectorAll('.fa-sort-up');
export const btnsMoveExerciseDown = document.querySelectorAll('.fa-sort-down');
export const selectExercise = document.querySelector('#select-exercise');
export const exercises = document.querySelector('.exercises');
export const btnCreateWorkout = document.querySelector('#btn-create-workout');
export const btnEditWorkout = document.querySelector('#btn-edit-workout');
export const formCreateWorkout = document.querySelector('#form-create-workout');
export const formWorkoutName = document.querySelector('#workout-name');


// CURRENT WORKOUT
export let slidingDivs = document.querySelectorAll(".slider");
export let slidingBtnContainer = document.querySelectorAll(".slide-on-btn-container");
export let allSetContainers = document.querySelectorAll(".exercise-block__set-container");
export const slideUpForms = document.querySelectorAll('.form--slide-up');
export const editSetBtns = document.querySelectorAll('.slide-on-btn--edit');
export const addSetBtns = document.querySelectorAll('.fa-plus-square');
export const weightPlusBtns = document.querySelectorAll('.weight-plus');
export const weightMinusBtns = document.querySelectorAll('.weight-minus');
export const repsPlusBtns = document.querySelectorAll('.reps-plus');
export const repsMinusBtns = document.querySelectorAll('.reps-minus');
export const selectExercises = document.querySelector("#select-exercise");
export const footerAddExercise = document.querySelector(".footer__icon--add");
export const footerUndo = document.querySelector(".footer__icon--undo");
export const footerBtnFinish = document.querySelector(".footer__btn--main");
export const formFinishWorkout = document.querySelector(".finish-workout");
export const formFinishWorkoutClose = document.querySelector(".finish-workout--close");
export const btnConfirmFinish = document.querySelector("#confirm-finish");
export const btnCancelFinish = document.querySelector("#cancel-finish");
export const formAddToCurrent = document.querySelector(".add-to-current");
export const formAddToCurrentClose = document.querySelector(".add-to-current--close");
export const formAddToCurrentName = document.querySelector("#select-exercise");

export const formAddToCurrentWeight = document.querySelector("#set-weight");
export const formAddToCurrentReps = document.querySelector("#set-reps");
export const formAddToCurrentSubmit = document.querySelector("#exercise-submit");
export const formAddToCurrentError = document.querySelector("#add-to-current-err");


export const formEditSet = document.querySelector(".edit-set");
export const formEditSetClose = document.querySelector(".edit-set--close");
export const formEditSetHeader = document.querySelector("#edit-set--title");
export const formEditSetWeight = document.querySelector("#edit-weight");
export const formEditSetReps = document.querySelector("#edit-reps");
export const formEditSetSubmit = document.querySelector("#set-submit");
export const formEditSetError = document.querySelector("#edit-set-err");


export const updateBtnContainer = function() {
    slidingBtnContainer = document.querySelectorAll(".slide-on-btn-container");
}

export const updateSlidingDivs = function() {
    slidingBtnContainer = document.querySelectorAll(".slider");
}

export const updateSetContainers = function() {
    allSetContainers = document.querySelectorAll(".exercise-block__set-container");
}
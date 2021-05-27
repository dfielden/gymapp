// CONFIG
export const ajaxTimeoutMillis = 5000;
export const getExercisesURL = '/exercises';
export const createExerciseURL = '/createexercise';
export const createWorkoutURL = '/createworkout';

// COMMON
export const elContainer = document.querySelector(".container");
export const elBody = document.querySelector(".main-body");
export const elFooter = document.querySelector(".footer");

// WELCOME
export const myWorkouts = document.querySelectorAll('.saved-workout');
export const footerCreateWorkout = document.querySelector(".footer__icon--create");
export const footerEditWorkout = document.querySelector(".footer__icon--edit");
export const footerStart = document.querySelector(".footer__btn");


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
export const selectExercises = document.querySelector("#exercises");
export const footerAddExercise = document.querySelector(".footer__icon--add");
export const footerUndo = document.querySelector(".footer__icon--undo");

export const formAddToCurrent = document.querySelector(".add-to-current");
export const formAddToCurrentClose = document.querySelector(".add-to-current--close");
export const formAddToCurrentName = document.querySelector("#exercises");

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
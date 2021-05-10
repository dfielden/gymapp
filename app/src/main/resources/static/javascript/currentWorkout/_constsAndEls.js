export const elContainer = document.querySelector(".container");
export const elBody = document.querySelector(".main-body");

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
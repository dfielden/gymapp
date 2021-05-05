export let slidingDivs = document.querySelectorAll(".slider");
export let slidingBtnContainer = document.querySelectorAll(".slide-on-btn-container");
export const footerDeleteGroupBtn = document.querySelector(".footer__icon--delete");
export const slideUpForms = document.querySelectorAll('.form--slide-up');
export const editSetBtns = document.querySelectorAll('.slide-on-btn--edit');
export const addSetBtns = document.querySelectorAll('.fa-plus-square');


export const selectExercises = document.querySelector("#exercises");
export const footerAddExercise = document.querySelector(".footer__icon--add");

export const formAddToCurrent = document.querySelector(".add-to-current");
export const formAddToCurrentClose = document.querySelector(".add-to-current--close");
export const formAddToCurrentWeight = document.querySelector("#set-weight");
export const formAddToCurrentReps = document.querySelector("#set-reps");
export const formAddToCurrentSubmit = document.querySelector("#exercise-submit");


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
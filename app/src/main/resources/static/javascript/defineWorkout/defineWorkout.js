import * as c from './_constsAndEls.js';
import {exercises, selectExercise} from "./_constsAndEls.js";


document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.btn--ghost').forEach(btn =>
        btn.addEventListener('click', () => btn.classList.toggle('btn--ghost--selected'))
    );
});


const addExercise = function() {
    if (c.selectExercise.selectedIndex !== 0) {
        const html = `
            <div class="transparent-form-group">
                <div class="transparent-form-group__title">
                    <div class="heading heading--3 heading--transparent-box">${selectExercise.value}</div>
                    <div class="far fa-plus-square far-add-set"></div>
                </div>
                <div class="two-input-container">
                    <span class="two-input-container--label">Weight:</span><input inputmode="decimal" placeholder="kg" min="0" class="form-input form-input--new-workout">
                    <span class="two-input-container--label">reps:</span><input inputmode="numeric" placeholder="reps" min="0" class="form-input form-input--new-workout">
                    <span class="far fa-trash-alt"></span>
            </div>
        `;
        exercises.insertAdjacentHTML('beforeend', html);
    }
}

const activateNewExerciseForm = function() {
    c.createNewExForm.classList.remove('display-none')
}

const resetMuscleGroupBtns = function() {
    const btns = c.containerMuscleGroups.querySelectorAll('.btn--ghost');
    console.log(btns)
    for (let i = 0; i < btns.length; i++) {
        btns[i].classList.remove('btn--ghost--selected');
    }
}

const closeNewExerciseForm = function() {
    c.createNewExForm.classList.add('display-none');
    resetMuscleGroupBtns();
    c.newExerciseName.value = "";
    c.selectExercise.selectedIndex = 0;
}

c.addExerciseBtn.addEventListener('click', addExercise);

c.selectExercise.addEventListener('change', function() {
    if (c.selectExercise.value === "NEW") {
        activateNewExerciseForm();
    }
})

c.createNewExFormClose.addEventListener('click', closeNewExerciseForm);
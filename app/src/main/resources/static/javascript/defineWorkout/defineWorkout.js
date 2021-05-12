import * as c from './_constsAndEls.js';
;


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
                    <div class="heading heading--3 heading--transparent-box">${c.selectExercise.value}
                        <span class="far fa-plus-square far-title"></span>
                    </div>
                    <div class="flex-container--col">
                        <div class="fas fa-sort-up"></div>
                        <div class="fas fa-sort-down"></div>
                    </div>
                </div>
                <div class="two-input-container">
                    <span class="two-input-container--label">Weight:</span><input inputmode="decimal" placeholder="kg" min="0" class="form-input form-input--new-workout">
                    <span class="two-input-container--label">Reps:</span><input inputmode="numeric" placeholder="reps" min="0" class="form-input form-input--new-workout">
                    <span class="far fa-trash-alt"></span>
            </div>
        `;
        c.exercises.insertAdjacentHTML('beforeend', html);
    }
}

const activateNewExerciseForm = function() {
    toggleFooterEls();
    c.createNewExForm.classList.remove('display-none')
}

const resetMuscleGroupBtns = function() {
    const btns = c.containerMuscleGroups.querySelectorAll('.btn--ghost');
    for (let i = 0; i < btns.length; i++) {
        btns[i].classList.remove('btn--ghost--selected');
    }
}

const closeCreateExerciseForm = function (index= 0) {
    c.createNewExForm.classList.add('display-none');
    resetMuscleGroupBtns();
    toggleFooterEls();
    c.createExerciseName.value = "";
    c.selectExercise.selectedIndex = index;
}

c.addExerciseBtn.addEventListener('click', addExercise);

c.selectExercise.addEventListener('change', function() {
    if (c.selectExercise.value === "NEW") {
        activateNewExerciseForm();
    }
})

c.createNewExFormClose.addEventListener('click', closeCreateExerciseForm);

c.elBody.addEventListener('click', function(e) {
    if (e.target.classList.contains('fa-plus-square')) {
        appendNewSet(e.target.closest('.transparent-form-group'));
    }
})

const appendNewSet = function(exerciseGroupEl) {
    const html = `
        <div class="two-input-container">
            <span class="two-input-container--label">Weight:</span><input inputmode="decimal" placeholder="kg" min="0" class="form-input form-input--new-workout">
            <span class="two-input-container--label">Reps:</span><input inputmode="numeric" placeholder="reps" min="0" class="form-input form-input--new-workout">
            <span class="far fa-trash-alt"></span>
        </div>
    `;
    exerciseGroupEl.insertAdjacentHTML('beforeend', html);
}


const moveElDown = function(nextEl, currentEl) {
    (swapDivs(currentEl, nextEl));
};

const moveElUp = function(currentEl, prevEl) {
    swapDivs(prevEl, currentEl);
};

const swapDivs = function(divGoingDown, divGoingUp) {
    const prev1 = divGoingDown.previousSibling;
    const prev2 = divGoingUp.previousSibling;

    prev1.after(divGoingUp);
    prev2.after(divGoingDown);
}

c.elBody.addEventListener('click', function(e) {
    if (e.target.classList.contains('fa-sort-up')) {
        const currentEl = e.target.closest('.transparent-form-group');
        const prevSiblingEl = currentEl.previousElementSibling;

        if (prevSiblingEl !== null) {
            moveElUp(currentEl, prevSiblingEl);
        }
    }
});

c.elBody.addEventListener('click', function(e) {
    if (e.target.classList.contains('fa-sort-down')) {
        const currentEl = e.target.closest('.transparent-form-group');
        const nextSiblingEl = currentEl.nextElementSibling;

        if (nextSiblingEl !== null) {
            moveElDown(currentEl, nextSiblingEl);
        }
    }
});

c.elBody.addEventListener('click', function(e) {
    if (e.target.classList.contains('fa-trash-alt')) {
        removeSet(e.target.closest('.two-input-container'));
    }
});

const removeSet = function(setContainer) {
    setContainer.remove();

    // TODO: remove enclosing transparent form group if number of sets is now 0
}

const toggleFooterEls = function() {
    c.selectExercise.classList.toggle('display-none');
    c.addExerciseBtn.classList.toggle('display-none');
    c.btnCreateExercise.classList.toggle('display-none');
}

const createNewExercise = function() {
    let exerciseName = c.createExerciseName.value;
    if (exerciseName === '') {
        return;
    }
    // TODO: Check exercise of same name does not exist

    // TODO: Create new exercise object, incorporating targeted muscles, and save it to db

    c.selectExercise.options[c.selectExercise.length] = new Option(exerciseName, exerciseName);
    c.selectExercise.value = exerciseName;
    addExercise();
    closeCreateExerciseForm(c.selectExercise.length-1);
}

c.btnCreateExercise.addEventListener('click', createNewExercise);
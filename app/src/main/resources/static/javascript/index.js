'use strict';

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.btn--ghost').forEach(btn =>
        btn.addEventListener('click', () => btn.classList.toggle('btn--ghost--selected'))
    );
})

function getAllExercises() {
    return document.querySelectorAll(`exercise-block__set__info`);
}


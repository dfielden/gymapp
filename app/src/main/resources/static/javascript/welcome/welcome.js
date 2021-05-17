import * as c from '../_constsAndEls.js';

console.log('hello');

c.myWorkouts.forEach(el => el.addEventListener('click', function(e) {
    unselectAllWorkouts();
    e.target.classList.add('saved-workout--selected');
    c.footerEditWorkout.classList.remove('footer__icon--inactive');
    c.footerStart.classList.remove('footer__btn--inactive');

}))


const navEditSelectedWorkout = function() {
    if (!c.footerEditWorkout.classList.contains('footer__icon--inactive')) {
        window.location = '/defineworkout';
    }
}

c.footerEditWorkout.addEventListener('click',navEditSelectedWorkout);


const navStartWorkout = function() {
    if (!c.footerStart.classList.contains('footer__btn--inactive')) {
        window.location = '/';
    }
}

c.footerStart.addEventListener('click',navStartWorkout);


const navCreateWorkout = function() {
    window.location = '/defineworkout';
}

c.footerCreateWorkout.addEventListener('click',navCreateWorkout);


const unselectAllWorkouts = function() {
    c.myWorkouts.forEach(el => el.classList.remove('saved-workout--selected'));
}
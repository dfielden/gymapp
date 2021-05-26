export class Exercise {
    constructor(exerciseName) {
        this.exerciseName = exerciseName;
        this.sets = [];
        this.muscleGroups = [];
    }

    addSet(set) {
        this.sets.push(set);
    }

    addMuscleGroup(muscleGroup) {
        this.muscleGroups.push(muscleGroup);
    }


}


export class Set {
    constructor(weight, reps) {
        this.weight = weight;
        this.reps = reps;
    }

    getWeight() {
        return this.weight;
    }

    getReps() {
        return this.reps;
    }

}
export class Exercise {
    constructor(exerciseName, muscleGroups = []) {
        this.exerciseName = exerciseName;
        this.muscleGroups = muscleGroups;
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

export class ExerciseGroup {
    constructor(exercise, sets = []) {
        this.exercise = exercise;
        this.sets = sets;
    }

    addSet(set) {
        this.sets.push(set);
    }
}
export class Exercise {
    constructor(name) {
        this.name = name;
        this.sets = [];
    }

    addSet(set) {
        this.sets.push(set);
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
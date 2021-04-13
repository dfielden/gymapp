package com.danfielden.gymapp;

import java.util.ArrayList;
import java.util.List;

public final class Exercise {
    private String exerciseName;
    private List<String> targetedMuscles;

    Exercise(String exerciseName) {
        this(exerciseName, new ArrayList<>());
    }

    Exercise(String exerciseName, List<String> targetedMuscles) {
        this.exerciseName = exerciseName;
        this.targetedMuscles = targetedMuscles;
    }

    public String getExerciseName() {
        return exerciseName;
    }

    public void setExerciseName(String exerciseName) {
        this.exerciseName = exerciseName;
    }

    public List<String> getTargetedMuscles() {
        return targetedMuscles;
    }

    public void setTargetedMuscles(List<String> targetedMuscles) {
        this.targetedMuscles = targetedMuscles;
    }
}

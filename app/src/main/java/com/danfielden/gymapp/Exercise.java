package com.danfielden.gymapp;

import java.util.ArrayList;
import java.util.List;

public final class Exercise implements Comparable<Exercise>{
    private String exerciseName;
    private List<MuscleGroup> muscleGroups;

    public Exercise(String exerciseName) {
        this(exerciseName, new ArrayList<>());
    }

    public Exercise(String exerciseName, List<MuscleGroup> muscleGroups) {
        this.exerciseName = exerciseName;
        this.muscleGroups = muscleGroups;
    }

    public String getExerciseName() {
        return exerciseName;
    }

    public List<MuscleGroup> getMuscleGroups() {
        return muscleGroups;
    }

    public void addTargetedMuscle(MuscleGroup muscleGroup) {
        this.muscleGroups.add(muscleGroup);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(this.getExerciseName());
        sb.append(" (");
        for (MuscleGroup mg : this.muscleGroups) {
            sb.append(mg);
            sb.append(", ");
        }
        sb.delete(sb.length() - 2, sb.length());
        sb.append(")");
        return sb.toString();
    }

    @Override
    public int compareTo(Exercise ex) {
        return this.getExerciseName().compareTo(ex.getExerciseName());
    }

    public enum MuscleGroup {
        ADDUCTORS,
        ABDUCTORS,
        ABS,
        ARMS,
        BACK,
        BICEPS,
        CALVES,
        CHEST,
        CORE,
        FOREARMS,
        GLUTES,
        HAMSTRINGS,
        LATS,
        LEGS,
        OBLIQUES,
        QUADS,
        SHOULDERS,
        TRAPS,
        TRICEPS
    }
}

package com.danfielden.gymapp;

import java.util.List;

public final class ExerciseGroup {
    private final Exercise exercise;
    private final List<Set> sets;

    public ExerciseGroup(Exercise exercise, List<Set> sets) {
        this.exercise = exercise;
        this.sets = sets;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(this.exercise.toString());
        sb.append(":\n");
        for (Set set : sets) {
            sb.append("\t");
            sb.append(set.toString());
        }
        return sb.toString();
    }
}

package com.danfielden.gymapp;

import com.google.gson.*;

import java.util.ArrayList;

public final class ExerciseGroup {
    private final Exercise exercise;
    private final ArrayList<Set> sets;
    private static final Gson gson = new Gson();

    public ExerciseGroup(Exercise exercise) {
        this(exercise, new ArrayList<>());

    }

    public ExerciseGroup(Exercise exercise, ArrayList<Set> sets) {
        this.exercise = exercise;
        this.sets = sets;
    }

    public ArrayList<Set> getSets() {
        return this.sets;
    }

    public Exercise getExercise() {
        return this.exercise;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(this.exercise.toString());
        sb.append(":\n");
        for (Set set : sets) {
            sb.append("\t");
            sb.append(set.toString());
            sb.append("\n");

        }
        return sb.toString();
    }

    public JsonObject toJson() {
        JsonObject o = new JsonObject();
        o.addProperty("exercise", exercise.toJson().toString());
        o.addProperty("sets", gson.toJson(this.getSets()));
        return o;
    }
}

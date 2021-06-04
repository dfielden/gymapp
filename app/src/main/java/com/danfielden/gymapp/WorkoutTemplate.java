package com.danfielden.gymapp;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.util.ArrayList;

public final class WorkoutTemplate {
    private String workoutName;
    private final ArrayList<ExerciseGroup> exercises;
    private static final Gson gson = new Gson();

    public WorkoutTemplate(String workoutName) {
        this(workoutName, new ArrayList<>());
    }

    public WorkoutTemplate(String workoutName, ArrayList<ExerciseGroup> exercises) {
        this.workoutName = workoutName;
        this.exercises = exercises;
    }

    public void changeName(String workoutName) {
        this.workoutName = workoutName;
    }

    public void addExerciseGroup(ExerciseGroup eg) {
        this.exercises.add(eg);
    }

    public String getWorkoutName() {
        return this.workoutName;
    }

    public ArrayList<ExerciseGroup> getExercises() {
        return this.exercises;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("******************\n");
        sb.append(this.workoutName.toUpperCase());
        sb.append("\n******************\n");
        for (ExerciseGroup eg : exercises) {
            sb.append(eg.toString());
            sb.append("\n");
        }
        return sb.toString();
    }

    public JsonObject toJson() {
        JsonObject o = new JsonObject();
        o.addProperty("workoutName", getWorkoutName());

        JsonArray jsonExerciseGroups = new JsonArray(getExercises().size());
        for (ExerciseGroup exerciseGroup : getExercises()) {
            jsonExerciseGroups.add(exerciseGroup.toJson());
        }

        o.addProperty("exercises", jsonExerciseGroups.toString());

        return o;
    }
}

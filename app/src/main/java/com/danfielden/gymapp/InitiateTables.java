package com.danfielden.gymapp;

import java.util.ArrayList;
import java.util.List;

public final class InitiateTables {

    private String createUserTable() {
        return "CREATE TABLE IF NOT EXISTS Users (" +
        "id INTEGER PRIMARY KEY NOT NULL, " +
                "email TEXT, " +
                "hashed_pq TEXT, " +
                "salt TEXT)";
    }

    private String createExerciseTable() {
        return "CREATE TABLE IF NOT EXISTS ExerciseName (" +
                "id INTEGER PRIMARY KEY NOT NULL, " +
                "exercise_name TEXT, " +
                "user_id INTEGER)";
    }

    private String createMuscleGroupTable() {
        return "CREATE TABLE IF NOT EXISTS MuscleGroup (" +
                "id INTEGER PRIMARY KEY NOT NULL, " +
                "muscle_group TEXT)";
    }

    private String createExerciseToMuscleGroupTable() {
        return "CREATE TABLE IF NOT EXISTS ExercisesToMuscleGroup (" +
                "id INTEGER PRIMARY KEY NOT NULL, " +
                "exercise_name_id INTEGER, " +
                "muscle_group_id INTEGER)";
    }

    private String createWorkoutTemplateTable() {
        return "CREATE TABLE IF NOT EXISTS WorkoutTemplate (" +
                "id INTEGER PRIMARY KEY NOT NULL, " +
                "user_id INTEGER, " +
                "workout_name TEXT)";
    }

    private String createWorkoutTemplateExerciseTable() {
        return "CREATE TABLE IF NOT EXISTS WorkoutTemplateExercise (" +
                "id INTEGER PRIMARY KEY NOT NULL, " +
                "workout_template_id INTEGER, " +
                "exercise_id INTEGER, " +
                "order_in_workout INTEGER)";
    }

    private String createWorkoutTemplateSetTable() {
        return "CREATE TABLE IF NOT EXISTS WorkoutTemplateSet (" +
                "id INTEGER PRIMARY KEY NOT NULL, " +
                "template_exercise_id INTEGER, " +
                "weight NUMERIC, " +
                "reps INTEGER, " +
                "order_in_exercise INTEGER)";
    }


    public List<String> createTables() {
        List<String> queries = new ArrayList<>();
        queries.add(createUserTable());
        queries.add(createMuscleGroupTable());
        queries.add(createExerciseToMuscleGroupTable());
        queries.add(createWorkoutTemplateTable());
        queries.add(createWorkoutTemplateExerciseTable());
        queries.add(createWorkoutTemplateSetTable());

        return queries;
    }
}

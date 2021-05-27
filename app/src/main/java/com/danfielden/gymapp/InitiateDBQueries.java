package com.danfielden.gymapp;

import java.util.ArrayList;

public final class InitiateDBQueries {

    private static String createUserTable() {
        return "CREATE TABLE IF NOT EXISTS Users (" +
                "id INTEGER PRIMARY KEY NOT NULL, " +
                "email TEXT, " +
                "hashed_pw TEXT, " +
                "salt TEXT)";
    }

    private static String createExerciseTable() {
        return "CREATE TABLE IF NOT EXISTS ExerciseName (" +
                "id INTEGER PRIMARY KEY NOT NULL, " +
                "exercise_name TEXT, " +
                "user_id INTEGER, " +
                "FOREIGN KEY (user_id) REFERENCES Users(id)" +
                ")";
    }

    private static String createMuscleGroupTable() {
        return "CREATE TABLE IF NOT EXISTS MuscleGroup (" +
                "id INTEGER PRIMARY KEY NOT NULL, " +
                "muscle_group TEXT)";
    }

    private static String createExerciseToMuscleGroupTable() {
        return "CREATE TABLE IF NOT EXISTS ExercisesToMuscleGroup (" +
                "id INTEGER PRIMARY KEY NOT NULL, " +
                "exercise_id INTEGER, " +
                "muscle_group_id  INTEGER, " +
                "FOREIGN KEY (exercise_id) REFERENCES ExerciseName(id), " +
                "FOREIGN KEY (muscle_group_id) REFERENCES MuscleGroup(id)" +
                ")";
    }

    private static String createWorkoutTemplateTable() {
        return "CREATE TABLE IF NOT EXISTS WorkoutTemplate (" +
                "id INTEGER PRIMARY KEY NOT NULL, " +
                "user_id INTEGER, " +
                "workout_name TEXT, " +
                "FOREIGN KEY (user_id) REFERENCES Users(id)" +
                ")";
    }

    private static String createWorkoutTemplateExerciseTable() {
        return "CREATE TABLE IF NOT EXISTS WorkoutTemplateExercise (" +
                "id INTEGER PRIMARY KEY NOT NULL, " +
                "workout_template_id INTEGER, " +
                "exercise_id INTEGER, " +
                "order_in_workout INTEGER, " +
                "FOREIGN KEY (workout_template_id) REFERENCES WorkoutTemplate(id), " +
                "FOREIGN KEY (exercise_id) REFERENCES ExerciseName(id)" +
                ")";
    }

    private static String createWorkoutTemplateSetTable() {
        return "CREATE TABLE IF NOT EXISTS WorkoutTemplateSet (" +
                "id INTEGER PRIMARY KEY NOT NULL, " +
                "exercise_template_id INTEGER, " +
                "weight NUMERIC, " +
                "reps INTEGER, " +
                "order_in_exercise INTEGER, " +
                "FOREIGN KEY (exercise_template_id) REFERENCES WorkoutTemplateExercise(id)" +
                ")";
    }


    public static ArrayList<String> createTableQueries() {
        ArrayList<String> queries = new ArrayList<>();
        queries.add(createUserTable());
        queries.add(createExerciseTable());
        queries.add(createMuscleGroupTable());
        queries.add(createExerciseToMuscleGroupTable());
        queries.add(createWorkoutTemplateTable());
        queries.add(createWorkoutTemplateExerciseTable());
        queries.add(createWorkoutTemplateSetTable());

        return queries;
    }
}

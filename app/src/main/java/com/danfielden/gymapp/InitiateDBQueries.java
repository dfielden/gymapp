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

    private static String createWorkoutTable() {
        return "CREATE TABLE IF NOT EXISTS WorkoutTemplate (" +
                "id INTEGER PRIMARY KEY NOT NULL, " +
                "user_id INTEGER, " +
                "workout TEXT, " +
                "FOREIGN KEY (user_id) REFERENCES Users(id) " +
                ")";
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

    private static String createWorkoutInProgressTable() {
        return  "CREATE TABLE IF NOT EXISTS WorkoutInProgress (" +
                "id INTEGER PRIMARY KEY NOT NULL, " +
                "user_id INTEGER, " +
                "current_workout TEXT, " +
                "FOREIGN KEY (user_id) REFERENCES Users(id)" +
                ")";
    }

    public static ArrayList<String> createTableQueries() {
        ArrayList<String> queries = new ArrayList<>();
        queries.add(createUserTable());
        queries.add(createExerciseTable());
        queries.add(createMuscleGroupTable());
        queries.add(createExerciseToMuscleGroupTable());
        queries.add(createWorkoutTable());
        queries.add(createWorkoutInProgressTable());

        return queries;
    }
}

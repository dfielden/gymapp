package com.danfielden.gymapp;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;

public final class GymAppDB {
    private final Connection connect;

    public GymAppDB() throws Exception {
        connect = DriverManager.getConnection("jdbc:sqlite:gymapp.db", "root", "");

        // Initiate db tables if they do not exist
        initiateTables();

        // Add muscle groups if tables not populated
        addDefaultMuscleGroups();

        // Add default exercises if tables not populated
        addDefaultExercises();
    }



    public synchronized long addExercise(String exerciseName, long userId) throws Exception {
        String query = "INSERT INTO ExerciseName (exercise_name, user_id) VALUES (?, ?)";
        try (PreparedStatement stmt = connect.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setString(1, exerciseName);
            stmt.setLong(2, userId);

            stmt.executeUpdate();

            ResultSet rs = stmt.getGeneratedKeys();
            if (!rs.next()) {
                throw new IllegalStateException("Unable to get generated key for added Exercise");
            }
            return rs.getLong(1);
        }

    }

    public synchronized long getMuscleGroupId(Exercise.MuscleGroup muscleGroup) throws Exception {
        String query = "SELECT * FROM MuscleGroup WHERE muscle_group = ?";
        try (PreparedStatement stmt = connect.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setString(1, muscleGroup.toString());
            ResultSet rs = stmt.getGeneratedKeys();
            if (!rs.next()) {
                throw new IllegalStateException("Unable to get muscle group id for " + muscleGroup.toString());
            }
            return rs.getLong(1);
        }
    }



    public synchronized HashMap<Long, Exercise> getAllExercises(int userId) throws Exception {
        HashMap<Long, Exercise> exercises = new HashMap<>();
        String query = "SELECT * FROM ExerciseName";

        try (PreparedStatement stmt = connect.prepareStatement(query)) {
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                long id = rs.getLong("id");
                String exerciseName = rs.getString("exercise_name");

              Exercise exercise = new Exercise(exerciseName);
                exercises.put(id, exercise);
            }
        }
        return exercises;
    }

    private synchronized void initiateTables() throws Exception {
        ArrayList<String> queries = InitiateDBQueries.createTableQueries();
        for (String q : queries) {
            connect.createStatement().execute(q);
        }
    }

    private synchronized void addDefaultMuscleGroups() throws Exception {
        String query = "SELECT * FROM MuscleGroup";

        try (PreparedStatement stmt = connect.prepareStatement(query)) {
            ResultSet rs = stmt.executeQuery();
            if (!rs.next()) {
                for (Exercise.MuscleGroup muscleGroup : Exercise.MuscleGroup.values()) {
                    String name = muscleGroup.toString();
                    query = "INSERT INTO MuscleGroup (muscle_group) VALUES ('" +name + "')";
                    connect.createStatement().execute(query);
                }
            }
        }
    }

    private synchronized void addDefaultExercises() throws Exception {
        String query = "SELECT * FROM ExerciseName";

        try (PreparedStatement stmt = connect.prepareStatement(query)) {
            ResultSet rs = stmt.executeQuery();

            if (!rs.next()) {
                DefaultExercisesReader dfr = new DefaultExercisesReader("./app/src/main/resources/static/base_exercises.txt");
                dfr.readExercises();
                for (Exercise ex : dfr.getExercises()) {
                    //System.out.println(ex);
                    long exerciseId = addExercise(ex.getExerciseName(), 0);

                    // Add muscle group to ExercisesToMuscleGroup table
                    for (Exercise.MuscleGroup muscleGroup : ex.getMuscleGroups()) {
                        long muscleGroupId = getMuscleGroupId(muscleGroup);
                        linkExerciseToMuscleGroup(exerciseId, muscleGroupId);
                    }
                }
            }
        }
    }

    private synchronized void linkExerciseToMuscleGroup(long exerciseId, long muscleGroupId) throws Exception {
        String query = "INSERT INTO ExercisesToMuscleGroup (exercise_id, muscle_group_id) VALUES (?, ?)";

        try (PreparedStatement stmt = connect.prepareStatement(query)) {
            stmt.setLong(1, exerciseId);
            stmt.setLong(2, muscleGroupId);
            stmt.executeUpdate();
        }
    }
}

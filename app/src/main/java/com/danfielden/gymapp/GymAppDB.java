package com.danfielden.gymapp;

import java.io.File;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public final class GymAppDB {
    private final Connection connect;

    public GymAppDB() throws Exception {
        connect = DriverManager.getConnection("jdbc:sqlite:gymapp.db", "root", "");

        // Initiate db tables if they do not exist
        ArrayList<String> queries = InitiateDBQueries.createTableQueries();
        for (String query : queries) {
            connect.createStatement().execute(query);
        }

        // Add default user if tables not populated
//        String query = "SELECT COUNT(*) FROM users";
//        int userCount = connect.createStatement().executeUpdate(query);
//        if (userCount == 0) {
//            query = "INSERT INTO users (email, hashed_pw, salt) VALUES ('base', 'n/a', 'n/a')";
//            connect.createStatement().execute(query);
//
//        }

        // Add default exercises if tables not populated
        String query = "SELECT * FROM ExerciseName";

        try (PreparedStatement stmt = connect.prepareStatement(query)) {
            ResultSet rs = stmt.executeQuery();

            if (!rs.next()) {
                DefaultExercisesReader dfr = new DefaultExercisesReader("./app/src/main/resources/static/base_exercises.txt");
                dfr.readExercises();
                for (Exercise ex : dfr.getExercises()) {
                    query = "INSERT INTO ExerciseName (exercise_name, user_id) VALUES ('" + ex.getExerciseName() + "', " + 0 + ")";
                    connect.createStatement().execute(query);
                }
            }
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
}

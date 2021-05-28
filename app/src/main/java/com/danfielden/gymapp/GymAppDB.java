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
        try (PreparedStatement stmt = connect.prepareStatement(query)) {
            stmt.setString(1, muscleGroup.toString());
            ResultSet rs = stmt.executeQuery();
            if (!rs.next()) {
                throw new IllegalStateException("Unable to get muscle group id for " + muscleGroup);
            }
            return rs.getLong("id");
        }
    }



    public synchronized HashMap<Long, Exercise> getAllExercises(long userId) throws Exception {
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

    public synchronized long getExerciseIdFromName(String exerciseName, long userId) throws Exception {
        String query = "SELECT id FROM ExerciseName WHERE exercise_name = ? AND user_id = 0 OR user_id = ?";
        try (PreparedStatement stmt = connect.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setString(1, exerciseName);
            stmt.setLong(2, userId);

            ResultSet rs = stmt.executeQuery();

            if (!rs.next()) {
                throw new IllegalStateException("Unable to identify exercise id for " + exerciseName);
            }
            return rs.getLong(1);

        }
    }

    public synchronized String getExerciseNameFromId(long exerciseNameId) throws Exception {
        String query = "SELECT exercise_name FROM ExerciseName WHERE id = ?";
        try (PreparedStatement stmt = connect.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setLong(1, exerciseNameId);

            ResultSet rs = stmt.executeQuery();

            if (!rs.next()) {
                throw new IllegalStateException("Unable to identify exercise name for id " + exerciseNameId);
            }
            return rs.getString(1);

        }
    }

    public synchronized long addWorkoutTemplate(String workoutName, long userId) throws Exception {
        String query = "INSERT INTO WorkoutTemplate (workout_name, user_id) VALUES (?, ?)";
        try (PreparedStatement stmt = connect.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setString(1, workoutName);
            stmt.setLong(2, userId);

            stmt.executeUpdate();

            ResultSet rs = stmt.getGeneratedKeys();
            if (!rs.next()) {
                throw new IllegalStateException("Unable to get generated key for added Workout");
            }
            return rs.getLong(1);
        }
    }

    public synchronized long addExerciseTemplate(long workoutId, long exerciseId, long orderInWorkout) throws Exception {
        String query = "INSERT INTO WorkoutTemplateExercise (workout_template_id, exercise_id, order_in_workout) VALUES (?, ?, ?)";
        try (PreparedStatement stmt = connect.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setLong(1, workoutId);
            stmt.setLong(2, exerciseId);
            stmt.setLong(3, orderInWorkout);

            stmt.executeUpdate();

            ResultSet rs = stmt.getGeneratedKeys();
            if (!rs.next()) {
                throw new IllegalStateException("Unable to get generated key for added Exercise");
            }
            return rs.getLong(1);
        }
    }

    public synchronized long addSetTemplate(long exerciseTemplateId, Set set, long orderInGroup) throws Exception {
        String query = "INSERT INTO WorkoutTemplateSet (exercise_template_id, weight, reps, order_in_exercise) VALUES (?, ?, ?, ?)";
        try (PreparedStatement stmt = connect.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setLong(1, exerciseTemplateId);
            stmt.setDouble(2, set.getWeight());
            stmt.setLong(3, set.getReps());
            stmt.setLong(4, orderInGroup);

            stmt.executeUpdate();

            ResultSet rs = stmt.getGeneratedKeys();
            if (!rs.next()) {
                throw new IllegalStateException("Unable to get generated key for added Set");
            }
            return rs.getLong(1);
        }
    }

    public synchronized void linkExerciseToMuscleGroup(long exerciseId, long muscleGroupId) throws Exception {
        String query = "INSERT INTO ExercisesToMuscleGroup (exercise_id, muscle_group_id) VALUES (?, ?)";

        try (PreparedStatement stmt = connect.prepareStatement(query)) {
            stmt.setLong(1, exerciseId);
            stmt.setLong(2, muscleGroupId);
            stmt.executeUpdate();
        }
    }

    public synchronized HashMap<Long, String> getUserWorkouts(long userId) throws Exception {
        String query = "SELECT * FROM WorkoutTemplate WHERE user_id = ?";
        HashMap<Long, String> workouts = new HashMap<>();
        try (PreparedStatement stmt = connect.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setLong(1, userId);

            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                long id = rs.getLong("id");
                String workoutName = rs.getString("workout_name");
                workouts.put(id, workoutName);
            }
            return workouts;
        }
    }

    public synchronized String getWorkoutNameFromId(long workoutId, long userId) throws Exception{
        String query = "SELECT workout_name FROM WorkoutTemplate WHERE id = ? AND user_id = ?";
        try (PreparedStatement stmt = connect.prepareStatement(query)) {
            stmt.setLong(1, workoutId);
            stmt.setLong(2, userId);

            ResultSet rs = stmt.executeQuery();

            if (!rs.next()) {
                throw new IllegalStateException("Unable to identify workout name");
            }
            return rs.getString(1);
        }
    }

    public ArrayList<ExerciseGroup> getExercisesFromWorkoutId(long workoutId) throws Exception {
        String query = "SELECT * FROM WorkoutTemplateExercise WHERE workout_template_id = ? ORDER BY order_in_workout";
        ArrayList<ExerciseGroup> exercises = new ArrayList<>();
        try (PreparedStatement stmt = connect.prepareStatement(query)) {
            stmt.setLong(1, workoutId);

            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                long exerciseTemplateId = rs.getLong("id");
                long exerciseNameId = rs.getLong("exercise_id");
                String exerciseName = getExerciseNameFromId(exerciseNameId);
                ArrayList<Set> sets = getSetsFromExerciseId(exerciseTemplateId);
                ExerciseGroup eg = new ExerciseGroup(new Exercise(exerciseName), sets);

               exercises.add(eg);
            }
            return exercises;
        }
    }

    private ArrayList<Set> getSetsFromExerciseId(long exerciseId) throws Exception {
        String query = "SELECT * FROM WorkoutTemplateSet WHERE exercise_template_id = ? ORDER BY order_in_exercise";
        ArrayList<Set> sets = new ArrayList<>();
        try (PreparedStatement stmt = connect.prepareStatement(query)) {
            stmt.setLong(1, exerciseId);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                double weight = rs.getDouble("weight");
                long reps = rs.getLong("reps");
                sets.add(new Set(weight, (int)reps));
            }
            return sets;
        }
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


}

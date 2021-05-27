package com.danfielden.gymapp;

import com.google.gson.*;
import java.util.ArrayList;
import java.util.List;

public final class Exercise implements Comparable<Exercise>{
    private final String exerciseName;
    private final List<MuscleGroup> muscleGroups;
    private static final Gson gson = new Gson();

    public Exercise(String exerciseName) {
        this(exerciseName, new ArrayList<>());
    }

    public Exercise(String exerciseName, List<MuscleGroup> muscleGroups) {
        this.exerciseName = exerciseName;
        this.muscleGroups = muscleGroups;
    }

    public String getExerciseName() {
        return this.exerciseName;
    }

    public List<MuscleGroup> getMuscleGroups() {
        return this.muscleGroups;
    }

    public void addTargetedMuscle(MuscleGroup muscleGroup) {
        this.muscleGroups.add(muscleGroup);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(this.getExerciseName());
        if (!this.muscleGroups.isEmpty()) {
            sb.append(" (");
            for (MuscleGroup mg : this.muscleGroups) {
                sb.append(mg);
                sb.append(", ");
            }
            sb.delete(sb.length() - 2, sb.length());
            sb.append(")");
        }

        return sb.toString();
    }

    @Override
    public int compareTo(Exercise ex) {
        return this.getExerciseName().compareTo(ex.getExerciseName());
    }

    public JsonObject toJson() {
        JsonObject o = new JsonObject();
        o.addProperty("exerciseName", getExerciseName());
        o.addProperty("muscleGroups", gson.toJson(getMuscleGroups()));

        return o;
    }

    public enum MuscleGroup {
        ABDUCTORS("Abductors"),
        ABS("Abs"),
        ADDUCTORS("Adductors"),
        ARMS("Arms"),
        BACK("Back"),
        BICEPS("Biceps"),
        CALVES("Calves"),
        CHEST("Chest"),
        CORE("Core"),
        FOREARMS("Forearms"),
        GLUTES("Glutes"),
        HAMSTRINGS("Hamstrings"),
        LATS("Lats"),
        LEGS("Legs"),
        OBLIQUES("Obliques"),
        QUADS("Quads"),
        SHOULDERS("Shoulders"),
        TRAPS("Traps"),
        TRICEPS("Triceps");

        private String name;

        private MuscleGroup(String name) {
            this.name = name;
        }

        @Override
        public String toString() {
            return this.name;
        }
    }
}

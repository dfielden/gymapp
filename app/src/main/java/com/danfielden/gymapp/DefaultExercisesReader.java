package com.danfielden.gymapp;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class DefaultExercisesReader {
    private final String fileName;
    private List<Exercise> exercises;

    public DefaultExercisesReader(String fileName) {
        this.fileName = fileName;
        this.exercises = new ArrayList<>();
    }

    public List<Exercise> getExercises() {
        return this.exercises;
    }

    public void readExercises() {
        try (BufferedReader reader = new BufferedReader(new FileReader(fileName))) {
            String line = reader.readLine();

            while (line != null) {
                String[] components = line.split(",");
                Exercise ex = new Exercise(components[0].trim());

                for (int i = 1; i < components.length; i++) {
                    ex.addTargetedMuscle(Exercise.MuscleGroup.valueOf(components[i].trim()));
                }

                exercises.add(ex);
                System.out.println(line);
                line = reader.readLine();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}

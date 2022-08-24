package com.danfielden.gymapp;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class DefaultExercisesReader {
    private final String fileName;
    private final List<Exercise> exercises;

    public DefaultExercisesReader(String fileName) {
        this.fileName = fileName;
        this.exercises = new ArrayList<>();
    }

    public List<Exercise> getExercises() {
        return this.exercises;
    }

    public void readExercises() {
        InputStream ioStream = this.getClass()
                .getClassLoader()
                .getResourceAsStream(fileName);

        if (ioStream == null) {
            throw new IllegalArgumentException(fileName + " is not found");
        }

        try (InputStreamReader isr = new InputStreamReader(ioStream);
            BufferedReader reader = new BufferedReader(isr)) {
            String line = reader.readLine();

            while (line != null) {
                String[] components = line.split(",");
                Exercise ex = new Exercise(components[0].trim());

                for (int i = 1; i < components.length; i++) {
                    ex.addTargetedMuscle(Exercise.MuscleGroup.valueOf(components[i].trim()));
                }
                exercises.add(ex);
                line = reader.readLine();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}

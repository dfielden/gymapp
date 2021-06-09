package com.danfielden.gymapp;

import com.google.gson.*;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;



@SpringBootApplication
@Controller
public class GymAppApplication {
    private final GymAppDB db;
    private static final Gson gson = new Gson();

    public GymAppApplication() throws Exception {
        db = new GymAppDB();
    }

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(GymAppApplication.class);
        app.run(args);
    }

    @GetMapping("/")
    public String home() throws Exception {
        return "index";
    }

    @GetMapping("/welcome")
    public String welcome() throws Exception {
        return "welcome";
    }

    @GetMapping("/createworkout")
    public String defineWorkout() throws Exception {
        return "create-workout";
    }

    @GetMapping("/editworkout/{id}")
    public String editWorkout(@PathVariable(value="id") long id) throws Exception {
        // TODO: link to user id
        return "edit-workout";
    }

    @GetMapping("/login")
    public String login() throws Exception {
        return "login";
    }

    @GetMapping("/signup")
    public String signup() throws Exception {
        return "signup";
    }

    @ResponseBody
    @GetMapping("/exercises")
    public String getSavedExercises(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        HashMap<Long, Exercise> exercises = db.getAllExercises(0);
        return gson.toJson(exercises);
    }

    @ResponseBody
    @GetMapping("/workoutnames")
    public String getUserWorkouts(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        // TODO: link to user id
        HashMap<Long, String> workouts = db.getUserWorkouts(1);
        return gson.toJson(workouts);
    }

    @ResponseBody
    @PostMapping(value="/createexercise",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public String createExercise(@RequestBody Exercise exercise, HttpServletRequest req, HttpServletResponse resp) throws Exception {
        // add exercise
        // TODO: link to user id
        long exerciseId = db.addExercise(exercise.getExerciseName(), 1);

        // add exercise muscle groups
        for (Exercise.MuscleGroup mg : exercise.getMuscleGroups()) {
            long muscleGroupId = db.getMuscleGroupId(mg);
            db.linkExerciseToMuscleGroup(exerciseId, muscleGroupId);
        }
        return exercise.toJson().toString();
    }

    @ResponseBody
    @PostMapping(value="/createworkout",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public String createWorkout(@RequestBody String workout, HttpServletRequest req, HttpServletResponse resp) throws Exception {
        // TODO: link to user id
        db.addWorkoutTemplate(1, workout);
        return workout;
    }

    @GetMapping("/currentworkout/{id}")
    public String currentWorkout() throws Exception {
        return "current-workout";
    }

    @ResponseBody
    @GetMapping("/workoutinprogress")
    public String workoutInProgress() throws Exception {
        // TODO: link to user id
        return db.getWorkoutInProgress(1);
    }

    @ResponseBody
    @PostMapping(value="/createworkoutinprogress",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public String createWorkoutInProgress(@RequestBody String workout, HttpServletRequest req, HttpServletResponse resp) throws Exception {
        // TODO: link to user id
        db.addWorkoutInProgress(1, workout);
        return workout;
    }

    @ResponseBody
    @PostMapping(value="/updateworkoutinprogress",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public String updateWorkoutInProgress(@RequestBody String workout, HttpServletRequest req, HttpServletResponse resp) throws Exception {
        // TODO: link to user id
        db.updateWorkoutInProgress(1, workout);
        return workout;
    }

    @ResponseBody
    @GetMapping("/workout/{id}")
    public String loadWorkout(@PathVariable(value="id") long id) throws Exception {
        // TODO: link to user id
        return db.getWorkoutFromId(id, 1);
    }


}

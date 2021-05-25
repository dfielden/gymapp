package com.danfielden.gymapp;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.Collections;
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

    @GetMapping("/defineworkout")
    public String defineWorkout() throws Exception {
        return "define-workout";
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
        for (Exercise e : exercises.values()) {
            System.out.println(e);
        }
        return gson.toJson(exercises);
    }

}

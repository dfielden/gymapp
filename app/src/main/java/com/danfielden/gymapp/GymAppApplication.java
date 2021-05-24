package com.danfielden.gymapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@SpringBootApplication
@Controller
public class GymAppApplication {

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(GymAppApplication.class);
        app.run(args);
        System.out.println(System.getProperty("user.dir"));
        DefaultExercisesReader dfr = new DefaultExercisesReader("./app/src/main/resources/static/base_exercises.txt");
        dfr.readExercises();
        for (Exercise ex : dfr.getExercises()) {
            System.out.println(ex);
        }
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

}

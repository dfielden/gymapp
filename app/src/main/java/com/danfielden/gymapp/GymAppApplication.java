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

        //SpringApplication.run(GymAppApplication.class, args);
    }

    @GetMapping("/")
    public String home() throws Exception {
        return "index";
    }

}

package com.danfielden.gymapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.HashSet;
import java.util.Set;


@SpringBootApplication
@Controller
public class GymAppApplication {

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(GymAppApplication.class);
        app.run(args);
    }

    @GetMapping("/")
    public String home() throws Exception {
        return "index";
    }

}

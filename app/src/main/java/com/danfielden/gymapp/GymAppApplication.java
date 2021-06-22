package com.danfielden.gymapp;

import com.danfielden.gymapp.auth.Login;
import com.danfielden.gymapp.auth.PasswordSecurity;
import com.google.gson.*;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;


@SpringBootApplication
@Controller
public class GymAppApplication {
    private final GymAppDB db;
    private static final Gson gson = new Gson();
    private final Map<String, Long> sessions = new ConcurrentHashMap<>(); // cookieValue, user_id
    private static final String GYMAPP_COOKIE_NAME = "GYMAPPCOOKIE";
    private static final Random rand = new Random();


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

    @ResponseBody
    @GetMapping("/finishworkout")
    public boolean finishWorkout() throws Exception {
        // TODO: link to user id
        db.deleteWorkoutInProgress(1);
        return true;
    }

    @ResponseBody
    @PostMapping(value="/signup",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public String signup(@RequestBody Login login, HttpServletRequest req, HttpServletResponse resp) throws Exception {
        try {
            String email = login.getEmail();
            String typedPassword = login.getPassword();
            String[] hashedPassword = PasswordSecurity.createHashedPassword(typedPassword);

            db.signup(email, hashedPassword[0], hashedPassword[1]);
        } catch (IllegalStateException e) {
            return gson.toJson(e.getMessage());
        }
        return gson.toJson("hi there");
    }


    @Nonnull
    private synchronized long getOrCreateSession(HttpServletRequest req, HttpServletResponse resp) {
        // First, get the Cookie from the request.
        Cookie cookie = findOrSetSessionCookie(req, resp);

        // Use the cookie value as the session ID.
        String sessionId = cookie.getValue();

        // Then, look up the corresponding session for this Cookie ID.
        long userId = sessions.get(sessionId);

        if (userId == 0L) {
            // Create a new session (findOrSetSessionCookie probably just created the Cookie, so there is not yet a
            // corresponding session).
            // Todo: link to user id
            long id = 1;
            sessions.put(sessionId, id);
        }

        return userId;
    }

    @PostMapping(value="/loginsubmit",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    Long returnUser(@RequestBody Login login, HttpServletRequest req, HttpServletResponse resp) throws Exception {
        try {
            String email = login.getEmail();
            String enteredPassword = login.getPassword();
            HashMap userDetails = db.getuserDetails(email);
            String salt = (String)userDetails.get("salt");
            String hashedPassword = (String)userDetails.get("hashedPassword");

            if (hashedPassword.equals(PasswordSecurity.hashString(enteredPassword + salt))) {
                // User credentials OK.
                // TODO: link to user id
                return 1L;
            } else {
                // User credentials BAD.
                throw new Exception("Incorrect password. Please try again.");
            }
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
        return -1L;
    }

    @Nonnull
    private static Cookie findOrSetSessionCookie(HttpServletRequest req, HttpServletResponse resp) {
        Cookie[] cookies = req.getCookies();
        if (cookies != null) {
            for (Cookie c : cookies) {
                if (GYMAPP_COOKIE_NAME.equals(c.getName())) {
                    // Found our cookie.
                    return c;
                }
            }
        }

        // No cookie. Set a new one.
        Cookie cookie = new Cookie(GYMAPP_COOKIE_NAME, String.format("%x%xgym", rand.nextLong(), rand.nextLong()));
        resp.addCookie(cookie);
        return cookie;
    }

}

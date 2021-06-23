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
    private final Map<String, GymAppState> sessions = new ConcurrentHashMap<>(); // cookieValue, GymAppState
    private static final String GYMAPP_COOKIE_NAME = "GYMAPPCOOKIE";
    private static final Random rand = new Random();

    public static final String LOGIN_SUCCESS_RESPONSE_VALUE = "LOGIN_SUCCESS";
    public static final String SIGNUP_SUCCESS_RESPONSE_VALUE = "SIGNUP_SUCCESS";
    public static final String PW_CHANGE_SUCCESS_RESPONSE_VALUE = "PW_SUCCESS";


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
    public String welcome(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        GymAppState state = getOrCreateSession(req, resp);
        if (state.isLoggedIn()) {
            return "welcome";
        }
        return "login";
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
            String username = login.getUsername();
            String typedPassword = login.getPassword();
            String[] hashedPassword = PasswordSecurity.createHashedPassword(typedPassword);

            db.signup(email, username, hashedPassword[0], hashedPassword[1]);
        } catch (IllegalStateException e) {
            return gson.toJson(e.getMessage());
        }
        return gson.toJson(SIGNUP_SUCCESS_RESPONSE_VALUE);
    }

    @ResponseBody
    @PostMapping(value="/login",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public String login(@RequestBody Login login, HttpServletRequest req, HttpServletResponse resp) throws Exception {
        try {
            String email = login.getEmail();
            String enteredPassword = login.getPassword();

            HashMap<String, String> userDetails = db.getuserDetailsFromEmail(email);
            String salt = userDetails.get("salt");
            String hashedPassword = userDetails.get("hashedPassword");

            if (hashedPassword.equals(PasswordSecurity.hashString(enteredPassword + salt))) {
                // User credentials OK.

                GymAppState state = getOrCreateSession(req, resp);
                state.setUserName(userDetails.get("userName"));
                state.setUserId(Long.parseLong(userDetails.get("userId")));
                return gson.toJson(LOGIN_SUCCESS_RESPONSE_VALUE);
            } else {
                // User credentials BAD.
                throw new Exception("Incorrect password. Please try again.");
            }
        } catch (IllegalStateException e) {
            return gson.toJson(e.getMessage());
        }
    }

    @ResponseBody
    @GetMapping("/userinfo")
    public String getUserNameAndId(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        GymAppState state = getOrCreateSession(req, resp);
        String userName = state.getUserName();
        long userId = state.getUserId();

        HashMap<String, String> userDetails = new HashMap<>();
        userDetails.put("userName", userName);
        userDetails.put("userId", String.valueOf(userId));
        return gson.toJson(userDetails);
    }


    @Nonnull
    private synchronized GymAppState getOrCreateSession(HttpServletRequest req, HttpServletResponse resp) {
        // First, get the Cookie from the request.
        Cookie cookie = findOrSetSessionCookie(req, resp);

        // Use the cookie value as the session ID.
        String sessionId = cookie.getValue();

        // Then, look up the corresponding session for this Cookie ID.
        GymAppState state = sessions.get(sessionId);

        if (state == null) {
            // Create a new session (findOrSetSessionCookie probably just created the Cookie, so there is not yet a
            // corresponding session).
            state = new GymAppState();
            sessions.put(sessionId, state);
        }

        return state;
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

    private static final class GymAppState {
        private long userId = -1;
        @Nullable  // If logged out, this is null.
        private String userName;

        boolean isLoggedIn() {
            return this.userId > 0;
        }

        @Nullable
        public String getUserName() {
            return this.userName;
        }

        public void setUserName(String userName) {
            this.userName = userName;
        }

        public long getUserId() {
            return this.userId;
        }

        public void setUserId(long userId) {
            this.userId = userId;
        }

        @Override
        public String toString() {
            return "id: " + this.getUserId() + ", user name: " + this.getUserName();
        }

    }

}

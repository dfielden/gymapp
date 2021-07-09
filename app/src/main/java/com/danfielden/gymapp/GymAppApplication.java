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
import javax.servlet.http.HttpSession;
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
    public static final String LOGOUT_SUCCESS_RESPONSE_VALUE = "LOGOUT_SUCCESS";

    public static final String CREATE_WORKOUT_SUCCESS_RESPONSE_VALUE = "CREATE_SUCCESS";
    public static final String UPDATE_WORKOUT_SUCCESS_RESPONSE_VALUE = "UPDATE_SUCCESS";
    public static final String FINISH_WORKOUT_SUCCESS_RESPONSE_VALUE = "FINISH_SUCCESS";
    public static final String DELETE_WORKOUT_SUCCESS_RESPONSE_VALUE = "DELETE_SUCCESS";
    public static final String QUIT_WORKOUT_SUCCESS_RESPONSE_VALUE = "QUIT_SUCCESS";

    public GymAppApplication() throws Exception {
        db = new GymAppDB();
    }

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(GymAppApplication.class);
        app.run(args);
    }

    @GetMapping("/")
    public String home(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        resp.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        GymAppState state = getOrCreateSession(req, resp);
        if (!state.isLoggedIn()) {
            return "redirect:/login";
        }
        return "index";
    }

    @GetMapping("/createworkout")
    public String defineWorkout(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        resp.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        GymAppState state = getOrCreateSession(req, resp);
        if (state.isLoggedIn()) {
            return "create-workout";
        }
        return "login";
    }

    @GetMapping("/editworkout/{id}")
    public String editWorkout(@PathVariable(value="id") long id, HttpServletRequest req, HttpServletResponse resp) throws Exception {
        resp.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        GymAppState state = getOrCreateSession(req, resp);
        if (!state.isLoggedIn()) {
            return "redirect:/";
        }
        // TODO: link to user id
        long userId = getUserId(req, resp);
        HashMap<Long, String> workouts = db.getUserWorkouts(userId);
        if (workouts.containsKey(id)) {
            return "edit-workout";
        }
        return "redirect:/";
    }

    @GetMapping("/login")
    public String login(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        resp.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        GymAppState state = getOrCreateSession(req, resp);
        if (state.isLoggedIn()) {
            return "redirect:/";
        }
        return "login";
    }

    @GetMapping("/signup")
    public String signup(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        resp.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        GymAppState state = getOrCreateSession(req, resp);
        if (state.isLoggedIn()) {
            return "redirect:/";
        }
        return "signup";
    }

    @ResponseBody
    @GetMapping("/exercises")
    public String getSavedExercises(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        GymAppState state = getOrCreateSession(req, resp);
        if (!state.isLoggedIn()) {
            return "Please login to view data";
        }
        long userId = getUserId(req, resp);
        HashMap<Long, Exercise> exercises = db.getAllExercises(userId);
        return gson.toJson(exercises);
    }

    @ResponseBody
    @GetMapping("/workoutnames")
    public String getUserWorkouts(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        GymAppState state = getOrCreateSession(req, resp);
        if (!state.isLoggedIn()) {
            return "Please login to view data";
        }
        // TODO: link to user id
        long userId = getUserId(req, resp);
        HashMap<Long, String> workouts = db.getUserWorkouts(userId);
        return gson.toJson(workouts);
    }

    @ResponseBody
    @PostMapping(value="/createexercise",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public String createExercise(@RequestBody Exercise exercise, HttpServletRequest req, HttpServletResponse resp) throws Exception {
        // add exercise
        // TODO: link to user id
        long userId = getUserId(req, resp);
        long exerciseId = db.addExercise(exercise.getExerciseName(), userId);

        // add exercise muscle groups
        for (Exercise.MuscleGroup mg : exercise.getMuscleGroups()) {
            long muscleGroupId = db.getMuscleGroupId(mg);
            db.linkExerciseToMuscleGroup(exerciseId, muscleGroupId);
        }
        return gson.toJson(exerciseId);
    }

    @ResponseBody
    @PostMapping(value="/createworkout",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public String createWorkout(@RequestBody String workout, HttpServletRequest req, HttpServletResponse resp) throws Exception {
        // TODO: link to user id
        long userId = getUserId(req, resp);
        db.addWorkoutTemplate(userId, workout);
        return gson.toJson(CREATE_WORKOUT_SUCCESS_RESPONSE_VALUE);
    }

    @GetMapping("/currentworkout/{id}")
    public String currentWorkout(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        resp.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        GymAppState state = getOrCreateSession(req, resp);
        if (!state.isLoggedIn()) {
            return "redirect:/login";
        }
        return "current-workout";
    }

    @ResponseBody
    @PostMapping(value="/deleteworkout/{id}",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public String createWorkout(@PathVariable(value="id") long id, HttpServletRequest req, HttpServletResponse resp) throws Exception {
        // TODO: link to user id
        long userId = getUserId(req, resp);
        db.deleteWorkoutTemplate(id, userId);
        return gson.toJson(DELETE_WORKOUT_SUCCESS_RESPONSE_VALUE);
    }

    @ResponseBody
    @PostMapping(value="/updateworkout/{id}",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public String updateWorkout(@RequestBody String workout, @PathVariable(value="id") long id, HttpServletRequest req, HttpServletResponse resp) throws Exception {
        // TODO: link to user id
        long userId = getUserId(req, resp);
        db.updateWorkoutTemplate(workout, id, userId);
        return gson.toJson(UPDATE_WORKOUT_SUCCESS_RESPONSE_VALUE);
    }

    @ResponseBody
    @GetMapping("/workoutinprogress")
    public String workoutInProgress(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        GymAppState state = getOrCreateSession(req, resp);
        if (!state.isLoggedIn()) {
            return "Please login to view data";
        }
        // TODO: link to user id
        long userId = getUserId(req, resp);
        return db.getWorkoutInProgress(userId);
    }

    @ResponseBody
    @PostMapping(value="/createworkoutinprogress",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public String createWorkoutInProgress(@RequestBody String workout, HttpServletRequest req, HttpServletResponse resp) throws Exception {
        // TODO: link to user id
        long userId = getUserId(req, resp);
        db.addWorkoutInProgress(userId, workout);
        return workout;
    }

    @ResponseBody
    @PostMapping(value="/updateworkoutinprogress",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public String updateWorkoutInProgress(@RequestBody String workout, HttpServletRequest req, HttpServletResponse resp) throws Exception {
        // TODO: link to user id
        long userId = getUserId(req, resp);
        db.updateWorkoutInProgress(userId, workout);
        return workout;
    }

    @ResponseBody
    @GetMapping("/workout/{id}")
    public String loadWorkout(@PathVariable(value="id") long id, HttpServletRequest req, HttpServletResponse resp) throws Exception {
        GymAppState state = getOrCreateSession(req, resp);
        if (!state.isLoggedIn()) {
            return "Please login to view data";
        }
        // TODO: link to user id
        long userId = getUserId(req, resp);
        return db.getWorkoutFromId(id, userId);
    }

    @ResponseBody
    @PostMapping("/finishworkout")
    public String finishWorkout(@RequestBody String workout, HttpServletRequest req, HttpServletResponse resp) throws Exception {
        // TODO: link to user id
        long userId = getUserId(req, resp);

        try {
            db.addCompletedWorkout(userId, System.currentTimeMillis(), workout);
            db.deleteWorkoutInProgress(userId);
        } catch (Exception e) {
            return gson.toJson(e.getMessage());
        }
        return gson.toJson(FINISH_WORKOUT_SUCCESS_RESPONSE_VALUE);
    }

    @ResponseBody
    @PostMapping("/quitworkout")
    public String quitWorkout(@RequestBody String workout, HttpServletRequest req, HttpServletResponse resp) throws Exception {
        // TODO: link to user id
        long userId = getUserId(req, resp);

        try {
            db.deleteWorkoutInProgress(userId);
        } catch (Exception e) {
            return gson.toJson(e.getMessage());
        }
        return gson.toJson(QUIT_WORKOUT_SUCCESS_RESPONSE_VALUE);
    }

    @ResponseBody
    @GetMapping("/musclegroups/{id}")
    public String getExerciseMuscleGroups(@PathVariable(value="id") long id, HttpServletRequest req, HttpServletResponse resp) throws Exception {
        GymAppState state = getOrCreateSession(req, resp);
        if (!state.isLoggedIn()) {
            return "Please login to view data";
        }
        return gson.toJson(db.getMuscleGroupsFromExerciseId(id));
    }

    @GetMapping("/allcompletedworkouts")
    public String completedWorkouts(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        resp.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        GymAppState state = getOrCreateSession(req, resp);
        if (!state.isLoggedIn()) {
            return "redirect:/";
        }
        return "all-completed-workouts";
    }

    @ResponseBody
    @GetMapping("/getallcompletedworkouts")
    public String getCompletedWorkouts(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        GymAppState state = getOrCreateSession(req, resp);
        if (!state.isLoggedIn()) {
            return "Please login to view completed workouts";
        }
        long userId = getUserId(req, resp);
        return gson.toJson(db.getCompletedWorkouts(userId));
    }

    @ResponseBody
    @GetMapping("/getcompletedtime/{id}")
    public String getCompletedTime(@PathVariable(value="id") long id, HttpServletRequest req, HttpServletResponse resp) throws Exception {
        GymAppState state = getOrCreateSession(req, resp);
        if (!state.isLoggedIn()) {
            return "Please login to view completed workouts";
        }
        long userId = getUserId(req, resp);
        return gson.toJson(db.getCompletedTime(id, userId));
    }

    @GetMapping("/completedworkout/{id}")
    public String completedWorkout(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        resp.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        GymAppState state = getOrCreateSession(req, resp);
        if (!state.isLoggedIn()) {
            return "redirect:/";
        }
        return "completed-workout";
    }

    @ResponseBody
    @GetMapping("/getcompletedworkout/{id}")
    public String getCompletedWorkout(@PathVariable(value="id") long id, HttpServletRequest req, HttpServletResponse resp) throws Exception {
        GymAppState state = getOrCreateSession(req, resp);
        if (!state.isLoggedIn()) {
            return "Please login to view completed workouts";
        }
        long userId = getUserId(req, resp);
        return db.getCompletedWorkout(id, userId);
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
                return gson.toJson("Incorrect password. Please try again.");
            }
        } catch (IllegalStateException e) {
            return gson.toJson(e.getMessage());
        }
    }

    @RequestMapping(value="/logout")
    public @ResponseBody String logout(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        Cookie c = findOrSetSessionCookie(req, resp);
        c.setMaxAge(0);
        resp.addCookie(c);
        HttpSession session = req.getSession();
        session.invalidate();
        req.logout();
        return gson.toJson(LOGOUT_SUCCESS_RESPONSE_VALUE);
    }

    @ResponseBody
    @GetMapping("/userinfo")
    public String getUserNameAndId(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        GymAppState state = getOrCreateSession(req, resp);
        if (!state.isLoggedIn()) {
            return "redirect:/login";
        }

        String userName = state.getUserName();
        long userId = state.getUserId();

        HashMap<String, String> userDetails = new HashMap<>();
        userDetails.put("userName", userName);
        userDetails.put("userId", String.valueOf(userId));
        return gson.toJson(userDetails);
    }

    @RequestMapping(value="/getuserid")
    public @ResponseBody long getUserId(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        GymAppState state = getOrCreateSession(req, resp);
        return state.getUserId();
    }

    @GetMapping("/error}")
    public String errpr(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        resp.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        GymAppState state = getOrCreateSession(req, resp);
        return "error";
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

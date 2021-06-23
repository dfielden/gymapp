package com.danfielden.gymapp.auth;

public class Login {
    private final String email;
    private final String password;
    private final String username;

//    public Login(String email, String password) {
//        this(email, password, "");
//    }

    public Login(String email, String password, String username) {
        this.email = email;
        this.password = password;
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getUsername() {
        return username;
    }


    @Override
    public String toString() {
        return "Login{" +
                "email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", username='" + username + '\'' +
                '}';
    }
}

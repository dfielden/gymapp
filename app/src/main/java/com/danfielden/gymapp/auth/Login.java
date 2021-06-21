package com.danfielden.gymapp.auth;

public class Login {
    private final String email;
    private final String password;

    public Login(String username, String password) {
        this.email = username;
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    @Override
    public String toString() {
        return "Login{" +
                "username='" + email + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}

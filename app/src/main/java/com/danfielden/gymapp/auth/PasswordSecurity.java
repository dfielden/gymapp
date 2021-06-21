package com.danfielden.gymapp.auth;

import java.nio.charset.StandardCharsets;
import com.google.common.hash.Hashing;
import java.util.Random;

public class PasswordSecurity {
    public static String hashString(String s) {
        return Hashing.sha256().hashString(s, StandardCharsets.UTF_8).toString();
    }

    public static String[] createHashedPassword(String s) {
        final Random rand = new Random();
        String salt = String.format("%x", rand.nextLong());
        return new String[] {hashString(s + salt), salt};
    }

}

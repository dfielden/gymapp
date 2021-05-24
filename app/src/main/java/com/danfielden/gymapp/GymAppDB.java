package com.danfielden.gymapp;

import java.io.File;
import java.sql.Connection;
import java.sql.DriverManager;

public final class GymAppDB {
    private final Connection connect;

    public GymAppDB() throws Exception {
        connect = DriverManager.getConnection("jdbc:sqlite:gymappdb.db", "root", "");
    }
}

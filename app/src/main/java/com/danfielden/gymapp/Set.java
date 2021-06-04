package com.danfielden.gymapp;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

public final class Set {
    private double weight;
    private int reps;
    private static final Gson gson = new Gson();


    public Set(double weight, int reps) {
        this.weight = weight;
        this.reps = reps;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public int getReps() {
        return reps;
    }

    public void setReps(int reps) {
        this.reps = reps;
    }

    @Override
    public String toString() {
        return "Weight: " + this.getWeight() + ", Reps: " + this.getReps();
    }

    public JsonObject toJson() {
        JsonObject o = new JsonObject();
        o.addProperty("weight", gson.toJson(getWeight()));
        o.addProperty("reps", gson.toJson(getReps()));

        return o;
    }

}

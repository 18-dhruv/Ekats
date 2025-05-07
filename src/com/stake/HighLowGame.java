package com.stake;

import java.util.Random;
import java.util.Scanner;

public class HighLowGame {
    private static final int PREDEFINED_NUMBER = 50;
    private static final int RANGE = 100;

    // ANSI color codes
    private static final String RESET = "\u001B[0m";
    private static final String GREEN = "\u001B[32m";
    private static final String RED = "\u001B[31m";
    private static final String CYAN = "\u001B[36m";
    private static final String YELLOW = "\u001B[33m";

    public boolean play(Scanner scanner, User user, MongoDBHandler dbHandler) {
        System.out.println(CYAN + "🎯 Welcome to the High-Low Game!" + RESET);
        System.out.println(YELLOW + "Predict whether the random number will be higher or lower than " + PREDEFINED_NUMBER + RESET);
        System.out.println("Enter your bet amount (or 0 to stop):");
        double betAmount = scanner.nextDouble();
        scanner.nextLine(); // Consume newline

        if (betAmount == 0) {
            return false; // Stop playing
        }

        if (betAmount > user.getBalance()) {
            System.out.println(RED + "❌ Insufficient balance." + RESET);
            return true; // Continue playing
        }

        System.out.println("Enter your guess (high/low):");
        String guess = scanner.nextLine().toLowerCase();

        int randomNumber = new Random().nextInt(RANGE + 1);
        System.out.println("The random number is: " + CYAN + randomNumber + RESET);

        boolean isCorrect = (guess.equals("high") && randomNumber > PREDEFINED_NUMBER) ||
                            (guess.equals("low") && randomNumber < PREDEFINED_NUMBER);

        if (isCorrect) {
            user.setBalance(user.getBalance() + betAmount);
            System.out.println(GREEN + "✅ Congratulations! You won " + betAmount + "!" + RESET);
        } else {
            user.setBalance(user.getBalance() - betAmount);
            System.out.println(RED + "❌ Sorry, you lost " + betAmount + "." + RESET);
        }

        dbHandler.saveTransaction(user.getUsername(), "HighLow", betAmount, isCorrect);
        dbHandler.updateUser(user);
        return true; // Continue playing
    }
}

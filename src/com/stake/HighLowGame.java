package com.stake;
import java.util.Random;
import java.util.Scanner;

public class HighLowGame {
    private static final int PREDEFINED_NUMBER = 50;
    private static final int RANGE = 100;

    public boolean play(Scanner scanner, User user, MongoDBHandler dbHandler) {
        System.out.println("Welcome to the High-Low Game!");
        System.out.println("Predict whether the random number will be higher or lower than " + PREDEFINED_NUMBER);
        System.out.println("Enter your bet amount (or 0 to stop):");
        double betAmount = scanner.nextDouble();
        scanner.nextLine(); // Consume newline

        if (betAmount == 0) {
            return false; // Stop playing
        }

        if (betAmount > user.getBalance()) {
            System.out.println("Insufficient balance.");
            return true; // Continue playing
        }

        System.out.println("Enter your guess (high/low):");
        String guess = scanner.nextLine().toLowerCase();

        int randomNumber = new Random().nextInt(RANGE + 1);
        System.out.println("The random number is: " + randomNumber);

        boolean isCorrect = (guess.equals("high") && randomNumber > PREDEFINED_NUMBER) || (guess.equals("low") && randomNumber < PREDEFINED_NUMBER);

        if (isCorrect) {
            user.setBalance(user.getBalance() + betAmount);
            System.out.println("Congratulations! You won " + betAmount + "!");
        } else {
            user.setBalance(user.getBalance() - betAmount);
            System.out.println("Sorry, you lost " + betAmount + ".");
        }

        dbHandler.saveTransaction(user.getUsername(), "HighLow", betAmount, isCorrect);
        dbHandler.updateUser(user);
        return true; // Continue playing
    }
}
package com.stake;

import java.util.Random;
import java.util.Scanner;

public class CoinFlipGame {
    public boolean play(Scanner scanner, User user, MongoDBHandler dbHandler) {
        System.out.println("Coin Flip Game: Guess the outcome (heads/tails)!");
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

        System.out.println("Enter your guess (heads/tails):");
        String guess = scanner.nextLine().toLowerCase();

        String outcome = new Random().nextBoolean() ? "heads" : "tails";
        System.out.println("The coin landed on: " + outcome);

        boolean won = guess.equals(outcome);
        if (won) {
            user.setBalance(user.getBalance() + betAmount);
            System.out.println("Congratulations! You won " + betAmount + "!");
        } else {
            user.setBalance(user.getBalance() - betAmount);
            System.out.println("Sorry, you lost " + betAmount + ".");
        }

        dbHandler.saveTransaction(user.getUsername(), "CoinFlip", betAmount, won);
        dbHandler.updateUser(user);
        return true; // Continue playing
    }
}
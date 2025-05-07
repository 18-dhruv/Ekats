package com.stake;

import java.util.Random;
import java.util.Scanner;

public class CoinFlipGame {

    // ANSI color codes
    private static final String RESET = "\u001B[0m";
    private static final String GREEN = "\u001B[32m";
    private static final String RED = "\u001B[31m";
    private static final String CYAN = "\u001B[36m";
    private static final String YELLOW = "\u001B[33m";

    public boolean play(Scanner scanner, User user, MongoDBHandler dbHandler) {
        System.out.println(CYAN + "🎲 Coin Flip Game: Guess the outcome (heads/tails)!" + RESET);
        System.out.println(YELLOW + "Enter your bet amount (or 0 to stop):" + RESET);

        double betAmount;
        try {
            betAmount = scanner.nextDouble();
        } catch (Exception e) {
            System.out.println(RED + "Invalid input. Please enter a numeric value." + RESET);
            scanner.nextLine(); // clear buffer
            return true;
        }
        scanner.nextLine(); // Consume newline

        if (betAmount == 0) {
            return false; // Stop playing
        }

        if (betAmount > user.getBalance()) {
            System.out.println(RED + "❌ Insufficient balance." + RESET);
            return true;
        }

        System.out.println(YELLOW + "Enter your guess (heads/tails):" + RESET);
        String guess = scanner.nextLine().trim().toLowerCase();

        if (!guess.equals("heads") && !guess.equals("tails")) {
            System.out.println(RED + "Invalid guess. Please enter 'heads' or 'tails'." + RESET);
            return true;
        }

        String outcome = new Random().nextBoolean() ? "heads" : "tails";
        System.out.println(CYAN + "🪙 The coin landed on: " + outcome + RESET);

        boolean won = guess.equals(outcome);
        if (won) {
            user.setBalance(user.getBalance() + betAmount);
            System.out.println(GREEN + "🎉 Congratulations! You won " + betAmount + "!" + RESET);
        } else {
            user.setBalance(user.getBalance() - betAmount);
            System.out.println(RED + "😢 Sorry, you lost " + betAmount + "." + RESET);
        }

        dbHandler.saveTransaction(user.getUsername(), "CoinFlip", betAmount, won);
        dbHandler.updateUser(user);
        return true;
    }
}

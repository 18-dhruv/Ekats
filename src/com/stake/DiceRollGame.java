package com.stake;

import java.util.Random;
import java.util.Scanner;

public class DiceRollGame {

    // ANSI color codes for console styling
    private static final String RESET = "\u001B[0m";
    private static final String GREEN = "\u001B[32m";
    private static final String RED = "\u001B[31m";
    private static final String CYAN = "\u001B[36m";
    private static final String YELLOW = "\u001B[33m";

    public boolean play(Scanner scanner, User user, MongoDBHandler dbHandler) {
        System.out.println(CYAN + "🎲 Dice Roll Game: Guess the number (1-6)!" + RESET);
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

        System.out.println("Enter your guess (1-6):");
        int guess = scanner.nextInt();
        scanner.nextLine(); // Consume newline

        int outcome = new Random().nextInt(6) + 1;
        System.out.println("The dice rolled: " + YELLOW + outcome + RESET);

        boolean won = guess == outcome;
        if (won) {
            double winnings = betAmount * 5;
            user.setBalance(user.getBalance() + winnings);
            System.out.println(GREEN + "✅ Congratulations! You won " + winnings + "!" + RESET);
        } else {
            user.setBalance(user.getBalance() - betAmount);
            System.out.println(RED + "❌ Sorry, you lost " + betAmount + "." + RESET);
        }

        dbHandler.saveTransaction(user.getUsername(), "DiceRoll", betAmount, won);
        dbHandler.updateUser(user);
        return true; // Continue playing
    }
}

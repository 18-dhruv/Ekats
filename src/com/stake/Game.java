package com.stake;

import java.util.Scanner;

public class Game {
    public void playGame(Scanner scanner, User user, MongoDBHandler dbHandler) {
        while (true) {
            System.out.println("Welcome, " + user.getUsername() + "! Your balance is: " + user.getBalance());
            System.out.println("1. Coin Flip\n2. Dice Roll\n3. High-Low\n4. Logout");
            int choice = scanner.nextInt();
            scanner.nextLine(); // Consume newline

            boolean continuePlaying = true;
            switch (choice) {
                case 1:
                    while (continuePlaying) {
                        continuePlaying = new CoinFlipGame().play(scanner, user, dbHandler);
                    }
                    break;
                case 2:
                    while (continuePlaying) {
                        continuePlaying = new DiceRollGame().play(scanner, user, dbHandler);
                    }
                    break;
                case 3:
                    while (continuePlaying) {
                        continuePlaying = new HighLowGame().play(scanner, user, dbHandler);
                    }
                    break;
                case 4:
                    System.out.println("Logging out...");
                    return;
                default:
                    System.out.println("Invalid choice. Please try again.");
            }
        }
    }
}
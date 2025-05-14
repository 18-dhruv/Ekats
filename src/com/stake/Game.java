package com.stake;

import java.util.Scanner;

public class Game {

    private static final String RESET = "\u001B[0m";
    private static final String GREEN = "\u001B[32m";
    private static final String RED = "\u001B[31m";
    private static final String CYAN = "\u001B[36m";
    private static final String YELLOW = "\u001B[33m";

    public void playGame(Scanner scanner, User user, MongoDBHandler dbHandler) {
        while (true) {
            System.out.println(CYAN + "\n🎮 Welcome, " + user.getUsername() + "! Your balance is: " + GREEN + user.getBalance() + RESET);
            System.out.println(YELLOW + "Select an option:" + RESET);
            System.out.println("1. Coin Flip\n2. Dice Roll\n3. High-Low\n4. Logout\n5. Delete Account");

            int choice;
            try {
                choice = scanner.nextInt();
            } catch (Exception e) {
                System.out.println(RED + "❌ Invalid input. Please enter a number." + RESET);
                scanner.nextLine(); // clear buffer
                continue;
            }
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
                    System.out.println(CYAN + "👋 Logging out..." + RESET);
                    return;
                case 5:
                    System.out.print(RED + "⚠️ Are you sure you want to delete your account? (yes/no): " + RESET);
                    String confirmation = scanner.nextLine().trim().toLowerCase();
                    if (confirmation.equals("yes")) {
                        dbHandler.deleteUser(user.getUsername());
                        System.out.println(GREEN + "✅ Your account has been deleted. Goodbye!" + RESET);
                        return;
                    } else {
                        System.out.println(YELLOW + "❗ Account deletion cancelled." + RESET);
                    }
                    break;
                default:
                    System.out.println(RED + "❌ Invalid choice. Please try again." + RESET);
            }
        }
    }
}

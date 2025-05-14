package com.stake;

import java.util.Scanner;

public class Main {

 // ANSI color codes
public static final String RESET = "\u001B[0m";
public static final String RED = "\u001B[31m";
public static final String GREEN = "\u001B[32m";
public static final String YELLOW = "\u001B[33m";
public static final String BLUE = "\u001B[34m";
public static final String CYAN = "\u001B[36m";

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Authentication auth = new Authentication();
        Game game = new Game();
        Admin admin = new Admin();
        MongoDBHandler dbHandler = auth.getDbHandler();

        // Test MongoDB connection at startup
        try {
            boolean connected = dbHandler.testConnection();
            if (connected) {
                System.out.println(GREEN + "MongoDB connection established successfully!" + RESET);
            } else {
                System.out.println(RED + "Failed to establish MongoDB connection. The application will use local storage only." + RESET);
            }
        } catch (Exception e) {
            System.out.println(RED + "MongoDB connection error: " + e.getMessage() + RESET);
            System.out.println(YELLOW + "The application will use local storage only." + RESET);
        }

        try {
            while (true) {
                System.out.println(CYAN + "\n=== CASINO GAME MENU ===" + RESET);
                System.out.println("1. Signup\n2. Login\n3. Admin: View Transactions\n4. Exit");
                System.out.print("Enter your choice: ");

                int choice;
                try {
                    choice = scanner.nextInt();
                } catch (Exception e) {
                    System.out.println(RED + "Please enter a valid number." + RESET);
                    scanner.nextLine(); // Clear the invalid input
                    continue;
                }
                scanner.nextLine(); // Consume newline

                switch (choice) {
                    case 1:
                        auth.signup(scanner);
                        break;
                    case 2:
                        User user = auth.login(scanner);
                        if (user != null) {
                            game.playGame(scanner, user, dbHandler);
                        }
                        break;
                    case 3:
                        admin.viewTransactions(scanner, dbHandler, auth);
                        break;
                    case 4:
                        System.out.println(GREEN + "Thank you for playing. Exiting..." + RESET);
                        return;
                    default:
                        System.out.println(RED + "Invalid choice. Please try again." + RESET);
                }
            }
        } catch (Exception e) {
            System.out.println(RED + "An error occurred: " + e.getMessage() + RESET);
            e.printStackTrace();
        } finally {
            System.out.println(YELLOW + "Closing resources..." + RESET);
            dbHandler.close();
            scanner.close();
        }
    }
}

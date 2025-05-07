package com.stake;
import java.util.Scanner;

public class Main {
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
                System.out.println("MongoDB connection established successfully!");
            } else {
                System.out.println("Failed to establish MongoDB connection. The application will use local storage only.");
            }
        } catch (Exception e) {
            System.out.println("MongoDB connection error: " + e.getMessage());
            System.out.println("The application will use local storage only.");
        }

        try {
            while (true) {
                System.out.println("\n=== CASINO GAME MENU ===");
                System.out.println("1. Signup\n2. Login\n3. Admin: View Transactions\n4. Exit");
                System.out.print("Enter your choice: ");
                
                int choice;
                try {
                    choice = scanner.nextInt();
                } catch (Exception e) {
                    System.out.println("Please enter a valid number.");
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
                        // Fixed: Pass all required parameters to viewTransactions
                        admin.viewTransactions(scanner, dbHandler, auth);
                        break;
                    case 4:
                        System.out.println("Thank you for playing. Exiting...");
                        return;
                    default:
                        System.out.println("Invalid choice. Please try again.");
                }
            }
        } catch (Exception e) {
            System.out.println("An error occurred: " + e.getMessage());
            e.printStackTrace();
        } finally {
            System.out.println("Closing resources...");
            dbHandler.close();
            scanner.close();
        }
    }
}
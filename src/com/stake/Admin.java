package com.stake;
// Fixed import statement
import com.mongodb.client.model.Filters;

import org.bson.Document;
import java.util.List;
import java.util.Scanner;

public class Admin {
    public void viewTransactions(Scanner scanner, MongoDBHandler dbHandler, Authentication auth) {
        System.out.println("\n=== TRANSACTION VIEWER ===");
        System.out.println("Enter username to view transactions (or 'all' for all transactions):");
        String username = scanner.nextLine();

        try {
            if (username.equals("all")) {
                System.out.println("\nAll Transactions:");
                List<Document> transactions = dbHandler.loadTransactions();
                if (transactions.isEmpty()) {
                    System.out.println("No transactions found.");
                } else {
                    System.out.println("Found " + transactions.size() + " transactions:");
                    for (Document transaction : transactions) {
                        System.out.println("Username: " + transaction.getString("username") +
                                ", Game: " + transaction.getString("gameType") +
                                ", Bet: " + transaction.getDouble("betAmount") +
                                ", Outcome: " + transaction.getString("outcome") +
                                ", Time: " + transaction.getString("timestamp"));
                    }
                }
            } else {
                if (auth.findUserByUsername(username) == null) {
                    System.out.println("User not found.");
                    return;
                }
                System.out.println("\nTransactions for " + username + ":");
                List<Document> transactions = dbHandler.loadUserTransactions(username);
                if (transactions.isEmpty()) {
                    System.out.println("No transactions found for this user.");
                } else {
                    for (Document transaction : transactions) {
                        System.out.println("Game: " + transaction.getString("gameType") +
                                ", Bet: " + transaction.getDouble("betAmount") +
                                ", Outcome: " + transaction.getString("outcome") +
                                ", Time: " + transaction.getString("timestamp"));
                    }
                    
                    System.out.println("\nGame Statistics for " + username + ":");
                    Document stats = dbHandler.getUserGameStats(username);
                    if (stats.isEmpty()) {
                        System.out.println("No game statistics available.");
                    } else {
                        for (String gameType : stats.keySet()) {
                            Document gameStats = (Document) stats.get(gameType);
                            System.out.println("Game: " + gameType +
                                    ", Plays: " + gameStats.getInteger("playCount") +
                                    ", Total Bet: " + gameStats.getDouble("totalBet"));
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.out.println("Error retrieving transactions: " + e.getMessage());
            e.printStackTrace();
        }
        
        System.out.println("\nPress Enter to return to the main menu.");
        scanner.nextLine();
    }
}
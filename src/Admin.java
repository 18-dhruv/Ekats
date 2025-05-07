// Removed package declaration to match the directory structure

import com.mongodb.client.model.Filters;
import org.bson.Document;
import java.util.List;
import java.util.Scanner;

public class Admin {
    public void viewTransactions(Scanner scanner, MongoDBHandler dbHandler, Authentication auth) {
        System.out.println("Enter username to view transactions (or 'all' for all transactions):");
        String username = scanner.nextLine();

        if (username.equals("all")) {
            System.out.println("All Transactions:");
            List<Document> transactions = dbHandler.loadTransactions();
            for (Document transaction : transactions) {
                System.out.println("Username: " + transaction.getString("username") +
                        ", Game: " + transaction.getString("gameType") +
                        ", Bet: " + transaction.getDouble("betAmount") +
                        ", Outcome: " + transaction.getString("outcome") +
                        ", Time: " + transaction.getString("timestamp"));
            }
        } else {
            if (auth.findUserByUsername(username) == null) {
                System.out.println("User not found.");
                return;
            }
            System.out.println("Transactions for " + username + ":");
            List<Document> transactions = dbHandler.loadUserTransactions(username);
            for (Document transaction : transactions) {
                System.out.println("Game: " + transaction.getString("gameType") +
                        ", Bet: " + transaction.getDouble("betAmount") +
                        ", Outcome: " + transaction.getString("outcome") +
                        ", Time: " + transaction.getString("timestamp"));
            }
            System.out.println("\nGame Statistics for " + username + ":");
            Document stats = dbHandler.getUserGameStats(username);
            for (String gameType : stats.keySet()) {
                Document gameStats = (Document) stats.get(gameType);
                System.out.println("Game: " + gameType +
                        ", Plays: " + gameStats.getInteger("playCount") +
                        ", Total Bet: " + gameStats.getDouble("totalBet"));
            }
        }
        System.out.println("Press Enter to return to the main menu.");
        scanner.nextLine();
    }
}
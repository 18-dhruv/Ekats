package com.stake;

import com.mongodb.client.*;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Updates;
import org.bson.Document;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class MongoDBHandler {

    // ANSI color codes
    private static final String RESET = "\u001B[0m";
    private static final String RED = "\u001B[31m";
    private static final String GREEN = "\u001B[32m";
    private static final String YELLOW = "\u001B[33m";
    private static final String CYAN = "\u001B[36m";

    private static final String CONNECTION_STRING = "mongodb+srv://dhryvddogra6325:P8Ua05mAcCm7nQou@cluster0.fsaz9ix.mongodb.net/?retryWrites=true&w=majority";

    private static final String DATABASE_NAME = "gameApp";
    private static final String USERS_COLLECTION = "users";
    private static final String TRANSACTIONS_COLLECTION = "transactions";

    private MongoClient mongoClient;
    private MongoDatabase database;
    private MongoCollection<Document> usersCollection;
    private MongoCollection<Document> transactionsCollection;

    public MongoDBHandler() {
        try {
            System.out.println(CYAN + "Attempting to connect to MongoDB Atlas..." + RESET);
            mongoClient = MongoClients.create(CONNECTION_STRING);
            System.out.println(GREEN + "MongoDB client created successfully" + RESET);

            database = mongoClient.getDatabase(DATABASE_NAME);
            System.out.println(GREEN + "Database accessed: " + DATABASE_NAME + RESET);

            usersCollection = database.getCollection(USERS_COLLECTION);
            transactionsCollection = database.getCollection(TRANSACTIONS_COLLECTION);
            System.out.println(GREEN + "Collections accessed successfully" + RESET);
        } catch (Exception e) {
            System.err.println(RED + "Error initializing MongoDB: " + e.getMessage() + RESET);
            e.printStackTrace();
        }
    }

    public boolean testConnection() {
        try {
            if (mongoClient == null) {
                System.out.println(RED + "MongoDB client not initialized" + RESET);
                return false;
            }
            String firstDb = mongoClient.listDatabaseNames().first();
            System.out.println(GREEN + "MongoDB connection test successful! Found database: " + firstDb + RESET);
            return true;
        } catch (Exception e) {
            System.out.println(RED + "MongoDB connection test failed: " + e.getMessage() + RESET);
            e.printStackTrace();
            return false;
        }
    }

    public void saveUser(User user) {
        try {
            if (mongoClient == null) {
                System.out.println(RED + "MongoDB client not initialized - user not saved" + RESET);
                return;
            }

            Document doc = new Document("username", user.getUsername())
                    .append("password", user.getPassword())
                    .append("balance", user.getBalance());
            usersCollection.insertOne(doc);
            System.out.println(GREEN + "User saved to MongoDB: " + user.getUsername() + RESET);
        } catch (Exception e) {
            System.err.println(RED + "Error saving user: " + e.getMessage() + RESET);
            e.printStackTrace();
        }
    }

    public void loadUsers(LinkedList users) {
        try {
            if (mongoClient == null) {
                System.out.println(RED + "MongoDB client not initialized - cannot load users" + RESET);
                return;
            }

            FindIterable<Document> documents = usersCollection.find();
            int count = 0;
            for (Document doc : documents) {
                User user = new User(
                        doc.getString("username"),
                        doc.getString("password"),
                        doc.getDouble("balance")
                );
                users.add(user);
                count++;
            }
            System.out.println(GREEN + "Loaded " + count + " users from MongoDB" + RESET);
        } catch (Exception e) {
            System.err.println(RED + "Error loading users: " + e.getMessage() + RESET);
            e.printStackTrace();
        }
    }

    public void updateUser(User user) {
        try {
            if (mongoClient == null) {
                System.out.println(RED + "MongoDB client not initialized - user not updated" + RESET);
                return;
            }

            usersCollection.updateOne(
                    Filters.eq("username", user.getUsername()),
                    Updates.set("balance", user.getBalance())
            );
            System.out.println(GREEN + "User updated: " + user.getUsername() + ", Balance: " + user.getBalance() + RESET);
        } catch (Exception e) {
            System.err.println(RED + "Error updating user: " + e.getMessage() + RESET);
            e.printStackTrace();
        }
    }

    public void deleteUser(String username) {
        try {
            if (mongoClient == null) {
                System.out.println(RED + "MongoDB client not initialized - user not deleted" + RESET);
                return;
            }

            usersCollection.deleteOne(Filters.eq("username", username));
            System.out.println(YELLOW + "User deleted: " + username + RESET);
        } catch (Exception e) {
            System.err.println(RED + "Error deleting user: " + e.getMessage() + RESET);
            e.printStackTrace();
        }
    }

    public void saveTransaction(String username, String gameType, double betAmount, boolean won) {
        try {
            if (mongoClient == null) {
                System.out.println(RED + "MongoDB client not initialized - transaction not saved" + RESET);
                return;
            }

            Document doc = new Document("username", username)
                    .append("gameType", gameType)
                    .append("betAmount", betAmount)
                    .append("outcome", won ? "win" : "loss")
                    .append("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            transactionsCollection.insertOne(doc);
            System.out.println(GREEN + "Transaction saved: " + username + ", " + gameType + ", " + betAmount + RESET);
        } catch (Exception e) {
            System.err.println(RED + "Error saving transaction: " + e.getMessage() + RESET);
            e.printStackTrace();
        }
    }

    public List<Document> loadTransactions() {
        List<Document> transactions = new ArrayList<>();
        try {
            if (mongoClient == null) {
                System.out.println(RED + "MongoDB client not initialized - cannot load transactions" + RESET);
                return transactions;
            }

            FindIterable<Document> documents = transactionsCollection.find();
            for (Document doc : documents) {
                transactions.add(doc);
            }
            System.out.println(GREEN + "Loaded " + transactions.size() + " transactions from MongoDB" + RESET);
        } catch (Exception e) {
            System.err.println(RED + "Error loading transactions: " + e.getMessage() + RESET);
            e.printStackTrace();
        }
        return transactions;
    }

    public List<Document> loadUserTransactions(String username) {
        List<Document> transactions = new ArrayList<>();
        try {
            if (mongoClient == null) {
                System.out.println(RED + "MongoDB client not initialized - cannot load user transactions" + RESET);
                return transactions;
            }

            FindIterable<Document> documents = transactionsCollection.find(Filters.eq("username", username));
            for (Document doc : documents) {
                transactions.add(doc);
            }
            System.out.println(GREEN + "Loaded " + transactions.size() + " transactions for user: " + username + RESET);
        } catch (Exception e) {
            System.err.println(RED + "Error loading user transactions: " + e.getMessage() + RESET);
            e.printStackTrace();
        }
        return transactions;
    }

    public Document getUserGameStats(String username) {
        Document stats = new Document();
        try {
            if (mongoClient == null) {
                System.out.println(RED + "MongoDB client not initialized - cannot load user game stats" + RESET);
                return stats;
            }

            AggregateIterable<Document> result = transactionsCollection.aggregate(List.of(
                    new Document("$match", new Document("username", username)),
                    new Document("$group", new Document("_id", "$gameType")
                            .append("playCount", new Document("$sum", 1))
                            .append("totalBet", new Document("$sum", "$betAmount")))
            ));

            for (Document doc : result) {
                stats.append(doc.getString("_id"), new Document("playCount", doc.getInteger("playCount"))
                        .append("totalBet", doc.getDouble("totalBet")));
            }
            System.out.println(CYAN + "Loaded game stats for user: " + username + RESET);
        } catch (Exception e) {
            System.err.println(RED + "Error getting user game stats: " + e.getMessage() + RESET);
            e.printStackTrace();
        }
        return stats;
    }

    public void close() {
        try {
            if (mongoClient != null) {
                mongoClient.close();
                System.out.println(YELLOW + "MongoDB connection closed" + RESET);
            }
        } catch (Exception e) {
            System.err.println(RED + "Error closing MongoDB connection: " + e.getMessage() + RESET);
            e.printStackTrace();
        }
    }
}

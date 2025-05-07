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
    // Fix the connection string by properly handling special characters
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
            // Added logging to help with debugging
            System.out.println("Attempting to connect to MongoDB Atlas...");
            mongoClient = MongoClients.create(CONNECTION_STRING);
            System.out.println("MongoDB client created successfully");
            
            database = mongoClient.getDatabase(DATABASE_NAME);
            System.out.println("Database accessed: " + DATABASE_NAME);
            
            usersCollection = database.getCollection(USERS_COLLECTION);
            transactionsCollection = database.getCollection(TRANSACTIONS_COLLECTION);
            System.out.println("Collections accessed successfully");
        } catch (Exception e) {
            System.err.println("Error initializing MongoDB: " + e.getMessage());
            e.printStackTrace();
            // Don't rethrow - allow application to continue with local storage
        }
    }

    /**
     * Tests the MongoDB connection
     * @return true if connection successful, false otherwise
     */
    public boolean testConnection() {
        try {
            if (mongoClient == null) {
                System.out.println("MongoDB client not initialized");
                return false;
            }
            
            // List database names to test connection
            String firstDb = mongoClient.listDatabaseNames().first();
            System.out.println("MongoDB connection test successful! Found database: " + firstDb);
            return true;
        } catch (Exception e) {
            System.out.println("MongoDB connection test failed: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    public void saveUser(User user) {
        try {
            if (mongoClient == null) {
                System.out.println("MongoDB client not initialized - user not saved");
                return;
            }
            
            Document doc = new Document("username", user.getUsername())
                    .append("password", user.getPassword())
                    .append("balance", user.getBalance());
            usersCollection.insertOne(doc);
            System.out.println("User saved to MongoDB: " + user.getUsername());
        } catch (Exception e) {
            System.err.println("Error saving user: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void loadUsers(LinkedList users) {
        try {
            if (mongoClient == null) {
                System.out.println("MongoDB client not initialized - cannot load users");
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
            System.out.println("Loaded " + count + " users from MongoDB");
        } catch (Exception e) {
            System.err.println("Error loading users: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void updateUser(User user) {
        try {
            if (mongoClient == null) {
                System.out.println("MongoDB client not initialized - user not updated");
                return;
            }
            
            usersCollection.updateOne(
                    Filters.eq("username", user.getUsername()),
                    Updates.set("balance", user.getBalance())
            );
            System.out.println("User updated in MongoDB: " + user.getUsername() + ", Balance: " + user.getBalance());
        } catch (Exception e) {
            System.err.println("Error updating user: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void deleteUser(String username) {
        try {
            if (mongoClient == null) {
                System.out.println("MongoDB client not initialized - user not deleted");
                return;
            }
            
            usersCollection.deleteOne(Filters.eq("username", username));
            System.out.println("User deleted from MongoDB: " + username);
        } catch (Exception e) {
            System.err.println("Error deleting user: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void saveTransaction(String username, String gameType, double betAmount, boolean won) {
        try {
            if (mongoClient == null) {
                System.out.println("MongoDB client not initialized - transaction not saved");
                return;
            }
            
            Document doc = new Document("username", username)
                    .append("gameType", gameType)
                    .append("betAmount", betAmount)
                    .append("outcome", won ? "win" : "loss")
                    .append("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            transactionsCollection.insertOne(doc);
            System.out.println("Transaction saved to MongoDB: " + username + ", " + gameType + ", " + betAmount);
        } catch (Exception e) {
            System.err.println("Error saving transaction: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public List<Document> loadTransactions() {
        List<Document> transactions = new ArrayList<>();
        try {
            if (mongoClient == null) {
                System.out.println("MongoDB client not initialized - cannot load transactions");
                return transactions;
            }
            
            FindIterable<Document> documents = transactionsCollection.find();
            for (Document doc : documents) {
                transactions.add(doc);
            }
            System.out.println("Loaded " + transactions.size() + " transactions from MongoDB");
        } catch (Exception e) {
            System.err.println("Error loading transactions: " + e.getMessage());
            e.printStackTrace();
        }
        return transactions;
    }

    public List<Document> loadUserTransactions(String username) {
        List<Document> transactions = new ArrayList<>();
        try {
            if (mongoClient == null) {
                System.out.println("MongoDB client not initialized - cannot load user transactions");
                return transactions;
            }
            
            FindIterable<Document> documents = transactionsCollection.find(Filters.eq("username", username));
            for (Document doc : documents) {
                transactions.add(doc);
            }
            System.out.println("Loaded " + transactions.size() + " transactions for user: " + username);
        } catch (Exception e) {
            System.err.println("Error loading user transactions: " + e.getMessage());
            e.printStackTrace();
        }
        return transactions;
    }

    public Document getUserGameStats(String username) {
        Document stats = new Document();
        try {
            if (mongoClient == null) {
                System.out.println("MongoDB client not initialized - cannot load user game stats");
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
            System.out.println("Loaded game stats for user: " + username);
        } catch (Exception e) {
            System.err.println("Error getting user game stats: " + e.getMessage());
            e.printStackTrace();
        }
        return stats;
    }

    public void close() {
        try {
            if (mongoClient != null) {
                mongoClient.close();
                System.out.println("MongoDB connection closed");
            }
        } catch (Exception e) {
            System.err.println("Error closing MongoDB connection: " + e.getMessage());
            e.printStackTrace();
        }
    }
}

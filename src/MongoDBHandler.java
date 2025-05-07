

import com.mongodb.client.*;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Updates;
import org.bson.Document;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class MongoDBHandler {
    private static final String CONNECTION_STRING = "mongodb://localhost:27017"; // Replace with your MongoDB URI
    private static final String DATABASE_NAME = "gameApp";
    private static final String USERS_COLLECTION = "users";
    private static final String TRANSACTIONS_COLLECTION = "transactions";
    
    private final MongoClient mongoClient;
    private final MongoDatabase database;
    private final MongoCollection<Document> usersCollection;
    private final MongoCollection<Document> transactionsCollection;

    public MongoDBHandler() {
        mongoClient = MongoClients.create(CONNECTION_STRING);
        database = mongoClient.getDatabase(DATABASE_NAME);
        usersCollection = database.getCollection(USERS_COLLECTION);
        transactionsCollection = database.getCollection(TRANSACTIONS_COLLECTION);
    }

    public void saveUser(User user) {
        Document doc = new Document("username", user.getUsername())
                .append("password", user.getPassword())
                .append("balance", user.getBalance());
        usersCollection.insertOne(doc);
    }

    public void loadUsers(LinkedList users) {
        FindIterable<Document> documents = usersCollection.find();
        for (Document doc : documents) {
            User user = new User(
                    doc.getString("username"),
                    doc.getString("password"),
                    doc.getDouble("balance")
            );
            users.add(user);
        }
    }

    public void updateUser(User user) {
        usersCollection.updateOne(
                Filters.eq("username", user.getUsername()),
                Updates.set("balance", user.getBalance())
        );
    }

    public void deleteUser(String username) {
        usersCollection.deleteOne(Filters.eq("username", username));
    }

    public void saveTransaction(String username, String gameType, double betAmount, boolean won) {
        Document doc = new Document("username", username)
                .append("gameType", gameType)
                .append("betAmount", betAmount)
                .append("outcome", won ? "win" : "loss")
                .append("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        transactionsCollection.insertOne(doc);
    }

    public List<Document> loadTransactions() {
        List<Document> transactions = new ArrayList<>();
        FindIterable<Document> documents = transactionsCollection.find();
        for (Document doc : documents) {
            transactions.add(doc);
        }
        return transactions;
    }

    public List<Document> loadUserTransactions(String username) {
        List<Document> transactions = new ArrayList<>();
        FindIterable<Document> documents = transactionsCollection.find(Filters.eq("username", username));
        for (Document doc : documents) {
            transactions.add(doc);
        }
        return transactions;
    }

    public Document getUserGameStats(String username) {
        AggregateIterable<Document> result = transactionsCollection.aggregate(List.of(
                new Document("$match", new Document("username", username)),
                new Document("$group", new Document("_id", "$gameType")
                        .append("playCount", new Document("$sum", 1))
                        .append("totalBet", new Document("$sum", "$betAmount")))
        ));
        Document stats = new Document();
        for (Document doc : result) {
            stats.append(doc.getString("_id"), new Document("playCount", doc.getInteger("playCount"))
                    .append("totalBet", doc.getDouble("totalBet")));
        }
        return stats;
    }

    public void close() {
        mongoClient.close();
    }
}
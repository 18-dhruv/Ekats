

import java.util.Scanner;

public class Authentication {
    private LinkedList users = new LinkedList();
    private MongoDBHandler dbHandler;

    public Authentication() {
        dbHandler = new MongoDBHandler();
        dbHandler.loadUsers(users);
    }

    public void signup(Scanner scanner) {
        System.out.println("Enter a username:");
        String username = scanner.nextLine();
        System.out.println("Enter a password:");
        String password = scanner.nextLine();

        if (users.findByUsername(username) != null) {
            System.out.println("Username already exists. Please try again.");
            return;
        }

        User newUser = new User(username, password, 100.0);
        users.add(newUser);
        dbHandler.saveUser(newUser);
        System.out.println("Signup successful!");
    }

    public User login(Scanner scanner) {
        System.out.println("Enter your username:");
        String username = scanner.nextLine();
        System.out.println("Enter your password:");
        String password = scanner.nextLine();

        User user = users.findByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            System.out.println("Login successful!");
            return user;
        } else {
            System.out.println("Invalid username or password.");
            return null;
        }
    }

    public User findUserByUsername(String username) {
        return users.findByUsername(username);
    }

    public MongoDBHandler getDbHandler() {
        return dbHandler;
    }
}
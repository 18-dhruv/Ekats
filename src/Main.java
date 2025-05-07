

import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Authentication auth = new Authentication();
        Game game = new Game();
        Admin admin = new Admin();
        MongoDBHandler dbHandler = auth.getDbHandler();

        try {
            while (true) {
                System.out.println("1. Signup\n2. Login\n3. Admin: View Transactions\n4. Exit");
                int choice = scanner.nextInt();
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
                        admin.viewTransactions(scanner);
                        break;
                    case 4:
                        System.out.println("Exiting...");
                        return;
                    default:
                        System.out.println("Invalid choice. Please try again.");
                }
            }
        } finally {
            dbHandler.close();
            scanner.close();
        }
    }
}
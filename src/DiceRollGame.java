import java.util.Random;
import java.util.Scanner;

public class DiceRollGame {
public boolean play(Scanner scanner, User user, MongoDBHandler dbHandler) {
        System.out.println("Dice Roll Game: Guess the number (1-6)!");
        System.out.println("Enter your bet amount (or 0 to stop):");
        double betAmount = scanner.nextDouble();
        scanner.nextLine(); // Consume newline

        if (betAmount == 0) {
            return false; // Stop playing
        }

        if (betAmount > user.getBalance()) {
            System.out.println("Insufficient balance.");
            return true; // Continue playing
        }

        System.out.println("Enter your guess (1-6):");
        int guess = scanner.nextInt();
        scanner.nextLine(); // Consume newline

        int outcome = new Random().nextInt(6) + 1;
        System.out.println("The dice rolled: " + outcome);

        boolean won = guess == outcome;
        if (won) {
            user.setBalance(user.getBalance() + betAmount * 5);
            System.out.println("Congratulations! You won " + (betAmount * 5) + "!");
        } else {
            user.setBalance(user.getBalance() - betAmount);
            System.out.println("Sorry, you lost " + betAmount + ".");
        }

        dbHandler.saveTransaction(user.getUsername(), "DiceRoll", betAmount, won);
        dbHandler.updateUser(user);
        return true; // Continue playing
    }
}
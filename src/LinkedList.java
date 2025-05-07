public class LinkedList {
    public Node head;

    public static class Node {
        User data;
        Node next;

        Node(User data) {
            this.data = data;
            this.next = null;
        }
    }

    public void add(User data) {
        Node newNode = new Node(data);
        if (head == null) {
            head = newNode;
        } else {
            Node current = head;
            while (current.next != null) {
                current = current.next;
            }
            current.next = newNode;
        }
    }

    public User findByUsername(String username) {
        Node current = head;
        while (current != null) {
            if (current.data.getUsername().equals(username)) {
                return current.data;
            }
            current = current.next;
        }
        return null;
    }
}

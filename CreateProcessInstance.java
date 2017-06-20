import java.io.IOException;
import java.util.Scanner;
public class CreateProcessInstance{
    public static void main(String args[]) throws IOException{
        //Entry point to the library
        Scanner reader = new Scanner(System.in);  // Reading from System.in
        System.out.println("Enter the name of the Process : ");
        String n = reader.nextLine();
        ProcessInstance PI = Process.getInstanceByName(n);
    }

}
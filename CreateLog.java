import java.io.PrintStream;
import java.net.URL;
import java.net.URLConnection;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.Scanner;
import java.io.InputStreamReader;

public class CreateLog{

    // This will be used to attACH LOGS to the process instance
    public void createLogForProcessInstance(String processInstanceId)throws IOException{
        try{
        System.out.println(processInstanceId);
        boolean flag = false;
        String log[] = {"Hey Mock Instance is starting", "Hey Mock instance is collecting log", "Mock instance is still collecting log", "Mock instance has stopped"};
        for(int i=0;i<4;i++){
            addLog(processInstanceId,log[i]);
            Thread.sleep(10000);
        }
        stopInstance(processInstanceId);
    }catch(InterruptedException ex) {
    Thread.currentThread().interrupt();
}
}

//this is used to update process instance status once it has stopped.
    public void stopInstance(String processInstanceId)throws IOException{
        URL url = new URL("http://localhost:3001/stopInstance");
        //Insert your JSON query request
        String query = "{'ProcessInstanceId': '" + processInstanceId + "'}";
        //It change the apostrophe char to double colon char, to form a correct JSON string
        query=query.replace("'", "\"");

        try{
            //make connection
            URLConnection urlc = url.openConnection();
            //It Content Type is so importan to support JSON call
            urlc.setRequestProperty("Content-Type", "application/json");
            Msj("Connection: " + url.toString());
            //use post mode
            urlc.setDoOutput(true);
            urlc.setAllowUserInteraction(false);

            //send query
            PrintStream ps = new PrintStream(urlc.getOutputStream());
            ps.print(query);
            Msj("Query: " + query);
            ps.close();

            //get result
            BufferedReader br = new BufferedReader(new InputStreamReader(urlc.getInputStream()));
            String l = null;
            while ((l=br.readLine())!=null) {
                Msj(l);
            }
            br.close();
        } catch (Exception e){
            Msj("Error occcured");
            Msj(e.toString());
        }

    }

    //This will create log in the database
    public void addLog(String processInstanceId, String logDescription)throws IOException{
                URL url = new URL("http://localhost:3001/creatLog");
        //Insert your JSON query request
        String query = "{'ProcessInstanceId': " + "'" + processInstanceId + "' , 'LogDescription': " + "'" + logDescription + "'}";
        //It change the apostrophe char to double colon char, to form a correct JSON string
        query=query.replace("'", "\"");

        try{
            //make connection
            URLConnection urlc = url.openConnection();
            //It Content Type is so importan to support JSON call
            urlc.setRequestProperty("Content-Type", "application/json");
            Msj("Connection: " + url.toString());
            //use post mode
            urlc.setDoOutput(true);
            urlc.setAllowUserInteraction(false);

            //send query
            PrintStream ps = new PrintStream(urlc.getOutputStream());
            ps.print(query);
            Msj("Query: " + query);
            ps.close();

            //get result
            BufferedReader br = new BufferedReader(new InputStreamReader(urlc.getInputStream()));
            String l = null;
            while ((l=br.readLine())!=null) {
                Msj(l);
            }
            br.close();
        } catch (Exception e){
            Msj("Error occcured");
            Msj(e.toString());
        }
    }

    private static void Msj(String texto){
        System.out.println(texto);
    }

}
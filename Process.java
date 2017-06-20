import java.io.PrintStream;
import java.net.URL;
import java.net.URLConnection;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Process{


    // This will call the service to create process Instance for the process.
    public static ProcessInstance getInstanceByName(String processName)throws IOException{
        CreateLog createLog = new CreateLog();
        URL url = new URL("http://localhost:3001/creatProcessInstance");
        //Insert your JSON query request
        String query = "{'ProcessName': " + "'" + processName + "'}";
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
                l=l.replace("\"", " ");
                l=l.replace("{", " ");
                String[] parts = l.split(" ");
                createLog.createLogForProcessInstance(parts[5]);
            }
            br.close();
        } catch (Exception e){
            Msj("Error occcured");
            Msj(e.toString());
        }
        return null;
    }

    private static void Msj(String texto){
        System.out.println(texto);
    }

}
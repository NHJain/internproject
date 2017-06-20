import java.sql.Date;

public class ProcessInstance {
    private int ProcessId;
    private int ProcessInstanceId;
    private String StartTime;
    private String EndTime;
    private String Status;

    public int getProcessId() {
        return this.ProcessId;
    }

    public void setProcessId(int ProcessId){
        this.ProcessId = ProcessId;
    }

    public int getProcessInstanceId() {
        return this.ProcessId;
    }

    public void setProcessInstanceId(int ProcessInstanceId){
        this.ProcessInstanceId = ProcessInstanceId;
    }

    public String getStartTime() {
        return this.StartTime;
    }

    public void setStartTime(String StartTime){
        this.StartTime = StartTime;
    }

    public String getEndTime() {
        return this.EndTime;
    }

    public void setEndTime(String EndTime){
        this.EndTime = EndTime;
    }

    public String getStatus() {
        return this.Status;
    }

    public void setStatus(String Status){
        this.Status = Status;
    }

}
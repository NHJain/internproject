const express = require('express')
const path = require('path')
const port = process.env.PORT || 3001
const app = express()
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var dateFormat = require('dateformat');

// serve static assets normally
app.use(express.static(__dirname + '/public'))

var neo4j = require('node-neo4j');
db = new neo4j('http://neo4j:Neo4j@0.0.0.0:7474');

// Handles all routes so you do not get a not found error
app.get('*', function (request, response) {
    console.log("Index.js")
    response.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

app.post('/getAllProcess', function (req, res) {
    db.cypherQuery('MATCH (n:Process) return n', function (err, result) {
        res.json(result.data);
    });
});

app.post('/getProcessInstance', function (req, res) {
    db.cypherQuery('MATCH (n:Process{ProcessName:"'+req.body.processName+'"})-[:INSTANCE_OF]-(pi:ProcessInstance) return pi', function (err, result) {
        res.json(result.data);
    });
});

app.post('/getAllBUnit', function(req, res) {
    db.cypherQuery('MATCH (n:BusinessUnit) return n', function(err, result) {
        res.json(result.data);
    });
});

app.post('/getInstanceLog', function (req, res) {
    db.cypherQuery('MATCH (n:ProcessInstance)-[:LOGS_OF]-(pi:Log) where ID(n) = '+ req.body.processInstanceId +' return pi', function (err, result) {
        res.json(result.data);
    });
});

//This will be called from the frontend and will be used to create process node.
app.post('/defineProcess', function (req, res) {
    db.insertNode({
        ProcessName: req.body.description.name,
        ProcssDescription: req.body.description.tagline,
        BusinessUnit: req.body.description.BusinessUnit,
        Environment: req.body.description.Env,
    }, 'Process', function (err, result) {
        console.log("Process with name " + result.ProcessName + " has been created.");
    });
    res.json({ message: 'Hurrah! Process has been created' });
});

//This will be called from Java library to create a Process instance for the Process
app.post('/creatProcessInstance', function (req, res) {
    var dateTime = new Date();
    var dateTime = dateFormat(dateTime, "ddd mmm d yyyy HH:MM:ss o (Z)");
    db.insertNode({
        ProcessName: req.body.ProcessName,
        StartTime: dateTime,
        EndTime: " ",
        Status: "Running"
    }, 'ProcessInstance', function (err, result) {
        getProcessId(result); // This is used to get Internal Process id of the Process
        console.log("Process Instance has been assigned to the Process");
        res.json({ "ProcessInstanceId": " " + result._id });
    });
});

app.post('/getAllEnvironment', function(req, res) {
    db.cypherQuery('MATCH (n:Environment) return n', function(err, result) {
        res.json(result.data);
    });
});


//This will be called from Java library to update the status of the process instance
app.post('/stopInstance', function (req, res) {
    var dateTime = new Date();
    db.cypherQuery('MATCH (n) where ID(n) = ' + req.body.ProcessInstanceId + ' SET n.Status = "Completed" return n', function (err, result) {
    });
    db.cypherQuery('MATCH (n) where ID(n) = ' + req.body.ProcessInstanceId + ' SET n.EndTime = "' + dateTime + '" return n', function (err, result) {
    });
    res.json({ message: 'ProcessInstance has stopped and updated with the logs.' });
});

// This is called to attach logs to the process instance
app.post('/creatLog', function (req, res) {
    db.insertNode({
        ProcessInstanceId: req.body.ProcessInstanceId,
        LogDescription: req.body.LogDescription,
        time: req.body.dateTime
    }, 'Log', function (err, result) {
        makeRelationshipInstanceLog(result);
        console.log("Log for current Process Instance has been generated");
    });
    res.json({ message: 'hooray! Log has been created' });
});

// This is called internally to make relationship between Log and Process Instance 
function makeRelationshipInstanceLog(result) {
    console.log(result.ProcessInstanceId);
    var root_node_id = result.ProcessInstanceId;
    var other_node_id = result._id;
    db.insertRelationship(other_node_id, root_node_id, 'LOGS_OF', {}, function (err, result) {
    });
}

// This method will return internal process id for the process
function getProcessId(result) {
    db.readNodesWithLabelsAndProperties('Process', {
        "ProcessName": result.ProcessName
    }, function (err, node) {
        if (err) throw err;
        makeRelationshipProcessInstance(node, result);
    });
}

// This is called internally to make relationship between Process and Process Instance 
function makeRelationshipProcessInstance(node, result) {
    var root_node_id = node[0]._id;
    var other_node_id = result._id;
    db.insertRelationship(other_node_id, root_node_id, 'INSTANCE_OF', {}, function (err, result) {
    });

}

app.listen(port)
console.log("server started on port " + port)


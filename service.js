// 'module.exports' is a node.JS specific feature, it does not work with regular JavaScript
module.exports = {
    // This is the function which will be called in the main file, which is server.js
    // when the function is called in the main file.
    insertProcess: function (req, res) {
        db.insertNode({
            ProcessName: req.body.description.name,
            ProcssDescription: req.body.description.tagline,
            Department: req.body.description.BusinessUnit,
            Owner: req.body.description.Env,
        }, 'Process', function (err, result) {
            console.log("Process with name " + result.ProcessName + " has been created.");
        });
        res.json({
            message: 'hooray! Process has been created'
        });
    },

    getAllBUnit: function (req, res) {
        db.cypherQuery('MATCH (n:BusinessUnit) return n', function (err, result) {
            res.json(result.data);
        });
    },

    getAllEnvironment: function (req, res) {
        db.cypherQuery('MATCH (n:Environment) return n', function (err, result) {
            res.json(result.data);
        });
    },

    getInstanceLog: function (req, res) {
        db.cypherQuery('MATCH (n:ProcessInstance)-[:LOGS_OF]-(pi:Log) where ID(n) = ' + req.body.processInstanceId + ' return pi', function (err, result) {
            res.json(result.data);
        });
    },

    getProcessInstance: function (req, res) {
        db.cypherQuery('MATCH (n:Process{ProcessName:"' + req.body.processName + '"})-[:INSTANCE_OF]-(pi:ProcessInstance) return pi', function (err, result) {
            res.json(result.data);
        });
    },

    createProcessInstance: function (req, res) {
        var dateTime = new Date();
        db.insertNode({
            ProcessName: req.body.ProcessName,
            StartTime: dateTime,
            EndTime: " ",
            Status: "Running"
        }, 'ProcessInstance', function (err, result) {
            getProcessId(result);
            console.log("Process Instance has been assigned to the Process");
            res.json({
                "ProcessInstanceId": result._id
            });
        });
    },

    stopInstance: function (req, res) {
        var dateTime = new Date();
        db.cypherQuery('MATCH (n) where ID(n) = ' + req.body.ProcessInstanceId + ' SET n.Status = "Completed" return n', function (err, result) {
            console.log(err);
        });
        db.cypherQuery('MATCH (n) where ID(n) = ' + req.body.ProcessInstanceId + ' SET n.EndTime = "' + dateTime + '" return n', function (err, result) {
            console.log(err);
        });
        res.json({
            message: 'ProcessInstance has stopped and updated with the logs.'
        });
    },

    getProcess: function (req, res) {
        db.cypherQuery('MATCH (n:Process) return n', function (err, result) {
            res.json(result.data);
        });
    },

    creatLog: function (req, res) {
        var dateTime = new Date();
        db.insertNode({
            ProcessInstanceId: req.body.ProcessInstanceId,
            LogDescription: req.body.LogDescription,
            time: req.body.dateTime
        }, 'Log', function (err, result) {
            makeRelationship(result, "LOGS_OF");
            console.log("Log for current Process Instance has been generated");
        });
        res.json({
            message: 'hooray! Log has been created'
        });
    }
};

function getProcessId(result) {
    db.readNodesWithLabelsAndProperties('Process', {
        "ProcessName": result.ProcessName
    }, function (err, node) {
        if (err) throw err;
        makeRelationship(result, "INSTANCE_OF", node);
    });
}

function makeRelationship(result, relation, node) {
    if (typeof node !== 'undefined' && node !== null) {
        var root_node_id = node[0]._id;
    } else {
        var root_node_id = result.ProcessInstanceId;
    }
    var other_node_id = result._id;
    db.insertRelationship(other_node_id, root_node_id, relation, {}, function (err, result) {
        console.log(err);
    });
}
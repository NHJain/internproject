var fs = require("fs");
var avro = require('avro-js');
var file = require("file");
var dateFormat = require('dateformat');
var lastRunDate = new Date('2013-05-23');
var scanTime = 0;
var fileList = [];
var metaDataList = [];
var dataList = undefined;
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

    getDataSetList: function (req, res) {
        db.cypherQuery('MATCH (n:DataSet) return n', function (err, result) {
            res.json(result.data);
        });
    },

    dataSetNodeCreater: function (req, res) {
        fileList = [];
        file.walkSync("./avroFiles", function (start, dirs, names) {
            console.log("\n Inside walkSync"+names);
            fileList.push({
                FileName: "" + names,
                directory: "./" + start,
                path: "./" + start + "/" + names,
                time: "",
                size: ""
            });
        });
        fileList.reverse().pop();
        console.log("Last Run Time :" + lastRunDate);
        getFileDetails(fileList);
        makeNodeForAFile(fileList);
        var now = new Date();
        lastRunDate = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
        res.json(fileList);
    },

    getMetaData: function (req, res) {
        fileList = [];
        metaDataList = [];
        console.log("This is from front end : " +req.body.dataSetDirectory);
        file.walkSync(req.body.dataSetDirectory, function (start, dirs, names) {
            fileList.push({
                path: start + "/" + names
            });
        });
       for(i = 0; i < fileList.length; i++){
          console.log("This is for meta : " + fileList[i].path); 
         avro.createFileDecoder(fileList[i].path)
            .on('metadata', function (type) {
               res.json(type);
            })
            .on('data', function(record){
                console.log(record);
            })
            console.log(metaDataList);
        }
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
        var dateTime = dateFormat(dateTime, "ddd mmm d yyyy HH:MM:ss o (Z)");
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

function makeNodeForAFile(fileList) {
    var query = "create";
    var flag = false;
    for(i = 0; i < fileList.length; i++){
        var date = new Date(fileList[i].time);
        if(date>lastRunDate){
            flag = true;
            query += " (:DataSet {Name : '"+fileList[i].FileName+"', directory : '"+fileList[i].directory+"',path : '"+fileList[i].path+"', time : '"+fileList[i].time+"' , size: '"+fileList[i].size+"'}),"
        }
    }
    if(flag){
        console.log(query);
        query = query.substring(0, query.length - 1);
        db.cypherQuery(query, function (err, result) {
            console.log(err);
        });
    }
}


function getFileDetails(fileList) {
    for (i = 0; i < fileList.length; i++) {
        var fileName = fileList[i].path;
        if (fs.existsSync(fileName)) {
            var stats = fs.statSync(fileName);
        }
        fileList[i].time = stats.birthtime;
        fileList[i].size = stats.size;
    }
}

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
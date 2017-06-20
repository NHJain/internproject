const express = require('express')
const path = require('path')
const port = process.env.PORT || 3001
const app = express()
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
var dateFormat = require('dateformat');
var service = require('./service');
// serve static assets normally
app.use(express.static(__dirname + '/public'))

var neo4j = require('node-neo4j');
db = new neo4j('http://neo4j:Neo4j@0.0.0.0:7474');

app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

app.post('/getAllBUnit', function (req, res) {
    service.getAllBUnit(req, res);
});

app.post('/getAllEnvironment', function (req, res) {
    service.getAllEnvironment(req, res);
});

app.post('/getInstanceLog', function (req, res) {
    service.getInstanceLog(req, res);
});

app.post('/getProcessInstance', function (req, res) {
    service.getProcessInstance(req, res);
});

//This will be called from the frontend and will be used to create process node.
app.post('/defineProcess', function (req, res) {
    service.insertProcess(req, res);
});

//This will be called from Java library to create a Process instance for the Process
app.post('/creatProcessInstance', function (req, res) {
    service.createProcessInstance(req, res);
});

app.post('/getAllProcess', function (req, res) {
    service.getProcess(req, res);
});

//This will be called from Java library to update the status of the process instance
app.post('/stopInstance', function (req, res) {
    service.stopInstance(req, res);
});

// This is called to attach logs to the process instance
app.post('/creatLog', function (req, res) {
    service.creatLog(req, res);
});

//Port on which the pplication is listening
app.listen(port)
console.log("server started on port " + port)
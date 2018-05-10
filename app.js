'use strict'

const WebSocketServer = require('websocket').server;
const http = require("http");
const dataGenerator = require("./dataGenerator.js");
let jsonData = require('./data.json');

const hostname = '127.0.0.1'
const port = 8080;

function generateAndSendData(connection)
{
    // If connection is closed, return
    if(connection.closeReasonCode != -1){
        return
    }

    let newData = dataGenerator.GenerateThreatData(); 
    // Send newData
    connection.send(JSON.stringify(newData));

    // Repeat in 5 sec
    setTimeout(()=> {
        generateAndSendData(connection);
    }, 5000); // 5 sec    
}
// Http Server
const server = http.createServer((req, res) =>{
    res.statusCode = 200; 
    res.setHeader('Content-type', 'text/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    // Deliver initial data from data.json file. 
    res.write(JSON.stringify(jsonData));
    res.end(); 
});

server.listen(port, hostname, () => {
    console.log("Server Started");
});

// Socket Server to push updates to front-end
const wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

wsServer.on('request', function(request) {

    // Establish connection;
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');

    // Queue data generation
    setTimeout(()=> {
        generateAndSendData(connection);
    }, 5000); // 5 sec

    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});
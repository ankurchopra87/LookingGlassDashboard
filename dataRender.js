var ips = [];
let ipToVirus = {};
let ipToOwner = {};
let mailServers = [];
let webServers = [];
let ftpServers = [];
let numApt1 = 0; 
let numSpam = 0; 
let numBotNet = 0; 
let numStealCreds = 0; 

var map;
var markers = {};

let labelKey = "ip"; 

// Radio button selection to toggle the label that the map markers display 
var ipRadioButton = document.getElementById("ip-radio-button");
var ownerRadioButton = document.getElementById("owner-radio-button");

ipRadioButton.onclick = function() {
    labelKey = 'ip';
    ips.forEach((ip)=>{
        markers[ip].setLabel(ip);
    });
}

ownerRadioButton.onclick = function() {
    labelKey = 'owner';
    ips.forEach((ip)=>{
        markers[ip].setLabel(ipToOwner[ip]);
    });    
}

// Update Data Display
var mailServersDiv = document.getElementById("mail-servers");
var ftpServersDiv = document.getElementById("ftp-servers");
var webServersDiv = document.getElementById("web-servers");

var apt1Div = document.getElementById("apt1");
var spamDiv = document.getElementById("spam");
var botnetDiv = document.getElementById("botnet");
var stealCredsDiv = document.getElementById("steal-creds");

function updateDataDisplay(){
    mailServersDiv.innerHTML = mailServers.length;
    webServersDiv.innerHTML = webServers.length;
    ftpServersDiv.innerHTML = ftpServers.length;

    apt1Div.innerHTML = numApt1;
    spamDiv.innerHTML = numSpam;
    botnetDiv.innerHTML = numBotNet;
    stealCredsDiv.innerHTML = numStealCreds;
}

// Get Random number in a specified range
function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
}

// Process data to key track of counts and associations
function processData(data){
    data["threatData"].forEach((threat) => {
        
        if(!ips.includes(threat['ip'])){
            ips.push(threat['ip']);
        }
        if(!ipToVirus.hasOwnProperty(threat['ip'])){
            ipToVirus[threat['ip']] = [];
        }
        ipToVirus[threat['ip']] =  ipToVirus[threat['ip']].concat(threat['virus']);

        ipToOwner[threat['ip']] = threat['owner'];

        switch (threat["function"]){
            case 'web server':
                webServers.push(threat['ip']);
            break;
            case 'mail server':
                mailServers.push(threat['ip'])
            break;
            case 'ftp server':
                ftpServers.push(threat['ip'])
            break;
        }

        threat['virus'].forEach((virus) => {
            switch (virus){
                case 'APT1':
                    numApt1++;    
                break;
                case 'Spam':
                    numSpam++;
                break;
                case 'Botnet':
                    numBotNet++;
                break;
                case 'StealCreds':
                    numStealCreds++; 
                break;
            }   
        });
    });
}

// Generate html for infoWindow, using current values. 
function getInfoWindowContent(ip){
    return '<div class="marker-info">' +
            '<p><b>IP: </b>' + ip + '</p>' +
            '<p><b>Threat Count: </b>' + ipToVirus[ip].length + '</p>'+
        '</div>';    
}

// Add Markers to the Map based on the Data recieved.
function addMapData(data) {

    for(let i= 0; i < data["threatData"].length; i++){

        // Create Marker
        let marker = new google.maps.Marker({
            position: { // Random location
                lat: getRandomInRange(-90, 90, 3),
                lng: getRandomInRange(-180, 180, 3)
            },
            label: data["threatData"][i][labelKey],
            animation: google.maps.Animation.DROP,
        });
       
        let ip = data['threatData'][i]['ip'];

        // On click, show tooltip
        marker.addListener('click', function(){
            // show infowindow
            let infowindow = new google.maps.InfoWindow({
                content: getInfoWindowContent(ip) // Get content based on ip
            }); 
            infowindow.open(map, marker);
        });
        marker.setMap(map);

        // keep reference
        markers[data["threatData"][i]['ip']] = marker;
    }
}

// Initialize the map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 0, lng: 0},
        zoom: 3
    });
}

// Load data on page load
function loadInitialData(){

    // Make AJAX request
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://127.0.0.1:8080/');
    xhr.onload = function() {
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText); // parse json
            processData(data); // process
            addMapData(data); // addToMap
            updateDataDisplay(); // update Data Display
        }
        else {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}

// Initialize
initMap();
loadInitialData(); 

// Open socket connection
const socket = new WebSocket('ws://localhost:8080', 'echo-protocol');
socket.addEventListener('message', function (event) {
    // consume new data
    var updateData = JSON.parse(event.data); 
    processData(updateData);
    addMapData(updateData);
    updateDataDisplay(); // update Data Display
});


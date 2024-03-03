const { clear } = require('console');
const { send } = require('process');

document.onkeydown = updateKey;
document.onkeyup = resetKey;

var server_port = 65432;
var server_addr = "10.0.0.7";   // the IP address of your Raspberry PI
var client;
var sendMsg = false;
var interval;

function setUpClient(){
    
    const net = require('net');

    client = net.createConnection({ port: server_port, host: server_addr }, () => {
        console.log('connected to server!');
    });
    
    // get the data from the server
    client.on('data', (data) => {
        // document.getElementById("bluetooth").innerHTML = data;
        console.log(data.toString());
        try{
            var obj = JSON.parse(data.toString());
            document.getElementById("power").innerHTML = obj.power;
            document.getElementById("direction").innerHTML = obj.direction;
            document.getElementById("distance").innerHTML = obj.distance;
            document.getElementById("temperature").innerHTML = obj.cpu_temp;
        }catch(err){
            console.log(err);
        }
        // client.end();
        // client.destroy();
    });

    client.on('end', () => {
        console.log('disconnected from server');
        
    });

    client.on('error', (err) => {
        console.error('Client error:', err);
    });
}

// for detecting which key is been pressed w,a,s,d
function updateKey(e) {

    e = e || window.event;

    if (e.keyCode == '87') {
        // up (w)
        document.getElementById("upArrow").style.color = "green";
        send_data("87");
    }
    else if (e.keyCode == '83') {
        // down (s)
        document.getElementById("downArrow").style.color = "green";
        send_data("83");
    }
    else if (e.keyCode == '65') {
        // left (a)
        document.getElementById("leftArrow").style.color = "green";
        send_data("65");
    }
    else if (e.keyCode == '68') {
        // right (d)
        document.getElementById("rightArrow").style.color = "green";
        send_data("68");
    }
    else if (e.keyCode == '81') {
        // q
        clearInterval(interval);
    }
}

// reset the key to the start state 
function resetKey(e) {

    e = e || window.event;

    send_data("0");

    document.getElementById("upArrow").style.color = "grey";
    document.getElementById("downArrow").style.color = "grey";
    document.getElementById("leftArrow").style.color = "grey";
    document.getElementById("rightArrow").style.color = "grey";
}


// update data for every 1000ms
function update_data(){
    if(!client){
        setUpClient();
    }
    var input = document.getElementById("message").value;
    interval = setInterval(function(){
        client.write(`${input}\r\n`);
    }, 1000);
}

function send_data(data){
    if(!client){
        setUpClient();
    }
    client.write(`${data}\r\n`);
}

setUpClient();

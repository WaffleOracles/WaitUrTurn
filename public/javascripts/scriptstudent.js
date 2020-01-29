var socket = new WebSocket("ws://localhost:4000");

// Generate queue slot and send to server
function addToQueue() {
    let navn = document.getElementById('navnField').value;
    let fag = document.getElementById('fagField').value;
    let bordNummer = document.getElementById('bordField').value;
    socket.send(navn + ", " + fag + ", " + bordNummer);
    console.log("sent message")
};



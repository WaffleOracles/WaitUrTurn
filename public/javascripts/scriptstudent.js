var socket = new WebSocket("ws://localhost:4000");

// Generate queue slot and send to server
function addToQueue() {
    let navn = document.getElementById('navnField').value;
    let fag = document.getElementById('fagField').value;
    let bordNummer = document.getElementById('bordField').value;
    socket.send(navn + ", " + fag + ", " + bordNummer);
    console.log("sent message")
};


function mouseOver(id) {
    id.style.backgroundColor =  "#edae49";
    id.style.color ='#d1495b';
}

function mouseLeave(id) {
    id.style.backgroundColor =  "#d1495b";
    id.style.color ='#edae49';
}
function mouseDown(id) {
    id.style.backgroundColor =  "#edae49";
    id.style.color ='#d1495b';
    id.style.boxShadow = "inset 0px 0px 10px 3px #d1495b";
}
function mouseUp(id) {
    id.style.boxShadow = "inset 0px 0px 0px 0px #d1495b";
}


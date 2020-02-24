function QueueSlot(navnIn, fagIn, bordNummerIn) {
    return {
        navn: navnIn,
        fag: fagIn,
        bordNummer: bordNummerIn
    }
}

var waitingQueue = [];
var servingQueue = [];
nrQueueItems = 0;
nrServingItems = 0;

window.onload = function () {
    var socket = new WebSocket("ws://localhost:4000");
    socket.onmessage = function (event) {
        processSlotFromServer(event.data);
    };
    socket.onopen = function () {
        socket.send("REQ WAITING QUEUE");
        socket.send("REQ SERVING QUEUE");
    };
};

function processSlotFromServer(data) {
    const processedData = JSON.parse(data);

    function createItem(queue, slotJSON, acceptButtonText) {
        let queueSlot = new QueueSlot(slotJSON.navn, slotJSON.fag, slotJSON.bordnummer);
        queue.push(queueSlot);
        return createQueueItem(queueSlot, nrQueueItems++, acceptButtonText);
    }

    if (processedData.waiting) {
        for (let index in processedData.waiting) {
            let slotJSON = processedData.waiting[index];
            // Finally add the new element to the queue section
            let queueSection = document.getElementsByClassName('waitingQueue');
            queueSection[0].appendChild(createItem(waitingQueue, slotJSON, "accept"));
        }
    }
    if (processedData.serving) {
        for (let index in processedData.serving) {
            let slotJSON = processedData.serving[index];
            // Finally add the new element to the queue section
            let queueSection = document.getElementsByClassName('servingQueue');
            queueSection[0].appendChild(createItem(servingQueue, slotJSON, "done"),);

        }
    }


}

function createQueueItem(queueSlot, number, acceptButtonText) {
    let queueItem = document.createElement('div');
    queueItem.className = 'queueItem';
    queueItem.setAttribute('id', String(number));

    let queueItemText = document.createElement('div');
    queueItemText.className = 'queueItemText';

    let itemTextNavn = document.createElement('p');
    let itemTextFag = document.createElement('p');
    let itemTextBord = document.createElement('p');
    itemTextNavn.className = 'itemText';
    itemTextFag.className = 'itemText';
    itemTextBord.className = 'itemText';
    itemTextNavn.innerHTML = 'Navn: ' + queueSlot.navn;
    itemTextFag.innerHTML = 'Fag: ' + queueSlot.fag;
    itemTextBord.innerHTML = 'Bord nummer: ' + queueSlot.bordNummer;

    queueItemText.appendChild(itemTextNavn);
    queueItemText.appendChild(itemTextFag);
    queueItemText.appendChild(itemTextBord);
    queueItem.appendChild(queueItemText);

    // Buttons
    let buttons = document.createElement('div');
    buttons.className = 'buttons';

    // Accept button
    let queueItemButton = document.createElement('div');
    queueItemButton.className = 'queueItemButton'; // TODO change class name
    if(acceptButtonText === "done"){
        queueItemButton.setAttribute('onclick', 'doneRequest(this)');
    }else if (acceptButtonText === "accept"){
        queueItemButton.setAttribute('onclick', 'acceptRequest(this)');
    }


    let itemTextButton = document.createElement('p');
    itemTextButton.className = 'buttonText';
    itemTextButton.innerHTML = 'Accept';
    if(acceptButtonText === "done"){
        itemTextButton.innerHTML = 'Done';
    }else if (acceptButtonText === "accept"){
        itemTextButton.innerHTML = 'Accept';
    }

    queueItemButton.appendChild(itemTextButton);

    // Delete button
    let queueItemDeleteButton = document.createElement('div');
    queueItemDeleteButton.className = 'queueItemButton'; // TODO change class name
    queueItemDeleteButton.setAttribute('onclick', 'deleteRequest(this)');

    let itemTextButton2 = document.createElement('p');
    itemTextButton2.className = 'buttonText';
    itemTextButton2.innerHTML = 'Delete';

    // append accept and delete button to buttons
    queueItemDeleteButton.appendChild(itemTextButton2);
    buttons.appendChild(queueItemButton);
    buttons.appendChild(queueItemDeleteButton);

    queueItem.appendChild(buttons);
    return queueItem;
}


function acceptRequest(id) {
    let slot = id.parentElement.parentElement;

    //move slot to seringQueue
    let serving = document.getElementsByClassName('servingQueue')[0];
    serving.appendChild(slot);
    slot.children[1].children[0].children[0].innerHTML = 'Done';
    slot.children[1].children[0].setAttribute('onclick', 'doneRequest(this)');

    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/accept", true);
    xhttp.setRequestHeader("acceptSlot", slotToString(slot));
    xhttp.send();
}

function doneRequest(id) {
    let slot = id.parentElement.parentElement;
    slot.remove();

    // send information about done request to server
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/done", true);
    xhttp.setRequestHeader("removeSlot", slotToString(slot));
    xhttp.send();
}

function deleteRequest(id) {
    let slot = id.parentElement.parentElement;
    slot.remove();

    // send information about done request to server
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/delete", true);
    xhttp.setRequestHeader("deleteSlot", slotToString(slot));
    xhttp.send();
}

function slotToString(element) {
    var str = "";
    var g = new RegExp("(?::\\s*)(.*)", "g");
    str += "navn=" + g.exec(element.children[0].children[0].innerHTML)[1] + "; ";
    g = new RegExp("(?::\\s*)(.*)", "g");
    str += "fag=" + g.exec(element.children[0].children[1].innerHTML)[1] + "; ";
    g = new RegExp("(?::\\s*)(.*)", "g");
    str += "bord=" + g.exec(element.children[0].children[2].innerHTML)[1];
    return str;
}




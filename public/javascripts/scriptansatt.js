function QueueSlot(navnIn, fagIn, bordNummerIn) {
  return {
    navn: navnIn,
    fag: fagIn,
    bordNummer: bordNummerIn
  }
}

var queue = [];
nrQueueItems = 0;

window.onload = function() {
    var socket = new WebSocket("ws://localhost:4000");
    socket.onmessage = function(event) {
      processSlotFromServer(event.data);
    };
    socket.onopen = function() {
        socket.send("REQ QUEUE"); 
    }
};


function createQueueItem(queueSlot, number) {
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

  let queueItemButton = document.createElement('div');
  queueItemButton.className = 'queueItemButton';
  queueItemButton.setAttribute('onclick','acceptRequest(this)');

  let itemTextButton = document.createElement('p');
  itemTextButton.className = 'itemText';
  itemTextButton.innerHTML = 'Accept';


  queueItemButton.appendChild(itemTextButton);
  queueItem.appendChild(queueItemButton);
  return queueItem;
}

function processSlotFromServer(data) {
  const processedData = JSON.parse(data);
  let queueSlot = new QueueSlot(processedData.navn, processedData.fag, processedData.bordnummer)
  queue.push(queueSlot);
  console.log('this is called');

  let queueItem = createQueueItem(queueSlot, nrQueueItems++);

  // Finally add the new element to the queue section
  let queueSection = document.getElementsByClassName('queueSection');
  queueSection[0].appendChild(queueItem);
}

function acceptRequest(id){
  //console.clear();
  let next = id.parentElement;
  let serving = document.getElementsByClassName('serving')[0];
  serving.appendChild(next);
  next.children[1].children[0].innerHTML = 'Done';
  next.children[1].setAttribute('onclick','doneRequest(this)')
}

function doneRequest(id) {
  let done = id.parentElement;
  done.remove();
}




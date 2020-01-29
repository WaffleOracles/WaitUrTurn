function QueueSlot(navnIn, fagIn, bordNummerIn) {
  return {
    navn: navnIn,
    fag: fagIn,
    bordNummer: bordNummerIn
  }
}

var queue = [];

window.onload = function() {
    var socket = new WebSocket("ws://localhost:4000");
    socket.onmessage = function(event) {
      processSlotFromServer(event.data);
    }
    socket.onopen = function() {
        socket.send("REQ QUEUE"); 
    }
};


function processSlotFromServer(data) {
  const processedData = JSON.parse(data);
  queue.push(new QueueSlot(processedData.navn, processedData.fag, processedData.bordnummer));
  console.log('this is called');


  let queueitem = document.createElement('div');
  queueitem.className = 'queueitem';

  let queueitemtext = document.createElement('div');
  queueitemtext.className = 'queueitemtext';

  let itemtextnavn = document.createElement('p');
  let itemtextfag = document.createElement('p');
  let itemtextbord = document.createElement('p');
  itemtextnavn.className = 'itemtext';
  itemtextfag.className = 'itemtext';
  itemtextbord.className = 'itemtext';
  itemtextnavn.innerHTML = 'Navn: ' + processedData.navn;
  itemtextfag.innerHTML = 'Fag: ' + processedData.fag;
  itemtextbord.innerHTML = 'Bord nummer: ' + processedData.bordnummer;

  queueitemtext.appendChild(itemtextnavn);
  queueitemtext.appendChild(itemtextfag);
  queueitemtext.appendChild(itemtextbord);
  queueitem.appendChild(queueitemtext);

  let queueitembutton = document.createElement('div');
  queueitembutton.className = 'queueitembutton';
  
  let itemtextButton = document.createElement('p');
  itemtextButton.className = 'itemtext';
  itemtextButton.innerHTML = 'Accept';

  queueitembutton.appendChild(itemtextButton);
  queueitem.appendChild(queueitembutton);

  // Finally add the new element to the queue section
  let queueSection = document.getElementsByClassName('queuesection');
  queueSection[0].appendChild(queueitem);
}






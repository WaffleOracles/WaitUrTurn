var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var Queue = require('./queue')
var QueueSlot = require('./queueSlot')
var websocket = require("ws");
var http = require("http");


var app = express();
var queue = new Queue();

// Add example queue sloits here for testing
queue.addQueueSlot(new QueueSlot('Vetle', 'Inf140', '7'));
queue.addQueueSlot(new QueueSlot('Lars', 'MNF130', '8'));
queue.addQueueSlot(new QueueSlot('Mathias', 'INF100', '9'));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// get setup
app.get('/', function (req, res, next) {
    res.render('student', {title: 'IO'});
});

app.get('/waiting', function (req, res, next) {
    var navn = req.query.navn;
    var fag = req.query.fag;
    var bordnummer = req.query.bordnummer;

    queue.addQueueSlot(new QueueSlot(navn, fag, bordnummer));
    queue.queueArray.forEach(slot => console.log(slot));

    var number = queue.getNumberInQueue();
    //var msg = 'Du er nummer ' + number + ' i køen.';
    var msg = number;
    res.render('waiting', {message: msg});

});

app.get('/ansatt', function (req, res, next) {
    res.render('ansatt');
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// Websockets
var server = http.createServer(app);
const wss = new websocket.Server({server});
var websocketConnections = {};
var connectionID = 0;

wss.on("connection", function connection(ws) {

    let connection = ws;
    connection.id = connectionID++;
    websocketConnections[connection.id]

    connection.on("message", function incoming(message) {


        if (message === "REQ QUEUE") {
            // Send queue items to user here
            console.log("Sending queue items")

            queue.queueArray.forEach(slot => connection.send(JSON.stringify(slot)));
        }
    });
});


server.listen(4000);
module.exports = app;

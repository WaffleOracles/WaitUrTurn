var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var Queue = require('./queue')
var QueueSlot = require('./queueSlot');
var websocket = require("ws");
var http = require("http");


var app = express();
var queue = new Queue();
var serving = new Queue();
var done = new Queue();

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
    res.render('front');
});

function getCookie(name, cookie) {
    var regexp = new RegExp("(?:^" + name + "|;\\s*" + name + ")=(.*?)(?:;|$)", "g");
    var result = regexp.exec(cookie);
    return (result === null) ? null : result[1];
}

app.get('/student', function (req, res, next) {

    let cookie = req.header("cookie");
    let slot = new QueueSlot(getCookie("navn", cookie), getCookie("fag", cookie), getCookie("bord", cookie));
    let date = new Date(getCookie("expires", cookie));

    // check if the cookie is expired, meaning slot is served or deleted
    // or check if user does not have a slot waiting or being served
    if (date < Date.now() || queue.get(slot) < 0 || serving.get(slot)<0)
        res.render('student', {title: 'IO'});
    else {
        if(queue.get(slot)>=0)
            res.render('waiting', {message: queue.get(slot) + 1});
        else res.render('waiting', {message: 0});
    }
});


app.get('/waiting', function (req, res, next) {
    let cookie = req.header("cookie");
    let slot = new QueueSlot(getCookie("navn", cookie), getCookie("fag", cookie), getCookie("bord", cookie));
    let date = new Date(getCookie("expires", cookie));
    if(date<Date.now()){
        // expired cookie, return start page
        res.render('front');
    }else if (done.get(slot)>=0){
        res.render('front');
    }else if(queue.get(slot)>=0){
        // if in queue
        res.render('waiting', {message: queue.get(slot) + 1});
    }else if(serving.get(slot)>=0){
        // if being served
        res.render('waiting', {message: 0});
    }else {
        // if cookie is not expired (student must set cookie before requesting wait page)
        // add to queue
        queue.addQueueSlot(slot);
        queue.queueArray.forEach(slot => console.log(slot));
        res.render('waiting', {message: queue.get(slot) + 1});
    }

});

app.get('/ansatt', function (req, res, next) {
    res.render('ansatt');
});

app.post('/done', function (req, res) {
    slotToRemove = req.header("removeSlot");
    let slot = new QueueSlot(getCookie("navn", slotToRemove), getCookie("fag", slotToRemove), getCookie("bord", slotToRemove));
    if(serving.get(slot)>=0){
        serving.remove(slot);
        done.addQueueSlot(slot);
    }
    res.send("registered done with request!");
});

app.post('/delete', function(req,res){
    slotToDelete = req.header("deleteSlot");
    let slot = new QueueSlot(getCookie("navn", slotToDelete), getCookie("fag", slotToDelete), getCookie("bord", slotToDelete));
    if(queue.get(slot)>=0){
        queue.remove(slot);
    }
    if(serving.get(slot)>=0){
        serving.remove(slot);
    }
    res.send("deleted");
    // cookie for this slot must be set to expired.
});

app.post('/accept', function(req,res){
    slotToAccept = req.header("acceptSlot");
    let slot = new QueueSlot(getCookie("navn", slotToAccept), getCookie("fag", slotToAccept), getCookie("bord", slotToAccept));
    if(queue.get(slot)>=0){
        queue.remove(slot);
        serving.addQueueSlot(slot);
    }
    res.send("accepted");
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
        if (message === "REQ WAITING QUEUE") {
            // Send queue items to user here
            console.log("Sending waiting queue items");
            const queueJSON = "{\"waiting\":" + JSON.stringify(queue.queueArray) + "}";
            connection.send(queueJSON);
        }
        if(message === "REQ SERVING QUEUE"){
            // Send queue items to user here
            console.log("Sending serving queue items");
            const queueJSON = "{\"serving\":" + JSON.stringify(serving.queueArray) + "}";
            connection.send(queueJSON);
        }
    });
});


server.listen(4000);
module.exports = app;

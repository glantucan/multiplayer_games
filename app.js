const express = require('express');

const app = express();
const http = require('http').createServer(app);


// ROUTES
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});


// Serve any requested files from the client folder (for example the images used on index.html)
app.use('/client', express.static(__dirname + '/client'));

var server_port = process.env.PORT || 2000

http.listen(server_port, function() {
    console.log('Listening on port', server_port, '...');
});


// Socket multiplexing:
const io = require('socket.io')(http, {});
var test = require('./server/test/TestServer.js')(io.of('/test'));
var test2 = require('./server/test/Test2Server.js')(io.of('/test2'));
var test2 = require('./server/snake/SnakeServer.js')(io.of('/snake'));


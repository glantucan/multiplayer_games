const express = require('express');

const app = express();
const http = require('http').createServer(app);


// ROUTES
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

app.get('/test', function (req, res) {
    
    res.sendFile(__dirname + '/client/test.html');
});

// Serve any requested files from the client folder (for example the images used on index.html)
app.use('/client', express.static(__dirname + '/client'));

var server_port = process.env.PORT || 2000

http.listen(server_port, function() {
    console.log('Listening on port', server_port, '...');
});


var testGame = require('./server/test/TestServer.js')(http);
/* testGame(http); */
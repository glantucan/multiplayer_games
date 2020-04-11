
const Player = require('./TestPlayer.js');
const SocketList = require('../SocketList.js');

var socketList = SocketList();
var playerList = [];
var lastId = 0;

function testServer(http) {
    const io = require('socket.io')(http, {});
    var test = io
    .of('/test')
    .on('connection', function(socket) {
        console.log('socket connected');
        
        socketList.push(socket);

        socket.on( 'join-game', 
            function (data) {

                var connectedPlayer = Player(data.name, socket);
                socket.emit('joined', connectedPlayer.id);
                playerList.push(connectedPlayer);
                socketList.clientLog(data.name + ' joined the game');
                
                socketList.dispatch('players-list-update', playerList.map(
                    player => ({
                        name: player.name,
                        id: player.id,
                    })
                ));
                
                socket.on('disconnect', disconnect);
                socket.on('leave-game', leaveGame);
                socket.on('key-press', onKeyPress);

                function onKeyPress(data) {
                    if (connectedPlayer.id === data.playerId) {   
                        if (      data.inputId === 'left') {
                            connectedPlayer.pressingLeft = data.state;
                        }
                        else if ( data.inputId === 'right') {
                            connectedPlayer.pressingRight = data.state;
                        }
                        else if ( data.inputId === 'down') {
                            connectedPlayer.pressingDown = data.state;
                        }
                        else if ( data.inputId === 'up') {
                            connectedPlayer.pressingUp = data.state;
                        } 
                    }
                }

                function leaveGame() {
                    playerList = playerList.filter( (p) => p !== connectedPlayer );
                    socketList.dispatch('players-list-update', playerList.map(
                        player => ({
                            name: player.name,
                            id: player.id,
                        })
                    ));
                    socketList.clientLog(connectedPlayer.name + ' is leaving the game');
                }

                function disconnect() {
                    leaveGame();
                    socketList.remove(socket);
                }
            }
        ); 
        socketList.clientLog('socket connection registered for anonymous watcher');
        
    });
    return test;
}

setInterval(function() {
    var playersUpdate = [];
    playersUpdate = playerList.map( function(currentPlayer) {
        currentPlayer.updatePosition();
        
        return {
            id: currentPlayer.id,
            x: currentPlayer.getX(),
            y: currentPlayer.getY()
        };
    });
    socketList.dispatch('new-position',playersUpdate);

}, 1000/25); //25 frames per second

module.exports = testServer;
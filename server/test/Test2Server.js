const SocketList = require('../SocketList.js');

var socketList = SocketList();
var playersList = [];
var inputActionsQueue = [];
var lastId = 0;

function test2Server(socketNamespace) {
    socketNamespace.on('connection', function(socket) {

        socketList.push(socket);
        socketList.clientLog('socket connection registered for anonymous watcher');

        socket.on( 'join-game', 
            function (data) {

                var playerData = {
                    id: lastId++,
                    name: data.name
                };
                playersList.push(playerData);

                // Return player id to player client
                socket.emit('joined', { 
                    playerData, 
                    serverPlayersList: playersList } );

                // Comunicate other clients that this player joined (updates playersList)
                socket.broadcast.emit('another-player-joined', playerData);

                socketList.clientLog(playerData.name + ' joined the game');

                // Update DOM playersList
                socketList.dispatch('players-list-update', playersList);
                
                socket.on('disconnect', disconnect);
                socket.on('leave-game', leaveGame);
                socket.on('input-key-event', onKeyboardEvent);

                function onKeyboardEvent(data) {
                    inputActionsQueue.push({
                        playerId: data.playerId,
                        actionId: data.actionId,
                        state: data.state,
                    });
                }

                function leaveGame({playerId, name}) {
                    var newPlayersList = playersList.filter( (p) => p.id !== playerId );
                    socketList.dispatch('a-player-left', {playerId, name});
                    socketList.dispatch('players-list-update', newPlayersList.map(
                        player => ({
                            name: player.name,
                            id: player.id,
                        })
                    ));
                    socketList.clientLog(name + ' is leaving the game');
                    console.log(name + ' is leaving the game')
                }

                function disconnect() {
                    leaveGame();
                    socketList.remove(socket);
                }
            }
        ); 
        
    });
    return socketNamespace;
}


/// Game loop
//
setInterval(function() {
    socketList.dispatch('game-loop-step', inputActionsQueue);
    inputActionsQueue = [];

}, 1000/25); //25 frames per second

module.exports = test2Server;
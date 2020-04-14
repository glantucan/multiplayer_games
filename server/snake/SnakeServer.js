const { performance } = require('perf_hooks');
const SnakePlayer = require('./SnakePlayer.js');
const SocketList = require('../SocketList.js');
const SnakeWorld = require('./SnakeWorld.js');

var gameLoop;
var socketList = SocketList();
var playerList = [];
var lastId = 0;
var snakeWorld;

/**
 * Creates the snake game server app.
 * @param {Server} socketNamespace namespaced (by using io.of() server to use 
 * in this game)
 */
function createSnakeServer(socketNamespace) {
    socketNamespace.on('connection', function(socket) {
        socketList.push(socket);
        socketList.clientLog('socket connection registered for anonymous watcher');

        
        socket.on( 'join-game', function onPlayerJoining(playerData) { 

            if (!snakeWorld) snakeWorld = SnakeWorld();
            if (!gameLoop) gameLoop = createGameLoop(10, update);

            managePlayerComunications(playerData, socket) ;
        });
    });

}

/**
 * Creates a player and sets up listeners for client socket events related 
 * to that player
 * @param {*} playerData 
 * @param {*} socket 
 */
function managePlayerComunications(playerData, socket) {
    
    var connectedPlayer = SnakePlayer({ 
        ...playerData,
        id: lastId++,
        snakeWorld,
        startConfIdx: playerList.length
    });
    playerList.push(connectedPlayer);
    
    socket.emit('joined', connectedPlayer.id);

    socketList.clientLog(playerData.name + ' joined the game');

    socketList.dispatch('players-list-update', playerList.map(
        player => ({
            name: player.getName(),
            id: player.getId(),
        })
    ));


    socket.on('disconnect', (data) => disconnect(data, socket, connectedPlayer) );
    socket.on('leave-game', (data) => leaveGame(data, connectedPlayer) );
    socket.on('input-key-event', connectedPlayer.onInputEvent);

}


/**
 * Makes a player leave the game and notifies the rest of the clients
 * 
 * @param {*} data 
 * @param {*} player 
 */
function leaveGame(data, player) {
    playerList = playerList.filter( (p) => p !== player );
    
    socketList.dispatch('players-list-update', playerList.map(
        player => ({
            name: player.getName(),
            id: player.getId(),
        })
    ));

    socketList.clientLog(player.getName() + ' is leaving the game');
    
    if (playerList.length === 0) {
        snakeWorld.destroy();
        snakeWorld = null;
        clearInterval(gameLoop);
        gameLoop = null;
    }
    player.destroy();
}


/**
 * Loose a client socket (When connection is lost)
 * 
 * @param {*} data 
 * @param {*} socket 
 * @param {*} player 
 */
function disconnect(data, socket, player) {
    if (player) leaveGame(player);
    socketList.remove(socket);
}



function createGameLoop(frameRate, updateCallback) {

    var previousTime = performance.now();
    var frameCount = 0;

    var interval = setInterval(function() {

        currentTime = performance.now();
        var timeElapsed = currentTime - previousTime;
        previousTime = currentTime;

        frameCount++;

        updateCallback(frameCount, timeElapsed);

    }, 1000/frameRate);

    return interval;
}



function update(frameCount, timeElapsed) {
    var playersUpdate = [];
        playersUpdate = playerList.map( function(currentPlayer) {
            currentPlayer.update(frameCount, timeElapsed);
            
            return {
                id: currentPlayer.getId(),
                x: currentPlayer.getX(),
                y: currentPlayer.getY(),
                tail: currentPlayer.getTail(),
            };
        });
        snakeWorld.update(frameCount, timeElapsed);
        socketList.dispatch('new-position',playersUpdate);
        
}


module.exports = createSnakeServer;
const { performance } = require('perf_hooks');
const SocketList = require('../SocketList.js');
const SnakeWorld = require('./SnakeWorld.js');
const SnakePlayer = require('./SnakePlayer.js');
const SnakePlayerList = require('./SnakePlayerList.js');
const SnakeCollisions = require('./SnakeCollisions.js');

var gameLoop;
var socketList = SocketList();
var playersList = SnakePlayerList();
var lastId = 1;
var snakeWorld;
var collisionChecker;
var otherColliders = [];

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

            if (!snakeWorld) {
                snakeWorld = SnakeWorld();
                collisionChecker = SnakeCollisions(snakeWorld, otherColliders);
                playersList.collisionChecker = collisionChecker
            }

            if (!gameLoop) gameLoop = createGameLoop(3, update);

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
        startConfIdx: playersList.length,
        collisionChecker
    });
    playersList.push(connectedPlayer);
    
    socket.emit('joined', connectedPlayer.id);

    socketList.clientLog(playerData.name + ' joined the game');

    socketList.dispatch('players-list-update', playersList.list.map(
        player => ({
            name: player.getName(),
            id: player.getId(),
        })
    ));


    socket.on('disconnect', (data) => disconnect( socket, connectedPlayer) );
    socket.on('leave-game', (data) => leaveGame( connectedPlayer) );
    socket.on('input-key-event', connectedPlayer.onInputEvent);

}



/**
 * Makes a player leave the game and notifies the rest of the clients
 * 
 * @param {*} data 
 * @param {*} player 
 */
function leaveGame(player) {
    players = playersList.list.filter( (p) => p !== player );
    
    socketList.dispatch('players-list-update', players.map(
        player => ({
            name: player.getName(),
            id: player.getId(),
        })
    ));

    socketList.clientLog(player.getName() + ' is leaving the game');
    
    if (players.length === 0) {
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
function disconnect( socket, player) {
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

function _onHeadHeadColision(dyingPlayers) {
    socketList.dispatch('players-dead', dyingplayers.list.map( p => p.getId()));
}

function _onHeadTailColision(dyingPlayer, otherPlayer) {
    socketList.dispatch('players-dead', [dyingPlayer.getId()]);
}

function update(frameCount, timeElapsed) {
    var updateData = {
        playersData: playersList.update(frameCount, timeElapsed),
        ...snakeWorld.update(frameCount, timeElapsed),
    } 
    console.log(updateData);
    socketList.dispatch('update', updateData);
        
}


module.exports = createSnakeServer;
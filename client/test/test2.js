import inputKeys from '/client/utils/InputKeys.js';
import KeyCodes from '/client/utils/KeyCodes.js';
import Player from '/client/test/ClientPlayer.js';


const ctx = document.getElementById("ctx").getContext("2d");
const playerNameField = document.getElementById("playerName");
const playBtn = document.getElementById("playBtn");
const leaveBtn = document.getElementById("leaveBtn");
const domPlayersList = document.getElementById("playersList");


var playersList = [];
var playerId;
var playerName;

playerNameField.addEventListener('input',
    function() {
        if(playerNameField.value.length > 0) {
            playBtn.disabled = false;
        } else {
            playBtn.disabled = true;
        }
    }
);

playBtn.addEventListener('click', 
    () => {
        leaveBtn.hidden = false;
        playBtn.hidden = true;
        playerNameField.disabled = true;
        socket.emit('join-game', { name: playerNameField.value} );
    }
);

leaveBtn.addEventListener('click', 
    () => {
        leaveBtn.hidden = true;
        playBtn.hidden = false;
        playerNameField.disabled = false;
        socket.emit('leave-game', {
            playerId,  
            name: playersList.find( p => p.getId() === playerId ).name
        });
    }
);

ctx.font = '30px Arial';

var socket = io.connect('/test2');


/// Listen for server messages
//
socket.on('joined', function ( {playerData, serverPlayersList} ) {
    playersList = serverPlayersList.map( pData => Player(pData) );
    playerId = playerData.id;  
});

socket.on('another-player-joined', function(playerData) {
    playersList.push(Player(playerData));
});
socket.on('a-player-left', function(playerData) {
    playersList = playersList.filter( p => p.getId() !== playerData.playerId );
});

// This only updates the players list on the DOM
socket.on('players-list-update', function(data) {
    Array.from(domPlayersList.children).forEach(child => domPlayersList.removeChild(child));
    data.forEach(function(playerData) {
        var playerNode = document.createElement('p');
        playerNode.id = 'player_' + playerData.id;
        playerNode.innerHTML = '<strong>' + playerData.id + '</strong>: ' +
        playerData.name;
        domPlayersList.appendChild(playerNode);
    });

});

socket.on('server-message', (message) => {
    //console.log(message);
    log(message);
});



socket.on('game-loop-step', function(actionsQueue) {
    actionsQueue.forEach( function processActionsQueue(action) {
        var player = playersList.find( 
            player => player.getId() === action.playerId 
        );
        player.actions[action.actionId](action.state);
    });

    ctx.clearRect(0,0,500,500);
    
    playersList.forEach( function(player) {
        player.update();
        ctx.fillText(player.getId(), player.getX(), player.getY());
    });

});



//// Keyboard control
//
function onKeyEvent(inputData) {
    socket.emit('input-key-event', { 
        actionId: inputData.actionId, 
        state: inputData.pressed, 
        playerId
    });
}

inputKeys.addKey('moveDown',    [KeyCodes.DOWN,     KeyCodes.S], onKeyEvent );
inputKeys.addKey('moveUp',      [KeyCodes.UP,       KeyCodes.W], onKeyEvent );
inputKeys.addKey('moveLeft',    [KeyCodes.LEFT,     KeyCodes.A], onKeyEvent );
inputKeys.addKey('moveRight',   [KeyCodes.RIGHT,    KeyCodes.D], onKeyEvent );

inputKeys.activate();
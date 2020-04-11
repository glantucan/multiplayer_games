import inputKeys from '/client/utils/InputKeys.js';
import KeyCodes from '/client/utils/KeyCodes.js';



const ctx = document.getElementById("ctx").getContext("2d");
const playerNameField = document.getElementById("playerName");
const playBtn = document.getElementById("playBtn");
const leaveBtn = document.getElementById("leaveBtn");
const playersList = document.getElementById("playersList");

var playerId;
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
        socket.emit('leave-game', { name: playerNameField.value} );
    }
);

ctx.font = '30px Arial';

var socket = io.connect('/test');


/// Listen for server messages
//
socket.on('joined', (id) => playerId = id);

socket.on('new-position', function(data) {
    ctx.clearRect(0,0,500,500);
    data.forEach( function (playerData) {
        ctx.fillText(playerData.id, playerData.x, playerData.y);
    });
});

socket.on('server-message', (message) => {
    //console.log(message);
    log(message);
});


socket.on('players-list-update', function(data) {
    Array.from(playersList.children).forEach(child => playersList.removeChild(child));
    data.forEach(function(playerData) {
        var playerNode = document.createElement('p');
        playerNode.id = 'player_' + playerData.id;
        playerNode.innerHTML = '<strong>' + playerData.id + '</strong>: ' +
        playerData.name;
        playersList.appendChild(playerNode);
    });
});

//// Keyboard control
//
function onKeyEvent(key) {
    socket.emit('input-key-event', { 
        actionId: key.id, 
        state: key.pressed, 
        playerId
    });
}

inputKeys.addKey('DOWN',    [KeyCodes.DOWN,     KeyCodes.S], onKeyEvent );
inputKeys.addKey('UP',      [KeyCodes.UP,       KeyCodes.W], onKeyEvent );
inputKeys.addKey('LEFT',    [KeyCodes.LEFT,     KeyCodes.A], onKeyEvent );
inputKeys.addKey('RIGHT',   [KeyCodes.RIGHT,    KeyCodes.D], onKeyEvent );

inputKeys.activate();
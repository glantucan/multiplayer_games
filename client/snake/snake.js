import inputKeys from '/client/utils/InputKeys.js';
import KeyCodes from '/client/utils/KeyCodes.js';
import Canvas from '/client/utils/CanvasHelper.js';

const ctx = document.getElementById("ctx").getContext("2d");
const playerNameField = document.getElementById("playerName");
const playBtn = document.getElementById("playBtn");
const leaveBtn = document.getElementById("leaveBtn");
const playersList = document.getElementById("playersList");

var canvas = Canvas(ctx);

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

var socket = io.connect('/snake');



/// Listen for server messages
//
socket.on('joined', (id) => playerId = id);

var playerColors = [
    'black',
    '#836792',
    '#54912F',
    '#6C7AF3','#EA8588'
]
socket.on('update', function (data) {
    renderPlayers(data.playersData);
    killPlayers(data.dead);
    renderFruits(data.fruits);
})

function renderPlayers (players) {
    ctx.clearRect(0,0,500,500);
    players.forEach( function (playerData) {
        
        playerData.color = playerColors[playerData.id];
        canvas.drawRectangle(
            playerData.x + 1, 
            playerData.y + 1, 
            8, 8, 
            playerData.color, 
            playerData.color, 
            2
        );

        playerData.tail.forEach( function (cell) {
            canvas.drawRectangle(
                cell.x + 1, 
                cell.y + 1, 
                8, 8, 
                playerData.color, 
                playerData.color, 
                2
            );
        })
        //ctx.fillText(playerData.id, playerData.x, playerData.y);
    });
}

function killPlayers(dead) {
    if (dead.length) log(dead);
}

function renderFruits(fruits) {

}


socket.on('new-position', function(data) {
    
});

socket.on('server-message', (message) => {
    //console.log(message);
    log(message);
});


socket.on('players-list-update', function(data) {
    Array.from(playersList.children)
        .forEach( child => playersList.removeChild(child) );
        
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
        actionId: key.actionId, 
        state: key.pressed, 
        playerId
    });
}

inputKeys.addKey('turnLeft',    [KeyCodes.LEFT,     KeyCodes.A], onKeyEvent );
inputKeys.addKey('turnRight',   [KeyCodes.RIGHT,    KeyCodes.D], onKeyEvent );

inputKeys.activate();
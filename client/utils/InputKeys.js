import KeyCodes from '/client/utils/KeyCodes.js';

var keys = {};
var keyIds = [];


function addKey(actionId, codes, callback) {
    keyIds.push(actionId);
    keys[actionId] = {
        actionId,
        keyCodes: codes,
        keyNames: Object.keys(KeyCodes)
            .filter( key =>  codes.includes(KeyCodes[key]) ),
        pressed: false, 
        callback
    };
}

function activate() {
    document.addEventListener('keydown', _onKeyDown);
    document.addEventListener('keyup', _onKeyUp);

}

function deactivate() {
    document.removeEventListener('keydown', _onKeyDown);
    document.removeEventListener('keyup', _onKeyUp);

}

function _onKeyDown(e) {
    // Avoid page scrolling with space and arrow keys
    if([32, 37, 38, 39, 40].includes(e.keyCode)) {
        e.preventDefault();
    }
    keyIds.forEach( function(id) {
        keys[id].keyCodes.forEach( function(keyCode) {
            if (e.keyCode === keyCode) {
                keys[id].pressed = true;
                keys[id].callback(keys[id]);
            }
        });
    });
}

function _onKeyUp(e) {
    keyIds.forEach( function(id) {
        keys[id].keyCodes.forEach( function(keyCode) {
            if (e.keyCode === keyCode) {
                keys[id].pressed = false;
                keys[id].callback(keys[id]);
            }
        });
    });
}

export default {addKey, activate, deactivate};
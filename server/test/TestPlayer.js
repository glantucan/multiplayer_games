var playerList = [];
var socketList = [];
var lastId = 0;

const Player = function (name, socket) {
    var x = 250;
    var y = 250;
    var accel = 3;
    var friction = 1.2;
    var maxSpeed = 10;
    var vx = 0;
    var vy = 0;
    var pressingRight = false;
    var pressingLeft =  false;
    var pressingUp = false;
    var pressingDown = false;

    function updatePosition () {
        if ( pressingRight ) {
            vx += vx <= maxSpeed ? accel : 0;
        } 
        else if ( pressingLeft ) {
            vx -= vx >= -maxSpeed ? accel : 0;
        } 
        else if ( vx !== 0 ) {
            vx = vx / friction;
            if ( vx > -0.2 && vx < 0.2) {
                vx = 0;
            }
        }

        if ( pressingUp ) {
            vy -= vy >= -maxSpeed ? accel : 0;
        } 
        else if ( pressingDown ) {
            vy += vy <= maxSpeed ? accel : 0;
        } 
        else if ( vy !== 0) {
            vy = vy / friction;
            if ( vy > -0.1 && vy < 0.1) {
                vy = 0;
            }
        }
        
        x += vx;
        y += vy;
        //console.log(me.name, vx, vy, x, y)

    }

    return {
        id: lastId++, 
        socket,
        name,
        getX() { return x; },
        getY() { return y; },
        set pressingRight(val) { pressingRight = val; },
        set pressingLeft(val) { pressingLeft = val; },
        set pressingUp(val) { pressingUp = val; },
        set pressingDown(val) { pressingDown = val; },
        updatePosition
    };
}


module.exports = Player;
var playerList = [];
var socketList = [];
var lastId = 0;

const Player = function (playerData) {
    var {
        name, 
        id } = playerData;

    var x = 250;
    var y = 250;
    var accel = 3;
    var friction = 1.2;
    var maxSpeed = 10;
    var vx = 0;
    var vy = 0;
    var moveRight = false;
    var moveLeft =  false;
    var moveUp = false;
    var moveDown = false;

    function update() {
        if ( moveRight ) {
            vx += vx <= maxSpeed ? accel : 0;
        } 
        else if ( moveLeft ) {
            vx -= vx >= -maxSpeed ? accel : 0;
        } 
        else if ( vx !== 0 ) {
            vx = vx / friction;
            if ( vx > -0.2 && vx < 0.2) {
                vx = 0;
            }
        }

        if ( moveUp ) {
            vy -= vy >= -maxSpeed ? accel : 0;
        } 
        else if ( moveDown ) {
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
        getId() { return id; }, 
        getX() { return x; },
        getY() { return y; },
        actions: {
            moveRight(val) { moveRight = val; },
            moveLeft(val) { moveLeft = val; },
            moveUp(val) { moveUp = val; },
            moveDown(val) { moveDown = val; },
        },
        update
    };
}


export default Player;
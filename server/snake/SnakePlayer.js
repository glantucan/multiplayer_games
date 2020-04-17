/**
 * 
 * @param {*} data 
 * @param {*} snakeWorld 
 */
function SnakePlayer( data, snakeWorld ) {
    var { 
        name,
        id,
        snakeWorld, 
        startConfIdx,
        collisionChecker,
        movingAngle = 0 } = data;
    
    var { 
        x, 
        y, 
        movingAngle, 
        tail }  = __getStartConfiguration(startConfIdx, snakeWorld);
    
    var vx; 
    var vy;
    var alive = true;

    var actions= {
        turnRight(val) { 
            movingAngle = val ? movingAngle + 90 : movingAngle; 
        },
        turnLeft(val) {
            movingAngle = val ? movingAngle - 90 : movingAngle; 
        }       
    };

    var initialTailCells = 3;

    var tailPositions = [];
    for (let i = 0; i < initialTailCells; i++) {
        let tailCell = {
            x: x - snakeWorld.cellSize * (i + 1) * Math.cos( movingAngle * Math.PI / 180 ),
            y: y - snakeWorld.cellSize * (i + 1) * Math.sin( movingAngle * Math.PI / 180 )
        };
        collisionChecker.setColliderCell(tailCell.x, tailCell.y, id);
        tailPositions.push(tailCell);
    }
    collisionChecker.setColliderCell(x, y, id);


    function onInputEvent(data) {
       actions[data.actionId](data.state);
    }


    function update() {
        var { worldSize: s, cellSize } = snakeWorld;
        var lastTailCell = tailPositions[tailPositions.length - 1];
        collisionChecker.unsetColliderCell(lastTailCell.x, lastTailCell.y);
        
        tailPositions = tailPositions.map( 
            function (tailCell, idx, tail) {
                return snakeWorld.worldWrap(
                    idx ? tail[idx - 1].x : x,
                    idx ? tail[idx - 1].y : y,
                );
            }
        );
        vx = cellSize * Math.cos( movingAngle * Math.PI / 180 );
        vy = cellSize * Math.sin( movingAngle * Math.PI / 180 );
        x += vx;
        y += vy;
        
        ( {x, y} = snakeWorld.worldWrap(x, y) );
        collisionChecker.setColliderCell(x, y, id);
    }


    function destroy() {
        snakeWorld = null;
    }


    return {
        onInputEvent,
        getName() { return name },
        getId() { return id; }, 
        getX() { return x; },
        getY() { return y; },
        getVx() { return vx; },
        getVy() { return vy; },
        getTail() { return tailPositions},
        isAlive() { return alive; },
        kill() { alive = false },
        update,
        destroy
    };
}




function __getStartConfiguration(startId, world) {
    var { cellSize, worldSize } = world;
    var startConfigurations = [
        {
            x: cellSize * Math.floor( worldSize.w / 4 ),
            y: cellSize * Math.floor( worldSize.h / 4 ),
            movingAngle: 0,
        },
        {
            x: cellSize * Math.floor( 3 * worldSize.w / 4 ),
            y: cellSize * Math.floor( worldSize.h / 4 ),
            movingAngle: 90,
        },
        {
            x: cellSize * Math.floor( 3 * worldSize.w / 4 ),
            y: cellSize * Math.floor( 3 * worldSize.h / 4 ),
            movingAngle: 180,
        },
        {
            x: cellSize * Math.floor( worldSize.w / 4 ),
            y: cellSize * Math.floor( 3 * worldSize.h / 4 ),
            movingAngle: 270,
        },
    ];

    return startConfigurations[startId];

}


module.exports = SnakePlayer;
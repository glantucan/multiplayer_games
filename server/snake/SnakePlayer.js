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
        movingAngle = 0 } = data;
    
    var { 
        x, 
        y, 
        movingAngle, 
        tail }  = __getStartConfiguration(startConfIdx, snakeWorld);
    
        
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
        tailPositions.push({
            x: x - snakeWorld.cellSize * (i + 1) * Math.cos( movingAngle * Math.PI / 180 ),
            y: y - snakeWorld.cellSize * (i + 1) * Math.sin( movingAngle * Math.PI / 180 )
        });
    }
    console.log(tailPositions);
    function onInputEvent(data) {
       actions[data.actionId](data.state);
    }

    function update() {
        var { worldSize: s, cellSize } = snakeWorld;

        tailPositions = tailPositions.map( 
            function (tailCell, idx, tail) {
                return snakeWorld.worldWrap(
                    idx ? tail[idx - 1].x : x,
                    idx ? tail[idx - 1].y : y,
                );
            }
        );

        x += cellSize * Math.cos( movingAngle * Math.PI / 180 );
        y += cellSize * Math.sin( movingAngle * Math.PI / 180 );
        
        ( {x, y} = snakeWorld.worldWrap(x, y) );

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
        getTail() {return tailPositions},
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
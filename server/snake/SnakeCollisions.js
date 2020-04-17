/**
 * Checks for player collisions using the uniform grid algorithm
 * The world is divided in cells and its state ( 1: occupied, 0: empty)
 * is stored a colliders array and updated when a gameobject moves
 * 
 * Checkig for collisions comes down to calculating the cell index for the
 * game object position and checking whether its value is 0 or 1.
 * 
 * @param {*} world 
 */

function SnakeCollisions(world) {

    var { w, h } = world.worldSize;
    var cellSize = world.cellSize;
    var grid = new Array(w * h).fill(0);
    console.log({ w, h });
    console.log(grid);
    console.log(grid.length);

    function checkKillingCollisions(players) {
        collided = [];
        
        //console.log(grid.reduce( (acc, val, idx) => acc + (idx%w ? val : '\n'), ''));
        players.forEach(
            function (player) {
                var xCheck = player.getX() + player.getVx();
                var yCheck = player.getY() + player.getVy();
                ( {x: xCheck, y: yCheck} = world.worldWrap(xCheck, yCheck) );
                var playerCell =  __getColliderCellIdx(xCheck, yCheck, w, cellSize);
                if ( grid[playerCell] !== 0 ) {
                    player.kill();
                }
            }
        );
    }

    function setColliderCell(x, y, id) {
        grid[__getColliderCellIdx(x, y, w, cellSize)] = id;
        //console.log('Setting collider on:',__getColliderCellIdx(x, y, w, cellSize), 'to', id);
    }
    function unsetColliderCell(x, y) {
        grid[__getColliderCellIdx(x, y, w, cellSize)] = 0;
        //console.log('Un-setting collider on:',__getColliderCellIdx(x, y, w, cellSize));
    }

    /**
     * 
     * @param {Number} x world x position
     * @param {Number} y world y position
     * @param {Number} w world width in pixels
     * @param {Number} cs cell size in pixels
     */
    function __getColliderCellIdx(x, y, w, cs){
        return Math.floor( (x + y * w) / cs );
    }

    return {
        checkKillingCollisions,
        setColliderCell,
        unsetColliderCell
    }

}



module.exports = SnakeCollisions;
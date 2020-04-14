function SnakeWorld() {
    var cellSize = 10;
    var w = 50; // in cells
    var h = 50;
    var nextFruitFrame = Math.ceil(Math.random() * 50);

    function update(frame, elapsed) {

    }

    function worldWrap(x, y){
        if ( x >= cellSize * w )      x = 0;
        if ( x < 0 )                  x = cellSize * ( w - 1 );
        if ( y >= cellSize * h )      y = 0;
        if ( y < 0 )                  y = cellSize * ( h - 1 );
        return {x, y};
    }

    function computeCellPosition(position, shift) {

        // This doesn't work. When wrapping, we are getting bad positions because 
        // we should use the previous cell instead the head as reference.
        var {x, y} = position;
        var {x: sX, y: sY} = shift;
        var unWrappedPos = { 
            x: x + sX * cellSize,
            y: y + sY * cellSize
        };
        console.log(unWrappedPos)
        return worldWrap(unWrappedPos.x, unWrappedPos.y);
    }


    function destroy() {

    }

    return {
        get cellSize() { return cellSize; },
        get worldSize() { return {w, h}},
        update,
        computeCellPosition,
        worldWrap,
        destroy,
    }
}

module.exports = SnakeWorld;
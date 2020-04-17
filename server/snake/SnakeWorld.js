function SnakeWorld() {
    var cellSize = 10;
    var w = 50; // in cells
    var h = 50;
    var nextFruitFrame = Math.ceil(Math.random() * 50);

    function update(frame, elapsed) {

    }

    function worldWrap(x, y) {
        if ( x >= cellSize * w )      x = 0;
        if ( x < 0 )                  x = cellSize * ( w - 1 );
        if ( y >= cellSize * h )      y = 0;
        if ( y < 0 )                  y = cellSize * ( h - 1 );
        return {x, y};
    }


    function destroy() {

    }

    return {
        get cellSize() { return cellSize; },
        get worldSize() { return {w, h}},
        update,
        worldWrap,
        destroy,
    }
}

module.exports = SnakeWorld;
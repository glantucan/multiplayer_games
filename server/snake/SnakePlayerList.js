function SnakePlayerList(collisionChecker) {
    var players = [];
    var alivePlayers = [];
    
    function update(frameCount, timeElapsed) {
        console.log('\n-----------------------------------------------------------\n')
        
        // First update all alive player positions
        var ailvePlayers =  players.filter( p => p.isAlive() );
        ailvePlayers.forEach( p => p.update(frameCount, timeElapsed) );
        // Then check for collisions (only alive players)
        collisionChecker.checkKillingCollisions(alivePlayers);
        
        // Then generate update data for all players
        var playersUpdate = players.map( 
            function updatePlayerData(p) {
                return {
                    id: p.getId(),
                    x: p.getX(),
                    y: p.getY(),
                    tail: p.getTail(),
                    alive: p.isAlive(),
                };
            }
        );
        
        console.log(playersUpdate);
        return playersUpdate;
    }


    return {
        get list() { return players; },
        get length() { return players.length; },
        push (player) { 
            players.push(player);
            alivePlayers.push(player);
        },
        update,
        set collisionChecker(val) { collisionChecker = val; }
    }
}


module.exports = SnakePlayerList;
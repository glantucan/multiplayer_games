


function SocketList(maxSockets = 20) {
    var socketList = [];

    return {
        push,
        remove,
        clientLog,
        dispatch,
        get length() { return socketList.length }
    }


    function push(socket) {
        if (socketList.length < maxSockets) {
            socketList.push(socket);
            clientLog('Someone is having a look around.');
        } else {
            clientLog('Max number of sockets reached!');
        }
    }

    function remove(socket) {
        socketList = socketList.filter( (s) => s !== socket );
        clientLog('Someone decided to let go.')
    }

    function clientLog(message) {
        socketList.forEach( s => s.emit('server-message', message) );
    }

    function dispatch(event, data) {
        socketList.forEach( s => s.emit(event, data) );
    }
}

module.exports = SocketList;

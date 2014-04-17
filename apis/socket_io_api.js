var io = require('socket.io');

exports.start = function(server) {
    io.listen(server);
    io.on('connection', function(socket){
        socket.on('', function(data){
            //stuff
        }); 
    });
}
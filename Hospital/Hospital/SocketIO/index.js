var app = require('express')();
var http = require('http').Server(app);

app.get('/', function (req, res) {
    res.send('<h1>Hello world</h1>');
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});


var io = require('socket.io')(http);

//app.get('/', function (req, res) {
//    res.sendFile(__dirname + '/index.html');
//});

var allClients = [];

io.on('connection', function (socket) {
    console.log('a user connected with this args =>');
    //console.log(socket);
    //allClients.push(socket);

    socket.on('save sessionID', function (SessionID) {
        allClients.push({
            session : SessionID,
            connection: socket.id,
            socket:socket
        });

        console.log("connected clients now are =>");

        for (var i = 0; i < allClients.length; i++) {
            console.log("connection = "+allClients[i].connection + " opening for session => "+allClients[i].session)
        }
    });

    socket.on('chat message', function (obj) {
        console.log("(chat message) event fired from id = " + obj.id + " AND LAst message id = " + obj.LastMessageID);
        for (var i = 0; i < allClients.length; i++) {
            if (obj.id == allClients[i].session) {
                allClients[i].socket.emit('recieve message', { LastMessageID: obj.LastMessageID, OtherSideID: obj.CurrentSessionID });
                break;
            }
        }
    });

    socket.on('disconnect', function () {
        console.log('someone disconnect!');

        for (var i = 0; i < allClients.length; i++) {
            if (allClients[i].connection == socket.id) {
                allClients.splice(i, 1);
                break;
            }
        }
        //var i = allClients.indexOf(socket);
        //allClients.splice(i, 1);
    });

});


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('chat msg', (msg) => {
        io.emit('chat msg', msg);
        console.log('message: ' + msg);
     });
});

http.listen(3000, () => {
    console.log('The server is running');
});
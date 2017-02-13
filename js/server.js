'use strict';

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
  res.sendFile('index.html', { 'root': './' });
});

io.on('connection', function (socket) {
  console.log('a user connected');

  io.emit('user connected');

  socket.on('chat message', function (msg) {
    io.emit('chat message', msg);

    console.log('message: ' + msg);
  });

  socket.on('disconnect', function () {
    io.emit('user disconnected');

    console.log('user disconnected');
  });
});

http.listen(8080, function () {
  console.log('listening on *:8080');
});

'use strict';

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var default_name = "Anonymous";

var users = {};

app.get('/', function (req, res) {
  res.sendFile('index.html', { 'root': './' });
});

io.on('connection', function (socket) {
  console.log('Client Connected (ID: ' + socket.id + ').');

  users[socket.id] = {
    name: default_name
  };

  socket.emit('enter username');

  socket.on('username entered', function (_name) {
    users[socket.id] = {
      name: (_name !== '') ? _name : default_name
    };

    io.emit('user connected', users[socket.id].name);

    console.log('Client Set Username (ID: ' + socket.id + ', Name: ' + users[socket.id].name + ').');
  });

  socket.on('chat message', function (msg) {
    io.emit('chat message', users[socket.id].name, msg);

    console.log(users[socket.id].name + ": " + msg);
  });

  socket.on('disconnect', function () {
    io.emit('user disconnected', users[socket.id].name);

    console.log('Client Disconnected (ID: ' + socket.id + ', Name: ' + users[socket.id].name + ').');
  });
});

http.listen(8080, function () {
  console.log('listening on *:8080');
});

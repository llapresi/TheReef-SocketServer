const express = require('express');
const app = express();
const WebSocket = require('ws');
const UnityClient = require('./clients/unityClient');
const SocketEvents = require('./socket-events');
const AssignClientID = require('./utils/assign-clientid');

// Server port, 3000 for local testing, other stuff setup for Heroku
const port = process.env.PORT || 3000;

app.use(express.static('static'));

const server = app.listen(port, () => {
  console.log(`running on ${port}`);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', socket => {
  // Assign every client an id and log to console
  socket.clientID = AssignClientID.assignID();
  console.log(`new user with id ${socket.clientID} has connected`);

  // Tell unity client when phone connects 
  UnityClient.send({
    type: 'userConnect',
    id: socket.clientID
  });

  // Do on socket.on('message') stuff in another file
  SocketEvents.OnMessage(wss, socket);

  // Do socket.on('close') stuff in another file
  SocketEvents.OnClose(socket);
});
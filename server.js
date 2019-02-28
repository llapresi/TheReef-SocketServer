const express = require('express');
const app = express();
const WebSocket = require('ws');
const UnityClient = require('./clients/unityClient');
const SocketEvents = require('./socket-events');
const AssignClientID = require('./utils/assign-clientid');
const ForceSecure = require('./utils/redirectToSecure');

// Server port, 3000 for local testing, other stuff setup for Heroku
const port = process.env.PORT || 3000;

// Force https redirect if not in production
if(process.env.NODE_ENV !== 'development') {
  app.use(ForceSecure);
}

app.use(express.static('static'));

const server = app.listen(port, () => {
  console.log(`running on ${port}`);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', socket => {
  // Assign every client an id and log to console
  socket.clientID = AssignClientID.assignID();
  console.log(`new user with id ${socket.clientID} has connected`);

  // Tell the unity client that a client connects
  // If the Unity client doesn't exist or is the connecting client in question
  // This just does nothing
  UnityClient.send({
    type: 'userConnect',
    id: socket.clientID
  });

  // Attach socket.on('message') stuff to the newly connected socket
  SocketEvents.OnMessage(wss, socket);

  // Attach socket.on('close') stuff to the newly connected socket
  SocketEvents.OnClose(socket);
});
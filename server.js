const express = require('express');
const app = express();
const WebSocket = require('ws');
const UnityClient = require('./clients/unityClient');
const SendToClient = require('./clients/sendToClient');
const OnSocketMessage = require('./socket-handlers/onMessage');

// Server port, 3000 for local testing, other stuff setup for Heroku
const port = process.env.PORT || 3000;

app.use(express.static('static'));

const server = app.listen(port, () => {
  console.log(`running on ${port}`);
});

const wss = new WebSocket.Server({ server });

let counter = 0;

wss.on('connection', socket => {
  // Assign every client an id and log to console
  socket.clientID = counter;
  console.log(`new user with id ${socket.clientID} has connected`);
  counter+=1;

  // Tell unity client when phone connects 
  UnityClient.send({
    type: 'userConnect',
    id: socket.clientID
  });

  // Do on socket.on('message') stuff in another file
  OnSocketMessage(wss, socket);

  socket.on('close', () => {
    console.log(`user ${socket.clientID} has disconnected`);
    // Check to see if it was our UnityClient that disconnected
    UnityClient.checkForDisconnection(socket);
    // Send our disconnect message to the Unity client
    UnityClient.send({
      type: 'userDisconnect',
      id: socket.clientID
    });
  });
});
const express = require('express');
const app = express();
const WebSocket = require('ws');
const UnityClient = require('./unityClient');

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

  socket.on('message', data => {
    let parsedData = JSON.parse(data);

    // Read message from Unity client saying it's the Unity client
    UnityClient.checkForConnection(parsedData, socket);

    // Send rotate and fire messages to the Unity instance
    if(parsedData.type === 'rotate' || parsedData.type === 'fire') {
      wss.clients.forEach((client) => {
        if(client.readyState === WebSocket.OPEN && client.isUnity === true) {
          parsedData.id = socket.clientID;
          client.send(JSON.stringify(parsedData));
        }
      })
    }

    // Send returned target info messages to only specified user in parsedData ID
    if(parsedData.type === 'targetInfo') {
      wss.clients.forEach((client) => {
        if(client.readyState === WebSocket.OPEN && client.clientID === parsedData.userID) {
          client.send(data);
        }
      })
    }
  });

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
const express = require('express');
const app = express();
const WebSocket = require('ws');
const UnityClient = require('./unityClient');
const SendToClient = require('./sendToClient');

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
    // Parse the data to JSON and attach the server assigned client ID
    let parsedData = JSON.parse(data);
    parsedData.id = socket.clientID;

    // Switch based on our message type
    switch(parsedData.type) {
      case "isUnity":
        // Create UnityClient if we get an "isUnity" message
        UnityClient.createUnitySocket(socket);
        break;
      case "rotate":
      case "fire":
        // Send rotate and fire messages to the Unity instance
        UnityClient.send(parsedData);
        break;
      case "targetInfo":
            // Send returned target info messages to only specified user in parsedData (provided by Unity client)
        SendToClient(parsedData.userID, data);
        break;
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
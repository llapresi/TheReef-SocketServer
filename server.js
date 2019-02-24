const express = require('express');
const app = express();
const WebSocket = require('ws');

// Server port, 3000 for local testing, other stuff setup for Heroku
const port = process.env.PORT || 3000;

app.use(express.static('static'));

const server = app.listen(port, () => {
  console.log(`running on ${port}`);
});

const wss = new WebSocket.Server({ server });

let counter = 0;

wss.on('connection', socket => {
  // Assign every client an id
  socket.clientID = counter;
  console.log(`new user with id ${socket.clientID} has connected`);
  counter+=1;

  wss.clients.forEach((client) => {
    if(client.readyState === WebSocket.OPEN && client.isUnity === true) {
      let msg = {
        type: 'userConnect',
        id: socket.clientID
      };
      client.send(JSON.stringify(msg));
    }
  });

  socket.on('message', data => {
    let parsedData = JSON.parse(data);

    // Read message from Unity client saying it's the Unity client
    if(parsedData.type === 'isUnity') {
      socket.isUnity = true;
      console.log('Unity instance has connected');
    }


    // Broadcoast to all if this is a message
    if(parsedData.type === 'msg') {
      wss.clients.forEach((client) => {
        if(client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      })
    }

    // Send rotate and fire messages to the Unity instance
    if(parsedData.type === 'rotate' || parsedData.type === 'fire') {
      wss.clients.forEach((client) => {
        if(client.readyState === WebSocket.OPEN && client.isUnity === true) {
          parsedData.id = socket.clientID;
          client.send(JSON.stringify(parsedData));
        }
      })
    }

    // Send returned target info messages to all clients (for now)
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
    wss.clients.forEach((client) => {
      if(client.readyState === WebSocket.OPEN && client.isUnity === true) {
        let msg = {
          type: 'userDisconnect',
          id: socket.clientID
        };
        client.send(JSON.stringify(msg));
      }
    });
    
    });
});
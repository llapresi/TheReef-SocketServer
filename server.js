const app = require('express')();
const WebSocket = require('ws');

// Server port, 3000 for local testing, other stuff setup for Heroku
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const server = app.listen(port, () => {
  console.log(`running on ${port}`);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', socket => {
  console.log('someone has connected');
  
  socket.on('message', data => {
    let parsedData = JSON.parse(data);

    // Message setting is Unity
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
          client.send(data);
        }
      })
    }

    // Send returned target info messages to all clients (for now)
    if(parsedData.type === 'targetInfo') {
      wss.clients.forEach((client) => {
        if(client.readyState === WebSocket.OPEN && client.isUnity !== true) {
          client.send(data);
        }
      })
    }
  });
});
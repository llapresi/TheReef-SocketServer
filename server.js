const app = require('express')();
const WebSocket = require('ws');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

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

    // Broadcoast to all if this is a message
    if(parsedData.type === 'msg') {
      wss.clients.forEach((client) => {
        if(client.readyState === WebSocket.OPEN) {
          client.send(parsedData.text);
        }
      })
    }
  });
});
const WebSocket = require('ws');

module.exports = (clientID, data) => {
  wss.clients.forEach((client) => {
    if(client.readyState === WebSocket.OPEN && client.clientID === clientID) {
      client.send(data);
    }
  })
};
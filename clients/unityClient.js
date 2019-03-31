const WebSocket = require('ws');

let unitySocket;

const canSendMessage = () => unitySocket !== undefined && unitySocket.readyState === WebSocket.OPEN;

// On message with "isUnity" property set to true we store our Unity client
exports.createUnitySocket = (socket) => {
  const incomingSocket = socket;
  incomingSocket.isUnity = true;
  unitySocket = incomingSocket;
  console.log('Unity instance has connected');
};

// Clear our unitySocket variable if the current unity socket disconnects
exports.checkForDisconnection = (socket) => {
  if (socket === unitySocket) {
    unitySocket = undefined;
  }
};

exports.send = (msg) => {
  if (canSendMessage()) {
    unitySocket.send(JSON.stringify(msg));
  }
};

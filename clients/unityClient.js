const WebSocket = require('ws');

let unitySocket = undefined;

const canSendMessage = () => {
  return(unitySocket !== undefined && unitySocket.readyState === WebSocket.OPEN);
}

// On message with "isUnity" property set to true we store our Unity client
exports.createUnitySocket = (socket) => {
  socket.isUnity = true;
  unitySocket = socket;
  console.log('Unity instance has connected');
};

// Clear our unitySocket variable if the current unity socket disconnects
exports.checkForDisconnection = (socket) => {
  if(socket === unitySocket) {
    unitySocket = undefined;
  }
}

exports.send = (msg) => {
  if(canSendMessage()) {
    unitySocket.send(JSON.stringify(msg));
  };
};
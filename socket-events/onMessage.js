const UnityClient = require('../clients/unityClient');
const SendToClient = require('../clients/sendToClient');

module.exports = (wss, socket) => {
  socket.on('message', (data) => {
    // Parse the data to JSON and attach the server assigned client ID
    const parsedData = JSON.parse(data);
    parsedData.id = socket.clientID;

    // Switch based on our message type
    switch (parsedData.type) {
      case 'isUnity':
        // Create UnityClient if we get an 'isUnity' message
        UnityClient.createUnitySocket(socket);
        break;
      case 'rotate':
      case 'fire':
        // Send rotate and fire messages to the Unity instance
        UnityClient.send(parsedData);
        break;
      case 'targetInfo':
        // Send returned target info messages to only specified user in
        // parsedData (provided by Unity client)
        SendToClient(wss, parsedData.userID, data);
        break;
      default:
        console.log('parsedData.type not recognized');
        break;
    }
  });
};

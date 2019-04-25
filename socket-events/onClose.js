const UnityClient = require('../clients/unityClient');

module.exports = (socket) => {
  socket.on('close', () => {
    console.log(`user ${socket.clientID} has disconnected`);
    // Check to see if it was our UnityClient that disconnected
    UnityClient.checkForDisconnection(socket);
    // Send our disconnect message to the Unity client
    UnityClient.send({
      type: 'userDisconnect',
      id: socket.clientID,
    });
  });
};

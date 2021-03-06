/* global GyroNorm */

// NOT IMPORTING AS ITS BROKEN
// Have to manually import the 'complete' package for Gyronorm
// import GyroNorm from 'gyronorm';

// Use http or https depending on client (server autosets this to https so this is most for
// the sake of local development)
const socket = new WebSocket(`${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}`);

// For transitions
const defaultVal = '-300px';
const centerVal = '60px';
let isTransitioning = false;

// Animation classes


//Fade between buttons on press and release
function buttonPressed() {
    document.getElementById('grab').style.opacity = "0";
    document.getElementById('grabPressed').style.opacity ="1";
}

function buttonReleased() {
    document.getElementById('grab').style.opacity = "1";
    document.getElementById('grabPressed').style.opacity ="0";
}

const gn = new GyroNorm();

socket.onmessage = ((msg) => {
  // Parse the message
  const parsedMsg = JSON.parse(msg.data);
  console.log(parsedMsg);

  if (parsedMsg.type === 'targetInfo') {
    const trashCaught = parsedMsg.targetName;

  }

  //PLAYER COLOR CHANGED
  if (parsedMsg.type === 'playerColor') {
    //document.getElementById('fireButton').style.backgroundColor = `#${parsedMsg.hexColor}`;
    //document.getElementById('bgImg').src = `${parsedMsg.hexColor}.png`;
    console.log("COLOR RECIEVED: " + parsedMsg.hexColor);
    document.getElementById('bgImg').src = `./assets/${parsedMsg.hexColor}.png`;
    if (parsedMsg.hexColor == "") {
      document.getElementById('bgImg').src = `./assets/red.png`;
    }
  }
});

function sendMsg(data) {
  socket.send(JSON.stringify(data));
}

const args = {
  frequency: 33,
  orientationBase: GyroNorm.GAME,
};

gn.init(args).then(() => {
  gn.start((data) => {
    const msg = {
      type: 'rotate',
      x: data.do.beta,
      y: data.do.gamma,
      z: data.do.alpha,
    };
    sendMsg(msg);

    // Accelerations

    // Flick acceleration threshold
    // && data.dm.y > 10.0
    if (data.dm.z > 6.0) {
      const msg2 = {
        type: 'fire',
        held: false,
      };
      sendMsg(msg2);
      // infobox.innerHTML = 'x: ' + data.dm.x + '\ny: ' + data.dm.y + '\nz: ' + data.dm.z;
    }
  });
}).catch(() => {
  // Catch if the DeviceOrientation or DeviceMotion is not supported by the browser or device
});

document.getElementById('fireButton').addEventListener('touchstart', () => {
  const msg = {
    type: 'fire',
    held: true,
  };
  sendMsg(msg);
});

document.getElementById('fireButton').addEventListener('touchstart', buttonPressed);
document.getElementById('fireButton').addEventListener('touchend', buttonReleased);

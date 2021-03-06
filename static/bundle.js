(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

function bringItemDown(id) {
  isTransitioning = true;
  const imgElem = document.getElementById(id);
  // add the transition element
  imgElem.classList.add('transitionTop');
  // Center of the bubble
  imgElem.style.top = centerVal;
  // Transition takes a second to finish, so wait then execute second half
  setTimeout(() => {
    imgElem.style.top = '100vh';
  }, 1000);
  setTimeout(() => {
    imgElem.classList.remove('transitionTop');
    imgElem.style.top = defaultVal;
    isTransitioning = false;
  }, 2000);
}

const gn = new GyroNorm();

socket.onmessage = ((msg) => {
  // Parse the message
  const parsedMsg = JSON.parse(msg.data);
  console.log(parsedMsg);

  if (parsedMsg.type === 'targetInfo') {
    const trashCaught = parsedMsg.targetName;
    // We can change the header texts later to be numerical, then run it through
    // an enum and translate it here so its less stress on the server
    // but for now, hard code   Plastic Bottle, Garbage Bag

    // Any point adding, wed do before the transitions.
    // transitions cannot happen simultaneously, so wed wanna limit
    if (!isTransitioning) {
      switch (trashCaught) {
        case 'Plastic Bottle':
          bringItemDown('plasticBottle');
          break;
        case 'Garbage Bag':
          bringItemDown('garbageBag');
          break;
        default:
          console.log('Unrecognized item caught');
      }
    }
  }

  if (parsedMsg.type === 'playerColor') {
    document.getElementById('fireButton').style.backgroundColor = `#${parsedMsg.hexColor}`;
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

},{}]},{},[1]);

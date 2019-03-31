!function(){var t,e,n={exports:{}};t=this,e=function(){var t=null,e=0,n=0,a=!1,o=!1,i=null,r=null,c=50,l=!0,s="game",u=2,d=null,g=!1,p=function(t){};function m(t){return Math.round(t*Math.pow(10,u))/Math.pow(10,u)}function y(t){d&&("string"==typeof t&&(t={message:t,code:0}),d(t))}return p.GAME="game",p.WORLD="world",p.DEVICE_ORIENTATION="deviceorientation",p.ACCELERATION="acceleration",p.ACCELERATION_INCLUDING_GRAVITY="accelerationinludinggravity",p.ROTATION_RATE="rotationrate",p.prototype.init=function(t){t&&t.frequency&&(c=t.frequency),t&&t.gravityNormalized&&(l=t.gravityNormalized),t&&t.orientationBase&&(s=t.orientationBase),t&&t.decimalCount&&(u=t.decimalCount),t&&t.logger&&(d=t.logger),t&&t.screenAdjusted&&(g=t.screenAdjusted);var e=new FULLTILT.getDeviceOrientation({type:s}).then(function(t){i=t}),a=(new FULLTILT.getDeviceMotion).then(function(t){n=(r=t).getScreenAdjustedAccelerationIncludingGravity().z>0?-1:1});return Promise.all([e,a]).then(function(){o=!0})},p.prototype.end=function(){try{o=!1,this.stop(),r.stop(),i.stop()}catch(t){y(t)}},p.prototype.start=function(u){o?(t=setInterval(function(){u(function(){var t;t=g?i.getScreenAdjustedEuler():i.getFixedFrameEuler();var a=r.getScreenAdjustedAcceleration(),o=r.getScreenAdjustedAccelerationIncludingGravity(),c=r.getScreenAdjustedRotationRate(),u=0,d={do:{alpha:m(u="game"===s?(u=t.alpha-e)<0?360-Math.abs(u):u:t.alpha),beta:m(t.beta),gamma:m(t.gamma),absolute:i.isAbsolute()},dm:{x:m(a.x),y:m(a.y),z:m(a.z),gx:m(o.x),gy:m(o.y),gz:m(o.z),alpha:m(c.alpha),beta:m(c.beta),gamma:m(c.gamma)}};return l&&(d.dm.gx*=n,d.dm.gy*=n,d.dm.gz*=n),d}())},c),a=!0):y({message:'GyroNorm is not initialized yet. First call the "init()" function.',code:1})},p.prototype.stop=function(){t&&(clearInterval(t),a=!1)},p.prototype.normalizeGravity=function(t){l=!!t},p.prototype.setHeadDirection=function(){return!g&&"world"!==s&&(e=i.getFixedFrameEuler().alpha,!0)},p.prototype.startLogging=function(t){t&&(d=t)},p.prototype.stopLogging=function(){d=null},p.prototype.isAvailable=function(t){var e=i.getScreenAdjustedEuler(),n=r.getScreenAdjustedAcceleration(),a=r.getScreenAdjustedAccelerationIncludingGravity(),o=r.getScreenAdjustedRotationRate();switch(t){case"deviceorientation":return e.alpha&&null!==e.alpha&&e.beta&&null!==e.beta&&e.gamma&&null!==e.gamma;case"acceleration":return n&&n.x&&n.y&&n.z;case"accelerationinludinggravity":return a&&a.x&&a.y&&a.z;case"rotationrate":return o&&o.alpha&&o.beta&&o.gamma;default:return{deviceOrientationAvailable:e.alpha&&null!==e.alpha&&e.beta&&null!==e.beta&&e.gamma&&null!==e.gamma,accelerationAvailable:n&&n.x&&n.y&&n.z,accelerationIncludingGravityAvailable:a&&a.x&&a.y&&a.z,rotationRateAvailable:o&&o.alpha&&o.beta&&o.gamma}}},p.prototype.isRunning=function(){return a},p},"function"==typeof define&&define.amd?define(function(){return t.GyroNorm=e()}):n.exports?n.exports=t.GyroNorm=e():t.GyroNorm=e(),n=n.exports;const a=new WebSocket(`${"https:"===window.location.protocol?"wss":"ws"}://${window.location.host}`),o="-300px",i="60px";let r=!1;function c(t){r=!0;const e=document.getElementById(t);e.classList.add("transitionTop"),e.style.top=i,setTimeout(()=>{e.style.top="100vh"},1e3),setTimeout(()=>{e.classList.remove("transitionTop"),e.style.top=o,r=!1},2e3)}const l=new n;function s(t){a.send(JSON.stringify(t))}a.onmessage=(t=>{const e=JSON.parse(t.data);if(console.log(e),"targetInfo"===e.type){const t=e.targetName;if(!r)switch(t){case"Plastic Bottle":c("plasticBottle");break;case"Garbage Bag":c("garbageBag");break;default:console.log("Unrecognized item caught")}}});const u={frequency:33,orientationBase:n.GAME};l.init(u).then(()=>{l.start(t=>{s({type:"rotate",x:t.do.beta,y:t.do.gamma,z:t.do.alpha}),t.dm.z>6&&s({type:"fire",held:!1})})}).catch(()=>{}),document.getElementById("fireButton").addEventListener("touchstart",()=>{s({type:"fire",held:!0})})}();
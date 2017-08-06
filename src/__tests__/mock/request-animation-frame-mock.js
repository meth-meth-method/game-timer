const sinon = require('sinon');

let frameId;
let time;
let callbacks;

function mock()
{
  reset();
  global.window = {};
  global.requestAnimationFrame = _interface.requestAnimationFrame;
  global.cancelAnimationFrame = _interface.cancelAnimationFrame;
}

function clean()
{
  delete global.window;
  delete global.requestAnimationFrame;
  delete global.cancelAnimationFrame;
}

function reset()
{
  frameId = 0;
  time = 0;
  callbacks = {};

  _interface.requestAnimationFrame = sinon.spy(function(callback) {
    if (!callbacks[frameId]) {
      callbacks[frameId] = [];
    }
    callbacks[frameId].push(callback);
    return frameId;
  });

  _interface.cancelAnimationFrame = sinon.spy(function(frameId) {
    delete callbacks[frameId];
  });
}

function triggerAnimationFrame(millis) {
  const iterate = callbacks[frameId++];
  if (iterate) {
    iterate.forEach(callback => {
      callback(millis);
    });
  }
}

const _interface = {
  mock,
  clean,
  reset,
  triggerAnimationFrame,
}

module.exports = _interface;
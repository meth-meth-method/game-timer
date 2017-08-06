function Timer(callbacks, step = 1/120) {
  var last = 0, acc = 0, tick = 0, frameId;

  function onFrame(time = 0) {
    if (last !== null) {
      acc = acc + (time - last) / 1000;
      while (acc > step) {
        callbacks.update(step, tick);
        tick = tick + 1;
        acc = acc - step;
      }
    }
    last = time;
    callbacks.render();
    frameId = requestAnimationFrame(onFrame);
  }

  function start() {
    last = null;
    frameId = requestAnimationFrame(onFrame);
  }

  function stop() {
    cancelAnimationFrame(frameId);
  }

  return {start, stop};
}

module.exports = Timer;

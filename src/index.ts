type Callbacks = {
  update: (deltaTime: number, tick: number) => void;
  render: () => void;
};

export type Timer = ReturnType<typeof createTimer>;

export function createTimer(
  { update, render }: Callbacks,
  step: number = 1 / 120,
) {
  let frameId: number;
  let last = -1;
  let acc = 0;
  let tick = 0;

  function onFrame(time: number) {
    if (last >= 0) {
      acc = acc + (time - last) / 1000;
      while (acc > step) {
        update(step, ++tick);
        acc = acc - step;
      }
    }
    last = time;
    render();
    frameId = requestAnimationFrame(onFrame);
  }

  function start() {
    if (frameId) {
      return;
    }

    last = -1;
    frameId = requestAnimationFrame(onFrame);
  }

  function stop() {
    cancelAnimationFrame(frameId);
    frameId = NaN;
  }

  return {
    start,
    stop,
  };
}

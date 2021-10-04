type UpdateCallback = (deltaTime: number, tick: number) => void;
type RenderCallback = () => void;

export type Timer = ReturnType<typeof createTimer>;

export function createTimer(step: number = 1 / 120) {
  let frameId: number;
  let last = -1;
  let acc = 0;
  let tick = 0;

  const onUpdate = new Set<UpdateCallback>();
  const onRender = new Set<RenderCallback>();

  function onFrame(time: number) {
    if (last >= 0) {
      acc = acc + (time - last) / 1000;
      while (acc > step) {
        onUpdate.forEach((update) => {
          update(step, ++tick);
        });
        acc = acc - step;
      }
    }
    last = time;
    onRender.forEach((render) => {
      render();
    });
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
    onUpdate,
    onRender,
  };
}

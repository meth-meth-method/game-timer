import { createTimer, Timer } from "./index";

describe("createTimer", () => {
  const TIME_STEP = 1 / 60;

  let timer: Timer;

  let updateSpy: jest.Mock;
  let renderSpy: jest.Mock;

  let RAFspy: jest.SpyInstance;
  let CAFspy: jest.SpyInstance;

  beforeEach(() => {
    RAFspy = jest.spyOn(window, "requestAnimationFrame");
    CAFspy = jest.spyOn(window, "cancelAnimationFrame");

    updateSpy = jest.fn();
    renderSpy = jest.fn();

    timer = createTimer(TIME_STEP);
    timer.onUpdate.add(updateSpy);
    timer.onRender.add(renderSpy);
  });

  afterEach(() => {
    RAFspy.mockRestore();
  });

  it("creates a timer instance", () => {
    expect(timer.start);
    expect(timer.stop);
  });

  describe("when started", () => {
    let RAFcallback: FrameRequestCallback;

    let realTime = 0;
    function advanceTime(seconds: number) {
      realTime += seconds * 1000;
      RAFcallback(realTime);
    }

    beforeEach(() => {
      timer.start();
    });

    beforeEach(() => {
      RAFcallback = RAFspy.mock.calls[0][0];
    });

    it("queues a RAF callback", () => {
      expect(RAFspy).toHaveBeenCalledTimes(1);
    });

    describe("and a RAF is triggered", () => {
      beforeEach(() => {
        advanceTime(0);
        advanceTime(TIME_STEP * 16);
      });

      it("update has been called", () => {
        expect(updateSpy).toHaveBeenCalledTimes(16);
      });

      it("update has been called with time step and tick", () => {
        expect(updateSpy).toHaveBeenCalledWith(TIME_STEP, 1);
        expect(updateSpy).toHaveBeenCalledWith(TIME_STEP, 2);
        expect(updateSpy).toHaveBeenCalledWith(TIME_STEP, 3);
      });

      it("render has been called", () => {
        expect(renderSpy).toHaveBeenCalledTimes(2);
      });

      describe("then stopped", () => {
        beforeEach(() => {
          timer.stop();
        });

        it("RAF is cancelled", () => {
          expect(CAFspy).toHaveBeenCalledTimes(1);
          expect(CAFspy).toHaveBeenCalledWith(13);
        });

        describe("when started after time passed", () => {
          beforeEach(() => {
            timer.start();
          });

          it("does not update for passed time", () => {
            advanceTime(1);
            expect(updateSpy).toHaveBeenCalledTimes(16);
            advanceTime(1);
            expect(updateSpy).toHaveBeenCalledTimes(75);
          });
        });
      });
    });
  });
});

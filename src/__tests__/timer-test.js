const expect = require('expect.js');
const sinon = require('sinon');

const RequestAnimationFrameMock = require('./mock/request-animation-frame-mock');
const Timer = require('../timer');

describe('Timer', () => {
  let updateSpy, renderSpy;

  beforeEach(() => {
    updateSpy = sinon.spy();
    renderSpy = sinon.spy();
    RequestAnimationFrameMock.mock();
  });

  afterEach(() => {
    RequestAnimationFrameMock.clean();
  });

  it('has default step 1/120', () => {
    const timer = Timer({
      update: updateSpy,
      render: renderSpy,
    });
    timer.start();
    RequestAnimationFrameMock.triggerAnimationFrame(0);
    RequestAnimationFrameMock.triggerAnimationFrame(1000);
    expect(updateSpy.alwaysCalledWith(1/120)).to.be(true);
  });

  it('calls update with time step', () => {
    const timer = Timer({
      update: updateSpy,
      render: renderSpy,
    });
    timer.start();
    RequestAnimationFrameMock.triggerAnimationFrame(0);
    RequestAnimationFrameMock.triggerAnimationFrame(1000);
    expect(updateSpy.callCount).to.be(120);
  });

  it('accept time step in constructor', () => {
    const timer = Timer({
      update: updateSpy,
      render: renderSpy,
    }, 1/132);
    timer.start();
    RequestAnimationFrameMock.triggerAnimationFrame(0);
    RequestAnimationFrameMock.triggerAnimationFrame(2000);
    expect(updateSpy.callCount).to.be(264);
  });

  it('calls render once for every animation frame', () => {
    const timer = Timer({
      update: updateSpy,
      render: renderSpy,
    });
    timer.start();
    RequestAnimationFrameMock.triggerAnimationFrame(0);
    RequestAnimationFrameMock.triggerAnimationFrame(100);
    expect(updateSpy.callCount).to.be(12);
    expect(renderSpy.callCount).to.be(2);
  });

  it('initializes in stopped state', () => {
    const timer = Timer({
      update: updateSpy,
      render: renderSpy,
    });
    RequestAnimationFrameMock.triggerAnimationFrame(0);
    RequestAnimationFrameMock.triggerAnimationFrame(100);
    expect(updateSpy.callCount).to.be(0);
    expect(renderSpy.callCount).to.be(0);
  });

  it('counts time from when started', () => {
    const timer = Timer({
      update: updateSpy,
      render: renderSpy,
    });
    timer.start();
    RequestAnimationFrameMock.triggerAnimationFrame(100);
    RequestAnimationFrameMock.triggerAnimationFrame(200);
    expect(updateSpy.callCount).to.be(12);
    timer.stop();
    RequestAnimationFrameMock.triggerAnimationFrame(2000);
    timer.start();
    RequestAnimationFrameMock.triggerAnimationFrame(3000);
    RequestAnimationFrameMock.triggerAnimationFrame(3100);
    expect(updateSpy.callCount).to.be(24);
  });

  it('counts ticks', () => {
    const timer = Timer({
      update: updateSpy,
      render: renderSpy,
    });
    timer.start();
    RequestAnimationFrameMock.triggerAnimationFrame(0);
    RequestAnimationFrameMock.triggerAnimationFrame(2000);
    [0, 1, 2, 3, 4, 5, 12, 120].forEach(callIndex => {
      const tick = callIndex;
      expect(updateSpy.getCall(callIndex).args[1]).to.be(tick);
    });
  });

  it('should stop immediately on stop', () => {
    const timer = Timer({
      update: updateSpy,
      render: renderSpy,
    });
    timer.start();
    RequestAnimationFrameMock.triggerAnimationFrame(0);
    RequestAnimationFrameMock.triggerAnimationFrame(500);
    expect(updateSpy.callCount).to.be(59);
    expect(renderSpy.callCount).to.be(2);
    timer.stop();
    RequestAnimationFrameMock.triggerAnimationFrame(1000);
    expect(updateSpy.callCount).to.be(59);
    expect(renderSpy.callCount).to.be(2);
  });
});

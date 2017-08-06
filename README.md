# Game Timer

A tiny (640 bytes), powerful game timer that provides a fixed timestep and abstracts away `requestAnimationFrame` and `cancelAnimationFrame`.

## Usage

1) Install

```bash
npm install game-timer
```

2) Include Timer function.

```js
const GameTimer = require('game-timer');
```

3) Initialize by configuring with an `update` callback and a `render` callback.

```js
const timer = GameTimer({
    update: (deltaTime) => {
        myGame.update(deltaTime);
    },
    render: () => {
        drawGame(myGame, canvas);
    },
});
```

4) Start timer. Your `update` callback will be called with a fixed time step in seconds as time progress and your `render` callback will be called when the browser is ready to render a another frame.

```js
timer.start();
```

5) Pause if needed.

```js
timer.stop();
```

## Configure

Beyond the `update` and `render` callback `GameTimer` takes a second argument which is will use a the time step. The default time step is 1/120th of a second (0.008333333333333333 seconds).

```js
const timer = new GameTimer({
    update: ...,
    render: ...,
}, 1/320);
```

 A lower time step makes simulations more accurate but requires more CPU.
Changing time step after game logic has been establish might affect game play so be careful.


## Why fixed time step?

In order to avoid locking game simulation to frame rate this game timer keeps track of passed time and emits fixed time to your game update logic. It also prevents skipping by enforcing every simulation tick to be computed. This prevents glitches like objects falling thru collision zones and make simulations deterministic.

Further explanation can be found in [this video](https://www.youtube.com/watch?v=JZbSTMNVkjc).

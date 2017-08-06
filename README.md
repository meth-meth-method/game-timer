# Game Timer

## Usage

1) Install

```bash
npm install game-timer
```

2) Include Timer function.

```js
var GameTimer = require('game-timer');
```

3) Initialize by configuring with an `update` callback and a `render` callback.

```js
var timer = GameTimer({
    update: (deltaTime) => {
        myGame.update(deltaTime);
    },
    render: () => {
        drawGame(myGame, canvas);
    },
});
```

4) Start timer. You `update` callback will be called with a fixed time step as time progresses and your `render` callback will be called when the browser is ready to render a new frame.

```js
timer.start();
```

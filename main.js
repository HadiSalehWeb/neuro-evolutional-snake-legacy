"use strict";

const game = new Game({ size: new Vector2(100, 100), unitSize: 5, unitFrameSize: 0 });
const div = document.querySelector('main');
var canvases = Array(64).fill(0).map(_ => new GameCanvas(game, div));
const snakeNetwork = new SnakeNetwork();
let timeout = 100;

const update = function () {
    if (!game.snake.alive) return;
    game.setDirection(snakeNetwork.getDirection(SnakeNetwork.getInputs(game), game.getDirection()));
    game.update();
    for (var canvas of canvases)
        Drawing.drawGame(canvas);

    setTimeout(update, timeout);
}

update();
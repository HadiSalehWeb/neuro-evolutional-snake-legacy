"use strict";

const GameCanvas = function (game, container) {
    const canvas = document.createElement('canvas');
    canvas.width = game.size.x;
    canvas.height = game.size.y;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    ctx.scale(1, -1);
    ctx.translate(0, -game.size.y);

    this.game = game;
    this.element = container;
    this.canvas = canvas;
    this.ctx = ctx;
};

GameCanvas.prototype.remove = function () {
    this.element.removeChild(this.canvas);
}

//set the function on the prototype of gameCanvas
const Drawing = (function (settings) {
    const drawSquare = function (ctx, pos, fillColor, strokeColor, unitSize, unitFrameSize) {
        ctx.fillStyle = fillColor;
        ctx.fillRect(pos.x * unitSize + unitFrameSize, pos.y * unitSize + unitFrameSize, unitSize - unitFrameSize * 2, unitSize - unitFrameSize * 2);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = unitFrameSize;
        ctx.strokeRect(pos.x * unitSize, pos.y * unitSize, unitSize, unitSize);
    };
    const drawDeath = function (ctx, w, h) {
        ctx.fillStyle = 'rgba(0, 0, 0, .3)';
        ctx.fillRect(0, 0, w, h);
    };

    return {
        drawGame: function (gameCanvas) {
            const ctx = gameCanvas.ctx,
                w = gameCanvas.game.size.x,
                h = gameCanvas.game.size.y,
                snake = gameCanvas.game.snake,
                pallet = gameCanvas.game.pallet;

            //background
            ctx.fillStyle = '#333333';
            ctx.fillRect(0, 0, w, h);

            //snake
            drawSquare(ctx, snake.head, '#FFFFFF', '#000000', gameCanvas.game.unitSize, gameCanvas.game.unitFrameSize);
            for (let i = 0; i < snake.body.length; i++)
                drawSquare(ctx, snake.body[i], '#FFFFFF', '#000000', gameCanvas.game.unitSize, gameCanvas.game.unitFrameSize);

            //pallet
            drawSquare(ctx, pallet, '#FF234F', '#003431', gameCanvas.game.unitSize, gameCanvas.game.unitFrameSize);

            if (!gameCanvas.game.snake.alive) drawDeath(ctx, w, h);
        }
    }
})({});
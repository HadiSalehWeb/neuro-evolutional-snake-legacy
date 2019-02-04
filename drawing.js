"use strict";

const GameCanvas = (function () {

    return function (game, container) {
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
    }
})();

//set the function on the prototype of gameCanvas
const Drawing = (function (settings) {
    const drawSquare = function (ctx, pos, fillColor, strokeColor, unitSize, unitFrameSize) {
        ctx.fillStyle = fillColor;
        ctx.fillRect(pos.x * unitSize + unitFrameSize, pos.y * unitSize + unitFrameSize, unitSize - unitFrameSize * 2, unitSize - unitFrameSize * 2);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = unitFrameSize;
        ctx.strokeRect(pos.x * unitSize, pos.y * unitSize, unitSize, unitSize);
    };

    return {
        drawGame: function (gameCanvas) {
            const ctx = gameCanvas.ctx,
                w = gameCanvas.game.size.x,
                h = gameCanvas.game.size.y,
                snake = gameCanvas.game.snake,
                pallet = gameCanvas.game.pallet;

            //background
            ctx.fillStyle = 'grey';
            ctx.fillRect(0, 0, w, h);

            //snake
            drawSquare(ctx, snake.head, 'white', 'black', gameCanvas.game.unitSize, gameCanvas.game.unitFrameSize);
            for (let i = 0; i < snake.body.length; i++)
                drawSquare(ctx, snake.body[i], 'white', 'black', gameCanvas.game.unitSize, gameCanvas.game.unitFrameSize);

            //pallet
            drawSquare(ctx, pallet, 'purple', 'black', gameCanvas.game.unitSize, gameCanvas.game.unitFrameSize);
        }
    }
})({

})
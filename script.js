//LEGACY

"use strict";

const unitSize = 16;
const unitFrameSize = 2;
const simulationSpeed = 80;
let autoUpdate = true;

const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const cSize = new Vector2(canvas.height, canvas.width);
const cUnits = new Vector2(cSize.x / unitSize, cSize.y / unitSize);

ctx.scale(1, -1);
ctx.translate(0, -cSize.y);

const snake = {
    head: Vector2.random(Math.floor(cUnits.x * 0.25), cUnits.x - Math.floor(cUnits.x * 0.25), Math.floor(cUnits.y * 0.25), cUnits.y - Math.floor(cUnits.y * 0.25)),
    body: [],
    direction: Math.random() < .5 ? Math.random() < .5 ? Vector2.right : Vector2.left : Math.random() < .5 ? Vector2.up : Vector2.down,
    move: function (grow) {
        const index = this.body.length - 1;
        if (grow) {
            const lastSegment = this.body.length === 0 ? this.head : this.body[this.body.length - 1];
            this.body.push(lastSegment.clone());
        }
        for (let i = index; i >= 0; i--) {
            if (i === 0)
                this.body[i] = this.head.clone();
            else
                this.body[i] = this.body[i - 1].clone();
        }
        this.head = this.head.add(this.direction);
    }
};

const getRandomPalletPosition = function () {
    let ret = Vector2.random(1, cUnits.x - 1, 1, cUnits.y - 1);
    while (snake.body.some(x => x.equals(ret)) || snake.head.equals(ret))
        ret = Vector2.random(1, cUnits.x - 1, 1, cUnits.y - 1);
    return ret;
};

let pallet = getRandomPalletPosition();
let lastDirection = null;

window.onkeydown = function (e) {
    switch (e.key) {
        case 'ArrowUp':
            if (snake.direction.equals(Vector2.right) || snake.direction.equals(Vector2.left))
                lastDirection = Vector2.up;
            break;
        case 'ArrowRight':
            if (snake.direction.equals(Vector2.up) || snake.direction.equals(Vector2.down))
                lastDirection = Vector2.right;
            break;
        case 'ArrowDown':
            if (snake.direction.equals(Vector2.right) || snake.direction.equals(Vector2.left))
                lastDirection = Vector2.down;
            break;
        case 'ArrowLeft':
            if (snake.direction.equals(Vector2.up) || snake.direction.equals(Vector2.down))
                lastDirection = Vector2.left;
            break;
        default:
            break;
    }
};

const drawSquare = function (pos, color) {
    ctx.fillStyle = color;
    ctx.fillRect(pos.x * unitSize + unitFrameSize, pos.y * unitSize + unitFrameSize, unitSize - unitFrameSize * 2, unitSize - unitFrameSize * 2);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = unitFrameSize;
    ctx.strokeRect(pos.x * unitSize, pos.y * unitSize, unitSize, unitSize);
};

const drawWalls = function () {
    ctx.fillStyle = 'lightgrey';
    ctx.fillRect(0, 0, unitSize, cSize.y);
    ctx.fillRect(0, 0, cSize.x, unitSize);
    ctx.fillRect(cSize.x - unitSize, 0, unitSize, cSize.y);
    ctx.fillRect(0, cSize.y - unitSize, cSize.x, unitSize);
};

const drawBackground = function () {
    ctx.fillStyle = 'grey';
    ctx.fillRect(0, 0, cSize.x, cSize.y);
};

const drawSnake = function () {
    const c = 'white';
    drawSquare(snake.head, c);
    for (let i = 0; i < snake.body.length; i++)
        drawSquare(snake.body[i], c);
};

const drawPallet = function () {
    drawSquare(pallet, 'purple');
};

const update = function () {
    if (lastDirection !== null)
        snake.direction = lastDirection;
    if (snake.head.equals(pallet)) {
        snake.move(true);
        pallet = getRandomPalletPosition();
    }
    else snake.move();
    ctx.clearRect(0, 0, cSize.x, cSize.y);
    drawBackground();
    drawWalls();
    drawSnake();
    drawPallet();

    if (snake.body.some(x => x.equals(snake.head)) ||
        snake.head.x <= 0 ||
        snake.head.x >= cUnits.x - 1 ||
        snake.head.y <= 0 ||
        snake.head.y >= cUnits.y - 1) {
        drawSquare(snake.head, 'red');
        return;
    }
    if (autoUpdate)
        setTimeout(update, simulationSpeed);
};

update();
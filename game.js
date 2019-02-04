/// <reference path="vector2.js" />
/// <reference path="drawing.js" />

"use strict";

const GameSnapshot = function (snakePosition, snakeDireciton, snakeAlive, snakeLength, palletPosition) {
    this.snakePosition = snakePosition;
    this.snakeDireciton = snakeDireciton;
    this.snakeAlive = snakeAlive;
    this.snakeLength = snakeLength;
    this.palletPosition = palletPosition;
}

const Game = function (options) {
    options = Object.assign({
        size: new Vector2(512, 512),
        unitSize: 16,
        unitFrameSize: 2
    }, options);

    if (options.size.x < 0 || options.size.y < 0 || options.unitSize < 0 || options.unitFrameSize < 0)
        throw new Error('all measures must be positive.');
    if (options.size.x % options.unitSize !== 0 || options.size.y % options.unitSize !== 0)
        throw new Error('width and height must be multiples of unitSize.');
    if (options.unitFrameSize >= options.unitSize * .5)
        throw new Error('unitFrameSize can\'t be greater than or equal to half the unitSize.');

    Object.assign(this, options);
    this.history = [];
    const units = new Vector2(this.size.x / this.unitSize, this.size.y / this.unitSize);

    const snake = {
        alive: true,
        head: Vector2.random(
            Math.floor(units.x * 0.25),
            units.x - Math.floor(units.x * 0.25),
            Math.floor(units.y * 0.25),
            units.y - Math.floor(units.y * 0.25)
        ),
        body: [],
        direction:
            Math.random() < .5 ? Math.random() < .5 ? Vector2.right
                : Vector2.left
                : Math.random() < .5 ? Vector2.up
                    : Vector2.down,
        move: function (grow) {
            const lastSegmentIndex = this.body.length - 1;
            if (grow) {
                const lastSegment = this.body.length === 0 ? this.head : this.body[lastSegmentIndex];
                this.body.push(lastSegment.clone());
            }
            for (let i = lastSegmentIndex; i >= 0; i--) {
                if (i === 0)
                    this.body[i] = this.head.clone();
                else
                    this.body[i] = this.body[i - 1].clone();
            }
            this.head = this.head.add(this.direction);
        }
    };
    this.snake = snake;

    let lastDirection = snake.direction;
    this.setDirection = v => {
        if (snake.direction.perpendicularTo(v))
            lastDirection = v;
    };
    this.getDirection = () => lastDirection;

    const getRandomPalletPosition = function () {
        if (snake.body.length + 1 >= (options.size.x) * (options.size.y))
            throw new Error('holy shit dude');
        let ret = Vector2.random(0, units.x, 0, units.y);
        while (snake.body.some(x => x.equals(ret)) || snake.head.equals(ret))
            ret = Vector2.random(0, units.x, 0, units.y);
        return ret;
    };

    this.pallet = getRandomPalletPosition();

    this.update = function () {
        if (!snake.alive)
            return;

        if (lastDirection !== null)
            snake.direction = lastDirection;

        if (snake.head.equals(this.pallet)) {
            snake.move(true);
            this.pallet = getRandomPalletPosition();
        }
        else snake.move();

        if (snake.body.some(x => x.equals(snake.head)) ||
            snake.head.x < 0 ||
            snake.head.x > units.x - 1 ||
            snake.head.y < 0 ||
            snake.head.y > units.y - 1) {
            snake.alive = false;
        }

        this.history.push(new GameSnapshot(snake.head, snake.direction, snake.alive, snake.body.length + 1, this.pallet));
    }
};
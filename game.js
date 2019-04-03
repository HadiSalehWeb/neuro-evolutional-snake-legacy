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
        unitFrameSize: 2,
        killOnLoop: false,
        recordHistory: false
    }, options);

    if (options.size.x <= 0 || options.size.y <= 0 || options.unitSize <= 0 || options.unitFrameSize <= 0)
        throw new Error('all measures must be positive and non-zero.');
    if (options.size.x % options.unitSize !== 0 || options.size.y % options.unitSize !== 0)
        throw new Error('width and height must be multiples of unitSize.');
    if (options.unitFrameSize >= options.unitSize * .5)
        throw new Error('unitFrameSize must be smaller than half the unitSize.');

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
        ).floor(),
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
        },
        willDie: function () {
            const newHead = this.head.add(this.direction);
            return snake.body.slice(0, this.body.length - 1).some(x => x.equals(newHead)) ||
                newHead.x < 0 ||
                newHead.x > units.x - 1 ||
                newHead.y < 0 ||
                newHead.y > units.y - 1;
        },
        //loopHistory[snakeDir][palletPos][headPos][...bodyPositionS]
        loopHistory: {},
        checkLoop: function (pallet) {
            const arr = [this.direction.hash(), pallet.hash(), this.head.hash(), ...this.body.map(x => x.hash())];
            let found = true;
            let obj = this.loopHistory;
            for (let i = 0; i < arr.length; i++) {
                if (!obj.hasOwnProperty(arr[i])) {
                    found = false;
                    obj[arr[i]] = {};
                }
                obj = obj[arr[i]];
            }
            return found;
        },
        hasLooped: false,
        score: 0,
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
        let ret = Vector2.random(0, units.x, 0, units.y).floor();
        while (snake.body.some(x => x.equals(ret)) || snake.head.equals(ret))
            ret = Vector2.random(0, units.x, 0, units.y).floor();
        return ret;
    };

    this.pallet = getRandomPalletPosition();

    this.update = function () {
        if (!snake.alive)
            return;

        if (lastDirection !== null)
            snake.direction = lastDirection;

        const hasLooped = (this.killOnLoop && snake.checkLoop(this.pallet));
        if (snake.willDie() || hasLooped) {
            snake.alive = false;//womp womp
            snake.hasLooped = hasLooped;
            // if (hasLooped) snake.score -= 10;

            if (this.recordHistory)
                this.history.push(new GameSnapshot(snake.head.add(snake.direction), snake.direction, snake.alive, snake.body.length + 1, this.pallet));
            return;
        }

        if (snake.head.equals(this.pallet)) {
            snake.score += 10;
            snake.move(true);
            this.pallet = getRandomPalletPosition();
        }
        else {
            if (snake.direction.dot(this.pallet.substract(snake.head)) > 0) snake.score++;
            else snake.score -= 1.5;
            snake.move();
        }

        if (this.recordHistory)
            this.history.push(new GameSnapshot(snake.head, snake.direction, snake.alive, snake.body.length + 1, this.pallet));
    }

    this.reset = function () {
        snake.alive = true;
        snake.head = Vector2.random(
            Math.floor(units.x * 0.25),
            units.x - Math.floor(units.x * 0.25),
            Math.floor(units.y * 0.25),
            units.y - Math.floor(units.y * 0.25)
        ).floor();
        snake.body = [];
        snake.direction =
            Math.random() < .5 ? Math.random() < .5 ? Vector2.right
                : Vector2.left
                : Math.random() < .5 ? Vector2.up
                    : Vector2.down;
        snake.loopHistory = {};
        snake.score = 0;
        this.pallet = getRandomPalletPosition();
    }
};
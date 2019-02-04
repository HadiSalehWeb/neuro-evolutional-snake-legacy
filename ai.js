"use strict";

//math.multiply(math.matrix([[1, 4], [2, 5], [3, 6]]),math.matrix([[1], [1]])) ===
//math.matrix([[5], [7], [9]])


//          N(7,8)
//  N(1,2,3)        N
//          N(9,10)
//  N(4,5,6)        N
//          N(11,12)

//n = new NeuralNetwork([2, 3, 2], [
//    math.matrix([[1, 4], [2, 5], [3, 6]]),
//    math.matrix([[7, 9, 11], [8, 10, 12]])
//]);

const randomWeight = function (d) {
    const min = -1 / Math.sqrt(d), max = -min;
    return min + Math.random() * (max - min);
}

const range = function (n) {
    return Array(n).fill(0).map((_, i) => i);
}

const sigmoid = function (z) {
    return 1 / (1 + Math.exp(-z));
}

const NeuralNetwork = function (layers, weights) {
    if (layers.length < 2)
        throw new Error('There must be at least 2 layers.');
    if (layers.some(x => x === 0))
        throw new Error('Every layer must have a non-zero number of neurons.');
    if ((Array.isArray(weights) && (weights.length !== layers.length - 1 ||
        weights.some((x, i) => x.size()[0] !== layers[i + 1] || x.size()[1] !== layers[i] + 1))))
        throw new Error('The weights must fit the number of neurons in each layer.');

    this.layers = layers;

    this.weights = weights || range(layers.length - 1).map(i =>
        math.matrix(
            range(layers[i + 1]).map(
                x => range(layers[i]).map(
                    y => randomWeight(layers[0])
                ).concat([1])
            )
        )
    );
}

NeuralNetwork.prototype.getValue = function (inputVector) {
    return this.weights.reduce((a, c) => math.multiply(c, a.resize([a.size(0)[0] + 1], 1)).map(x => sigmoid(x)), inputVector);
}


const SnakeNetwork = function (weights) {
    NeuralNetwork.call(this, [15, 20, 3], weights);
}

Object.assign(SnakeNetwork.prototype, NeuralNetwork.prototype);

SnakeNetwork.prototype.getDirection = function (inputVector, currentDirection) {
    const res = this.getValue(math.matrix(inputVector)).toArray();
    if (res[0] > res[1] && res[0] > res[2])
        return currentDirection;
    else if (res[1] > res[2])
        return new Vector2(-currentDirection.y, currentDirection.x);
    else
        return new Vector2(currentDirection.y, -currentDirection.x);
}

var lookingDirections = {
    'Vector2(0, 1)': [
        new Vector2(-1, 0),
        new Vector2(-1, 1),
        new Vector2(0, 1),
        new Vector2(1, 1),
        new Vector2(1, 0)
    ],
    'Vector2(1, 0)': [
        new Vector2(0, 1),
        new Vector2(1, 1),
        new Vector2(1, 0),
        new Vector2(1, -1),
        new Vector2(0, -1)
    ],
    'Vector2(0, -1)': [
        new Vector2(1, 0),
        new Vector2(1, -1),
        new Vector2(0, -1),
        new Vector2(-1, -1),
        new Vector2(-1, 0)
    ],
    'Vector2(-1, 0)': [
        new Vector2(0, -1),
        new Vector2(-1, -1),
        new Vector2(-1, 0),
        new Vector2(-1, 1),
        new Vector2(0, 1)
    ]
}

SnakeNetwork.getInputs = function (game) {
    const input = [];
    const units = new Vector2(game.size.x / game.unitSize, game.size.y / game.unitSize);
    const dir = lookingDirections[game.snake.direction.toString()];

    for (let i = 0; i < 5; i++) {
        var pos = game.snake.head.add(dir[i]);
        for (; ;) {
            if (game.pallet.equals(pos)) {
                input.push(1, 0, 0);
                break;
            }
            if (game.snake.body.some(x => x.equals(pos))) {
                input.push(0, 1, 0);
                break;
            }
            if (pos.x < 0 ||
                pos.x > units.x - 1 ||
                pos.y < 0 ||
                pos.y > units.y - 1) {
                input.push(0, 0, 1);
                break;
            }
            pos = pos.add(dir[i]);
        }
    }

    return input;
}
'use strict';

const NeuralNetwork = function (layers, weights) {
    if (layers.count < 2) throw new Error('Network must have at least 2 layers.');
    if (layers.some(x => x < 1)) throw new Error('Every layer must have positive non-zero number of neurons..');
    if ((Array.isArray(weights) && (weights.length !== layers.length - 1 ||
        weights.some((x, i) => x.length !== layers[i + 1] || x[0].length !== layers[i] + 1))))
        throw new Error('The weights must fit the number of neurons in each layer.');

    this.layerCount = layers.length;
    this.layers = layers;
    this.weights = weights || range(this.layerCount - 1).map(i =>
        range(this.layers[i + 1]).map(row =>
            range(this.layers[i] + 1).map(column =>
                // randomWeightSqr(layers[i])
                randomMinMax(-1, 1)
            )
        )
    );
}

NeuralNetwork.prototype.transform = function (inputVector) {
    return this.weights.reduce((a, c) => multiply(c, a.concat([[1]])).map(e => [sigmoid(e[0])]), inputVector);
}

NeuralNetwork.prototype.getValue = function (inputArray) {
    return this.transform(inputArray.map(x => [x])).map(x => x[0]);
}

NeuralNetwork.prototype.equals = function (net) {
    return this.layerCount === net.layerCount &&
        this.layers.length === net.layers.length &&
        this.layers.reduce((a, c, i) => a && c === net.layers[i], true) &&
        this.weights.length === net.weights.length &&
        this.weights.reduce((a, c, i) =>
            a &&
            c.length === net.weights[i].length &&
            c.reduce((a, c, j) =>
                a &&
                c.length === net.weights[i][j].length &&
                c.reduce((a, c, k) =>
                    a &&
                    c === net.weights[i][j][k]
                    , true
                ), true
            ), true
        );
}

NeuralNetwork.prototype.encode = function () {
    const ret = [this.layerCount, ...this.layers];
    for (let c = 0; c < this.layerCount - 1; c++)
        for (let i = 0; i < this.weights[c].length; i++)
            for (let j = 0; j < this.weights[c][i].length; j++)
                ret.push(this.weights[c][i][j]);

    return ret;
}

NeuralNetwork.decode = function (chr) {
    const layerCount = chr[0];
    const layers = chr.slice(1, layerCount + 1);
    const weights = range(layerCount - 1).map(n => range(layers[n + 1]).map(_ => range(layers[n] + 1)));
    let index = layers.length + 1;

    for (let c = 0; c < layerCount - 1; c++)
        for (let i = 0; i < layers[c + 1]; i++)
            for (let j = 0; j < layers[c] + 1; j++)
                weights[c][i][j] = chr[index++];

    return new NeuralNetwork(layers, weights);
}
'use strict';

const Chromosome = function (genes, fitness) {
    this.genes = genes;
    this.fitness = fitness;
}

const mutate = function (chromosomes, options, randomGene) {
    options = Object.assign({
        survivalPropFun: SurvivalProbabilityFunctions.GuaranteedSigmoid(50, .1),
        mutationRate: .01,
        mutationSkip: 0,
        mutationRange: [-1, 1]
    }, options);
    const len = chromosomes.length;
    chromosomes.sort((a, b) => a.fitness > b.fitness ? -1 : a.fitness < b.fitness ? 1 : 0);

    chromosomes = chromosomes
        .reduce((a, c, i) => Math.random() < options.survivalPropFun(i / (len - 1)) ? a.concat(c) : a, []);

    const lenCrossed = chromosomes.length + Math.floor((len - chromosomes.length) * .9);

    let r1 = 0, r2 = 0;
    while (chromosomes.length < lenCrossed) {
        r1 = Math.floor(randomMinMax(0, chromosomes.length));
        r2 = Math.floor(randomMinMax(0, chromosomes.length));
        chromosomes.push(...cross(chromosomes[r1].genes, chromosomes[r2].genes, 1).map(c => new Chromosome(c, -1)));
    }

    for (var i = 0; i < lenCrossed; i++)
        for (var j = 0; j < chromosomes[i].genes.length; j++) {
            if (j > options.mutationSkip && Math.random() < options.mutationRate) {
                chromosomes[i].genes[j] = randomMinMax(options.mutationRange[0], options.mutationRange[1]);
            }
        }

    while (chromosomes.length < len) {
        chromosomes.push(new Chromosome(randomGene(), -1));
    }

    return chromosomes;
}

const SurvivalProbabilityFunctions = {
    Sigmoid: (k, x0) => x => 1 - (1 / (1 + Math.exp(-k * (x - x0)))),
    GuaranteedSigmoid: (k, x0) => x => x === 0 ? 1 : x === 1 ? 0 : 1 - (1 / (1 + Math.exp(-k * (x - x0)))),
    TakeN: n => x => x < n ? 1 : 0,
    TopHalf: x => this.TakeN(.5),
    Random: x => Math.random() < .5 ? 1 : 0,
}

const cross = (function () {
    const getCuts = function (min, max, count) {
        if (count === 0) return [];
        const cut = Math.floor(randomMinMax(min, max));
        return [cut,
            ...getCuts(min, cut, Math.floor((count - 1) * .5)),
            ...getCuts(cut, max, Math.ceil((count - 1) * .5))
        ];
    }

    return function (g1, g2, cutCount) {
        const cuts = [0, ...getCuts(0, g1.length, cutCount), g1.length].sort((a, b) => a > b ? 1 : a < b ? -1 : 0);
        return [
            cuts.slice(1).reduce((a, c, i) =>
                a.concat(i % 2 === 0 ? g1.slice(cuts[i], c) : g2.slice(cuts[i], c)), []),
            cuts.slice(1).reduce((a, c, i) =>
                a.concat(i % 2 === 1 ? g1.slice(cuts[i], c) : g2.slice(cuts[i], c)), [])
        ];
    }
})();

const cross2 = function (g1, g2) {
    return g1.reduce((a, c, i) => a.concat((c + g2[i]) / 2), [])
}
'use strict';

/*
To do:
add inspection for seperate canvases
*/

window.onload = function () {
    const mainDiv = document.querySelector('main');
    let population = 50;
    let games, canvases, snakeNetworks;

    const options = {
        running: false,
        //0 => nothing
        //1: run 1 generation
        //2: keep running generations
        currentTask: 0,
        update: function () {
            if (!this.running)
                return;

            for (let i = 0; i < population; i++) {
                if (!games[i].snake.alive) continue;
                games[i].setDirection(snakeNetworks[i].getDirection(SnakeNetwork.getInputs(games[i]), games[i].getDirection()));
                games[i].update();
                Drawing.drawGame(canvases[i]);
            }

            if (games.every(g => !g.snake.alive)) {
                if (this.currentTask !== 2) {
                    this.currentTask = 0;
                    this.running = false;
                    return;
                }
                else {

                }
            }

            setTimeout(options.update.bind(options), 1000 / this.fps);
        },
        '⏵': function () {
            this.running = true;
            this.update();
        },
        '⏸': function () {
            this.running = false;
        },
        '⏹': function () {
            this.running = false;
            this.currentTask = 0;
        },
        fps: 10,
        Run1: function () {
            this.currentTask = 1;
            this['⏵']();
        },
        RunMany: function () {
            this.currentTask = 2;
            this['⏵']();
        },
        Save: function () {
            alert("Not implemented");
        },
        Load: function () {
            alert("Not implemented");
        },
        New: function () {
            newSimulationFolder.open();
        },
        NewSimulation: {
            population: 50,
            canvasWidth: 128,
            canvasHeight: 128,

            Create: function () {
                options['⏹']();
                if (Array.isArray(canvases)) {
                    alert('warning');
                    for (let i = 0; i < canvases.length; i++)
                        canvases[i].remove();
                }
                
                population = this.population;
                games = range(population).map(_ => new Game({ size: new Vector2(this.canvasWidth, this.canvasHeight), killOnLoop: true }));
                canvases = range(population).map(i => new GameCanvas(games[i], mainDiv));
                snakeNetworks = range(population).map(_ => new SnakeNetwork());

                newSimulationFolder.close();
            }
        }
    };

    const gui = new dat.GUI();
    gui.add(options, '⏵');
    gui.add(options, '⏸');
    gui.add(options, '⏹');
    gui.add(options, 'fps').min(0).max(60);
    gui.add(options, 'Run1');
    gui.add(options, 'RunMany');
    gui.add(options, 'Save');
    gui.add(options, 'Load');
    gui.add(options, 'New');
    const newSimulationFolder = gui.addFolder('New Simulation');
    newSimulationFolder.add(options.NewSimulation, 'population').min(0).step(1).max(200);
    newSimulationFolder.add(options.NewSimulation, 'canvasWidth').min(0).step(1).max(256);
    newSimulationFolder.add(options.NewSimulation, 'canvasHeight').min(0).step(1).max(256);
    newSimulationFolder.add(options.NewSimulation, 'Create');
};

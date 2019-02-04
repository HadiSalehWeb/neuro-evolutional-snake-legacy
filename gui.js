'use strict';

Vue.component('modal', {
    template: '#modal-template'
});

var app = new Vue({
    el: '#options',
    data: {
        generations: 0,
        bestScore: 0,
        runtime: 0,
        speed: 0,
        showPrompt: false,
        showModal: false
    },
    methods: {
        newSimulation: function () {
            console.log("newSimulation");
        },
        run1: function () {
            console.log("run1");
        },
        runalways: function () {
            console.log("runalways");
        },
        pause: function () {
            console.log("pause");
        },
        resume: function () {
            console.log("resume");
        },
        save: function () {
            console.log("save");
        },
        load: function () {
            console.log("load");
        }
    }
});
"use strict";
cc._RF.push(module, '5dc5aA6qBBPi4Cn5Zf4Gvg1', 'start');
// Scripts/start.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {},
    //game start
    startGame: function startGame() {
        cc.director.loadScene('game', function () {
            console.log('game is loaded');
        });
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RF.pop();
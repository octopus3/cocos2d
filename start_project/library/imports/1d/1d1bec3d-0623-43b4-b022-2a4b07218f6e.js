"use strict";
cc._RF.push(module, '1d1bew9BiNDtLAiKksHIY9u', 'Star');
// Scripts/Star.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        // 主角和星星之间的距离小于这个数值时，就会完成收集
        pickRadius: 0
    },

    // use this for initialization
    onLoad: function onLoad() {},
    getPlayerDistance: function getPlayerDistance() {
        //  根据 player 节点位置判断距离
        var playerPos = this.game.player.getPosition();
        // 根据两点位置计算两点之间距离
        var dist = cc.pDistance(this.node.position, playerPos);
        return dist;
    },

    onPicked: function onPicked() {
        // 当星星被收集时，调用game 脚本中的借口，生成一个新的星星
        this.game.spawnNewStar();
        // 调用Game 脚本的得分方法
        this.game.gainScore();
        // 然后销毁当前星星节点 
        this.node.destroy();
    },

    update: function update(dt) {
        // 根据 Game  脚本中的计时器更新星星的透明度 
        var opacityRatio = 1 - this.game.timer / this.game.starDuration;
        var minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
        //每帧判断和主角之间的距离是否小于收集距离
        if (this.getPlayerDistance() < this.pickRadius) {
            // 调用收集行为
            this.onPicked();
            return;
        }
    }
});

cc._RF.pop();
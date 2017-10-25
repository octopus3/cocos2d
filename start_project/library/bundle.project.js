require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Game":[function(require,module,exports){
"use strict";
cc._RF.push(module, '4d172l2bn5K1bB+ilRxqg/n', 'Game');
// Scripts/Game.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        // 这个属性引用了星星预置资源
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 星星产生后消失时间的随机范围 
        maxStarDuration: 0,
        minStarDuration: 0,
        // 地面节点， 用于确定星星生成的高度 
        ground: {
            default: null,
            type: cc.Node
        },
        //player 节点 ，用于获取主角弹跳的高度,和控制主角行动开关 
        player: {
            default: null,
            type: cc.Node
        },
        //score Label的引用  
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        // 得分音效资源
        scoreAudio: {
            default: null,
            url: cc.AudioClip
        }
    },

    gainScore: function gainScore() {
        this.score += 1;
        // 更新scoreDisplay Label的文字
        this.scoreDisplay.string = 'Score:' + this.score.toString();
        // 播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },

    // use this for initialization
    onLoad: function onLoad() {
        // 获取地平面的y轴坐标
        this.groundY = this.ground.y + this.ground.height / 2;
        // 初始化计时器
        this.timer = 0;
        this.starDuration = 0;
        // 生成一个新的星星
        this.spawnNewStar();
        //初始化计分
        this.score = 0;
    },

    spawnNewStar: function spawnNewStar() {
        // 使用给定的模板在场景中生成一个新节点
        var newStar = cc.instantiate(this.starPrefab);
        // 将新增的节点添加到Canvas节点下面
        this.node.addChild(newStar);
        // 为星星设置一个随机位置 
        newStar.setPosition(this.getNewStarPosition());
        // 将 Game 组件的实例传入星星组件
        newStar.getComponent('Star').game = this;
        // 重置计时器， 根据消失时间范围随机取一个值
        this.starDuration = this.minStarDuration + cc.random0To1() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    },

    gameOver: function gameOver() {
        this.player.stopAllActions(); // 停止 player 节点的跳跃动作
        cc.director.loadScene('game');
    },

    getNewStarPosition: function getNewStarPosition() {
        var randX = 0;
        // 根据地平面位置和主角跳跃高度， 随机得到一个星星的y坐标
        var randY = this.groundY + cc.random0To1() * this.player.getComponent('Player').jumpHeight + 50;
        // 根据屏幕宽度， 随机得到一个星星 x 坐标
        var maxX = this.node.width / 2;
        randX = cc.randomMinus1To1() * maxX;
        //  返回星星坐标
        return cc.p(randX, randY);
    },
    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        //每帧更新计时器，超过限度还没有生成新的星星
        // 就会调用游戏失败逻辑
        if (this.timer > this.starDuration) {
            this.gameOver();
            return;
        }
        this.timer += dt;
    }
});

cc._RF.pop();
},{}],"Player":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'abd32adiXdI2qQQ5cK+hpeO', 'Player');
// Scripts/Player.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        // 主角跳跃高度
        jumpHeight: 0,
        // 主角跳跃持续时间
        jumpDuration: 0,
        // 最大移动速度
        maxMoveSpeed: 0,
        // 加速度
        accel: 0,
        jumpAudio: {
            default: null,
            url: cc.AudioClip
        }
    },
    setJumpAction: function setJumpAction() {
        // 跳跃上升
        var jumpUp = cc.moveBy(this.jumpDuration, cc.p(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        // 下落
        var jumpDown = cc.moveBy(this.jumpDuration, cc.p(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        // 添加一个回调函数， 用于在动作结束时调用我们定义的其他方法
        var callback = cc.callFunc(this.playJumpSound, this);
        // 不断重复
        return cc.repeatForever(cc.sequence(jumpUp, jumpDown, callback));
    },

    playJumpSound: function playJumpSound() {
        // 调用声音引擎播放声音
        cc.audioEngine.playEffect(this.jumpAudio, false);
    },

    setInputControl: function setInputControl() {
        var self = this;
        // 添加键盘事件监听
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            // 有键盘按下时  判断是否是我们指定的方向控制键， 并 设置向对应方向加速
            onKeyPressed: function onKeyPressed(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.a:
                        self.accLeft = true;
                        self.accRight = false;
                        break;
                    case cc.KEY.d:
                        self.accLeft = false;
                        self.accRight = true;
                        break;
                }
            },
            // 松开按键时，停止向该方向的加速
            onKeyReleased: function onKeyReleased(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.a:
                        self.accLeft = false;
                        break;
                    case cc.KEY.d:
                        self.accRight = false;
                        break;
                }
            }
        }, self.node);
    },
    // use this for initialization 使用以下函数初始化
    onLoad: function onLoad() {
        // 初始化跳跃动作
        this.jumpAction = this.setJumpAction();
        this.node.runAction(this.jumpAction);
        // 加速度方向开关
        this.accLeft = false;
        this.accRight = false;
        // 主角当前水平方向速度 
        this.xSpeed = 0;

        // 初始化键盘输入监听
        this.setInputControl();
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        //根据当前加速度方向每帧更新速度
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }
        //限制主角的速度不能超过最大值
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            // 如果速度到达了限制值，使用最大速度的方向 
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }
        // 根据当前速度更新主角的位置
        this.node.x += this.xSpeed * dt;
    }
});

cc._RF.pop();
},{}],"Star":[function(require,module,exports){
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
},{}],"start":[function(require,module,exports){
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
},{}]},{},["Game","Player","Star","start"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHRzL0dhbWUuanMiLCJhc3NldHMvU2NyaXB0cy9QbGF5ZXIuanMiLCJhc3NldHMvU2NyaXB0cy9TdGFyLmpzIiwiYXNzZXRzL1NjcmlwdHMvc3RhcnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBO0FBQ0k7O0FBRUE7QUFDRTtBQUNBO0FBQ0k7QUFDQTtBQUZRO0FBSVo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFGRztBQUlQO0FBQ0E7QUFDSTtBQUNBO0FBRkc7QUFJUDtBQUNBO0FBQ1E7QUFDQTtBQUZLO0FBSVg7QUFDRjtBQUNNO0FBQ0E7QUFGSztBQXpCRDs7QUErQlo7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7O0FBRUQ7QUFDQTtBQUNHO0FBQ0E7QUFDQTtBQUNFO0FBQ0E7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNGOztBQUVEO0FBQ0k7QUFDQTtBQUNBO0FBQ0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Q7QUFDQTtBQUNIOztBQUVEO0FBQ0k7QUFDQTtBQUNIOztBQUVEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDQztBQUNLO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0o7QUE3Rkc7Ozs7Ozs7Ozs7QUNBVDtBQUNJOztBQUVBO0FBQ0U7QUFDQztBQUNBO0FBQ0E7QUFDQztBQUNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZNO0FBVEg7QUFjWjtBQUNFO0FBQ0U7QUFDRjtBQUNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRjs7QUFFRDtBQUNJO0FBQ0E7QUFDSDs7QUFFRDtBQUNJO0FBQ0E7QUFDQztBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDTDtBQUNJO0FBQ0E7QUFDQTtBQVJQO0FBVUg7QUFDRDtBQUNBO0FBQ0k7QUFDSTtBQUNJO0FBQ0E7QUFDTDtBQUNJO0FBQ0E7QUFOUDtBQVFIO0FBekJ1QjtBQTJCaEM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0M7O0FBRUQ7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0c7QUFDSDtBQUNKO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNDO0FBQ0E7QUE5Rkc7Ozs7Ozs7Ozs7QUNBVDtBQUNJOztBQUVBO0FBQ0k7QUFDRTtBQUZNOztBQUtaO0FBQ0E7QUFHQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7QUFFRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDRjtBQUNFO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDSDtBQXhDRTs7Ozs7Ozs7OztBQ0FUO0FBQ0k7O0FBRUE7O0FBSUE7QUFDQTtBQUdBO0FBQ0E7QUFDSTtBQUNJO0FBQ0g7QUFFSjtBQUNEO0FBQ0E7O0FBRUE7QUFyQksiLCJzb3VyY2VzQ29udGVudCI6WyJjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAvLyDov5nkuKrlsZ7mgKflvJXnlKjkuobmmJ/mmJ/pooTnva7otYTmupBcclxuICAgICAgc3RhclByZWZhYjoge1xyXG4gICAgICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgICAgIHR5cGU6IGNjLlByZWZhYlxyXG4gICAgICB9LFxyXG4gICAgICAvLyDmmJ/mmJ/kuqfnlJ/lkI7mtojlpLHml7bpl7TnmoTpmo/mnLrojIPlm7QgXHJcbiAgICAgIG1heFN0YXJEdXJhdGlvbjogMCxcclxuICAgICAgbWluU3RhckR1cmF0aW9uOiAwLFxyXG4gICAgICAvLyDlnLDpnaLoioLngrnvvIwg55So5LqO56Gu5a6a5pif5pif55Sf5oiQ55qE6auY5bqmIFxyXG4gICAgICBncm91bmQ6e1xyXG4gICAgICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgICAgIHR5cGU6IGNjLk5vZGVcclxuICAgICAgfSxcclxuICAgICAgLy9wbGF5ZXIg6IqC54K5IO+8jOeUqOS6juiOt+WPluS4u+inkuW8uei3s+eahOmrmOW6pizlkozmjqfliLbkuLvop5LooYzliqjlvIDlhbMgXHJcbiAgICAgIHBsYXllcjp7XHJcbiAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgdHlwZTogY2MuTm9kZVxyXG4gICAgICB9LFxyXG4gICAgICAvL3Njb3JlIExhYmVs55qE5byV55SoICBcclxuICAgICAgc2NvcmVEaXNwbGF5OntcclxuICAgICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyDlvpfliIbpn7PmlYjotYTmupBcclxuICAgICAgc2NvcmVBdWRpbzp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgZ2FpblNjb3JlOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdGhpcy5zY29yZSArPSAxO1xyXG4gICAgICAgIC8vIOabtOaWsHNjb3JlRGlzcGxheSBMYWJlbOeahOaWh+Wtl1xyXG4gICAgICAgIHRoaXMuc2NvcmVEaXNwbGF5LnN0cmluZyA9ICdTY29yZTonK3RoaXMuc2NvcmUudG9TdHJpbmcoKTtcclxuICAgICAgICAvLyDmkq3mlL7lvpfliIbpn7PmlYhcclxuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMuc2NvcmVBdWRpbyxmYWxzZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAvLyDojrflj5blnLDlubPpnaLnmoR56L205Z2Q5qCHXHJcbiAgICAgICB0aGlzLmdyb3VuZFkgPSB0aGlzLmdyb3VuZC55ICsgdGhpcy5ncm91bmQuaGVpZ2h0LzI7XHJcbiAgICAgICAvLyDliJ3lp4vljJborqHml7blmahcclxuICAgICAgICAgdGhpcy50aW1lciA9IDA7XHJcbiAgICAgICAgIHRoaXMuc3RhckR1cmF0aW9uID0gMDtcclxuICAgICAgIC8vIOeUn+aIkOS4gOS4quaWsOeahOaYn+aYn1xyXG4gICAgICAgdGhpcy5zcGF3bk5ld1N0YXIoKTtcclxuICAgICAgIC8v5Yid5aeL5YyW6K6h5YiGXHJcbiAgICAgICB0aGlzLnNjb3JlID0gMDtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIHNwYXduTmV3U3RhcjogZnVuY3Rpb24oKXtcclxuICAgICAgICAvLyDkvb/nlKjnu5nlrprnmoTmqKHmnb/lnKjlnLrmma/kuK3nlJ/miJDkuIDkuKrmlrDoioLngrlcclxuICAgICAgICB2YXIgbmV3U3RhciA9IGNjLmluc3RhbnRpYXRlKHRoaXMuc3RhclByZWZhYik7XHJcbiAgICAgICAgLy8g5bCG5paw5aKe55qE6IqC54K55re75Yqg5YiwQ2FudmFz6IqC54K55LiL6Z2iXHJcbiAgICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZChuZXdTdGFyKTtcclxuICAgICAgICAgLy8g5Li65pif5pif6K6+572u5LiA5Liq6ZqP5py65L2N572uIFxyXG4gICAgICAgICBuZXdTdGFyLnNldFBvc2l0aW9uKHRoaXMuZ2V0TmV3U3RhclBvc2l0aW9uKCkpO1xyXG4gICAgICAgICAvLyDlsIYgR2FtZSDnu4Tku7bnmoTlrp7kvovkvKDlhaXmmJ/mmJ/nu4Tku7ZcclxuICAgICAgICAgbmV3U3Rhci5nZXRDb21wb25lbnQoJ1N0YXInKS5nYW1lID0gdGhpcztcclxuICAgICAgICAgLy8g6YeN572u6K6h5pe25Zmo77yMIOagueaNrua2iOWkseaXtumXtOiMg+WbtOmaj+acuuWPluS4gOS4quWAvFxyXG4gICAgICAgIHRoaXMuc3RhckR1cmF0aW9uID0gdGhpcy5taW5TdGFyRHVyYXRpb24gKyBjYy5yYW5kb20wVG8xKCkgKiAodGhpcy5tYXhTdGFyRHVyYXRpb24gLSB0aGlzLm1pblN0YXJEdXJhdGlvbik7XHJcbiAgICAgICAgdGhpcy50aW1lciA9IDA7XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBnYW1lT3ZlcjogZnVuY3Rpb24oKXtcclxuICAgICAgICB0aGlzLnBsYXllci5zdG9wQWxsQWN0aW9ucygpOy8vIOWBnOatoiBwbGF5ZXIg6IqC54K555qE6Lez6LeD5Yqo5L2cXHJcbiAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKCdnYW1lJyk7XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBnZXROZXdTdGFyUG9zaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIHJhbmRYID0gMDtcclxuICAgICAgICAvLyDmoLnmja7lnLDlubPpnaLkvY3nva7lkozkuLvop5Lot7Pot4Ppq5jluqbvvIwg6ZqP5py65b6X5Yiw5LiA5Liq5pif5pif55qEeeWdkOagh1xyXG4gICAgICAgIHZhciByYW5kWSA9IHRoaXMuZ3JvdW5kWSArIGNjLnJhbmRvbTBUbzEoKSAqIHRoaXMucGxheWVyLmdldENvbXBvbmVudCgnUGxheWVyJykuanVtcEhlaWdodCArIDUwO1xyXG4gICAgICAgIC8vIOagueaNruWxj+W5leWuveW6pu+8jCDpmo/mnLrlvpfliLDkuIDkuKrmmJ/mmJ8geCDlnZDmoIdcclxuICAgICAgICB2YXIgbWF4WCA9IHRoaXMubm9kZS53aWR0aC8yO1xyXG4gICAgICAgIHJhbmRYID0gY2MucmFuZG9tTWludXMxVG8xKCkgKiBtYXhYO1xyXG4gICAgICAgIC8vICDov5Tlm57mmJ/mmJ/lnZDmoIdcclxuICAgICAgICByZXR1cm4gY2MucChyYW5kWCxyYW5kWSk7XHJcbiAgICB9LFxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgICB1cGRhdGU6IGZ1bmN0aW9uKGR0KXtcclxuICAgICAgICAgIC8v5q+P5bin5pu05paw6K6h5pe25Zmo77yM6LaF6L+H6ZmQ5bqm6L+Y5rKh5pyJ55Sf5oiQ5paw55qE5pif5pifXHJcbiAgICAgICAgICAvLyDlsLHkvJrosIPnlKjmuLjmiI/lpLHotKXpgLvovpFcclxuICAgICAgICAgIGlmKHRoaXMudGltZXIgPiB0aGlzLnN0YXJEdXJhdGlvbil7XHJcbiAgICAgICAgICAgICAgdGhpcy5nYW1lT3ZlcigpO1xyXG4gICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMudGltZXIgKz0gZHQ7XHJcbiAgICAgfSxcclxufSk7XHJcbiIsImNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgIC8vIOS4u+inkui3s+i3g+mrmOW6plxyXG4gICAgICAganVtcEhlaWdodDogMCxcclxuICAgICAgIC8vIOS4u+inkui3s+i3g+aMgee7reaXtumXtFxyXG4gICAgICAganVtcER1cmF0aW9uOiAwLFxyXG4gICAgICAgIC8vIOacgOWkp+enu+WKqOmAn+W6plxyXG4gICAgICAgICBtYXhNb3ZlU3BlZWQ6IDAsXHJcbiAgICAgICAgIC8vIOWKoOmAn+W6plxyXG4gICAgICAgICBhY2NlbDogMCxcclxuICAgICAgICAganVtcEF1ZGlvOntcclxuICAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcclxuICAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXHJcbiAgICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgc2V0SnVtcEFjdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgLy8g6Lez6LeD5LiK5Y2HXHJcbiAgICAgICAgdmFyIGp1bXBVcCA9IGNjLm1vdmVCeSh0aGlzLmp1bXBEdXJhdGlvbixjYy5wKDAsdGhpcy5qdW1wSGVpZ2h0KSkuZWFzaW5nKGNjLmVhc2VDdWJpY0FjdGlvbk91dCgpKTtcclxuICAgICAgLy8g5LiL6JC9XHJcbiAgICAgICB2YXIganVtcERvd24gPSBjYy5tb3ZlQnkodGhpcy5qdW1wRHVyYXRpb24sY2MucCgwLC10aGlzLmp1bXBIZWlnaHQpKS5lYXNpbmcoY2MuZWFzZUN1YmljQWN0aW9uSW4oKSk7XHJcbiAgICAgICAvLyDmt7vliqDkuIDkuKrlm57osIPlh73mlbDvvIwg55So5LqO5Zyo5Yqo5L2c57uT5p2f5pe26LCD55So5oiR5Lus5a6a5LmJ55qE5YW25LuW5pa55rOVXHJcbiAgICAgICB2YXIgY2FsbGJhY2sgPSBjYy5jYWxsRnVuYyh0aGlzLnBsYXlKdW1wU291bmQsdGhpcyk7XHJcbiAgICAgICAvLyDkuI3mlq3ph43lpI1cclxuICAgICAgIHJldHVybiBjYy5yZXBlYXRGb3JldmVyKGNjLnNlcXVlbmNlKGp1bXBVcCxqdW1wRG93bixjYWxsYmFjaykpO1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgcGxheUp1bXBTb3VuZDogZnVuY3Rpb24oKXtcclxuICAgICAgICAvLyDosIPnlKjlo7Dpn7PlvJXmk47mkq3mlL7lo7Dpn7NcclxuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMuanVtcEF1ZGlvLGZhbHNlKTtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIHNldElucHV0Q29udHJvbDogZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgLy8g5re75Yqg6ZSu55uY5LqL5Lu255uR5ZCsXHJcbiAgICAgICAgIGNjLmV2ZW50TWFuYWdlci5hZGRMaXN0ZW5lcih7XHJcbiAgICAgICAgICAgICBldmVudDogY2MuRXZlbnRMaXN0ZW5lci5LRVlCT0FSRCxcclxuICAgICAgICAgICAgIC8vIOaciemUruebmOaMieS4i+aXtiAg5Yik5pat5piv5ZCm5piv5oiR5Lus5oyH5a6a55qE5pa55ZCR5o6n5Yi26ZSu77yMIOW5tiDorr7nva7lkJHlr7nlupTmlrnlkJHliqDpgJ9cclxuICAgICAgICAgICAgIG9uS2V5UHJlc3NlZDogZnVuY3Rpb24oa2V5Q29kZSxldmVudCl7XHJcbiAgICAgICAgICAgICAgICAgc3dpdGNoKGtleUNvZGUpe1xyXG4gICAgICAgICAgICAgICAgICAgICBjYXNlIGNjLktFWS5hOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hY2NMZWZ0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuYWNjUmlnaHQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgY2MuS0VZLmQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuYWNjTGVmdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFjY1JpZ2h0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgIC8vIOadvuW8gOaMiemUruaXtu+8jOWBnOatouWQkeivpeaWueWQkeeahOWKoOmAn1xyXG4gICAgICAgICAgICAgb25LZXlSZWxlYXNlZDogZnVuY3Rpb24oa2V5Q29kZSxldmVudCl7XHJcbiAgICAgICAgICAgICAgICAgc3dpdGNoKGtleUNvZGUpe1xyXG4gICAgICAgICAgICAgICAgICAgICBjYXNlIGNjLktFWS5hOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hY2NMZWZ0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGNjLktFWS5kOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFjY1JpZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgIH1cclxuICAgICAgICAgfSxzZWxmLm5vZGUpO1xyXG4gICAgfSxcclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvbiDkvb/nlKjku6XkuIvlh73mlbDliJ3lp4vljJZcclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG4gICAgLy8g5Yid5aeL5YyW6Lez6LeD5Yqo5L2cXHJcbiAgICB0aGlzLmp1bXBBY3Rpb24gPSB0aGlzLnNldEp1bXBBY3Rpb24oKTtcclxuICAgIHRoaXMubm9kZS5ydW5BY3Rpb24odGhpcy5qdW1wQWN0aW9uKTtcclxuICAgIC8vIOWKoOmAn+W6puaWueWQkeW8gOWFs1xyXG4gICAgdGhpcy5hY2NMZWZ0ID0gZmFsc2U7XHJcbiAgICB0aGlzLmFjY1JpZ2h0ID0gZmFsc2U7XHJcbiAgICAvLyDkuLvop5LlvZPliY3msLTlubPmlrnlkJHpgJ/luqYgXHJcbiAgICB0aGlzLnhTcGVlZCA9IDA7XHJcbiAgICBcclxuICAgIC8vIOWIneWni+WMlumUruebmOi+k+WFpeebkeWQrFxyXG4gICAgdGhpcy5zZXRJbnB1dENvbnRyb2woKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcbiAgICAgICAgLy/moLnmja7lvZPliY3liqDpgJ/luqbmlrnlkJHmr4/luKfmm7TmlrDpgJ/luqZcclxuICAgICAgICBpZih0aGlzLmFjY0xlZnQpe1xyXG4gICAgICAgICAgICB0aGlzLnhTcGVlZCAtPSB0aGlzLmFjY2VsICpkdDtcclxuICAgICAgICB9ZWxzZSBpZih0aGlzLmFjY1JpZ2h0KXtcclxuICAgICAgICAgICAgdGhpcy54U3BlZWQgKz0gdGhpcy5hY2NlbCAqZHQ7XHJcbiAgICAgICAgfVxyXG4gICAgIC8v6ZmQ5Yi25Li76KeS55qE6YCf5bqm5LiN6IO96LaF6L+H5pyA5aSn5YC8XHJcbiAgICAgaWYoTWF0aC5hYnModGhpcy54U3BlZWQpPnRoaXMubWF4TW92ZVNwZWVkKXtcclxuICAgICAgICAgLy8g5aaC5p6c6YCf5bqm5Yiw6L6+5LqG6ZmQ5Yi25YC877yM5L2/55So5pyA5aSn6YCf5bqm55qE5pa55ZCRIFxyXG4gICAgICAgICB0aGlzLnhTcGVlZCA9IHRoaXMubWF4TW92ZVNwZWVkICp0aGlzLnhTcGVlZCAvIE1hdGguYWJzKHRoaXMueFNwZWVkKTtcclxuICAgICB9XHJcbiAgICAgLy8g5qC55o2u5b2T5YmN6YCf5bqm5pu05paw5Li76KeS55qE5L2N572uXHJcbiAgICAgIHRoaXMubm9kZS54ICs9dGhpcy54U3BlZWQgKmR0O1xyXG4gICAgIH0sXHJcbn0pO1xyXG4iLCJjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIC8vIOS4u+inkuWSjOaYn+aYn+S5i+mXtOeahOi3neemu+Wwj+S6jui/meS4quaVsOWAvOaXtu+8jOWwseS8muWujOaIkOaUtumbhlxyXG4gICAgICAgICAgcGlja1JhZGl1czogMFxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIH0sXHJcbiAgICBnZXRQbGF5ZXJEaXN0YW5jZTogZnVuY3Rpb24oKXtcclxuICAgICAgICAvLyAg5qC55o2uIHBsYXllciDoioLngrnkvY3nva7liKTmlq3ot53nprtcclxuICAgICAgICB2YXIgcGxheWVyUG9zID0gdGhpcy5nYW1lLnBsYXllci5nZXRQb3NpdGlvbigpO1xyXG4gICAgICAgIC8vIOagueaNruS4pOeCueS9jee9ruiuoeeul+S4pOeCueS5i+mXtOi3neemu1xyXG4gICAgICAgIHZhciBkaXN0ID0gY2MucERpc3RhbmNlKHRoaXMubm9kZS5wb3NpdGlvbixwbGF5ZXJQb3MpO1xyXG4gICAgICAgIHJldHVybiBkaXN0O1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgb25QaWNrZWQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgLy8g5b2T5pif5pif6KKr5pS26ZuG5pe277yM6LCD55SoZ2FtZSDohJrmnKzkuK3nmoTlgJ/lj6PvvIznlJ/miJDkuIDkuKrmlrDnmoTmmJ/mmJ9cclxuICAgICAgICB0aGlzLmdhbWUuc3Bhd25OZXdTdGFyKCk7XHJcbiAgICAgICAgLy8g6LCD55SoR2FtZSDohJrmnKznmoTlvpfliIbmlrnms5VcclxuICAgICAgICB0aGlzLmdhbWUuZ2FpblNjb3JlKCk7XHJcbiAgICAgICAgLy8g54S25ZCO6ZSA5q+B5b2T5YmN5pif5pif6IqC54K5IFxyXG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XHJcbiAgICB9LFxyXG5cclxuICAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG4gICAgICAgICAvLyDmoLnmja4gR2FtZSAg6ISa5pys5Lit55qE6K6h5pe25Zmo5pu05paw5pif5pif55qE6YCP5piO5bqmIFxyXG4gICAgICAgICB2YXIgb3BhY2l0eVJhdGlvID0gMSAtIHRoaXMuZ2FtZS50aW1lci90aGlzLmdhbWUuc3RhckR1cmF0aW9uO1xyXG4gICAgICAgICB2YXIgbWluT3BhY2l0eSA9IDUwO1xyXG4gICAgICAgICB0aGlzLm5vZGUub3BhY2l0eSA9IG1pbk9wYWNpdHkgKyBNYXRoLmZsb29yKG9wYWNpdHlSYXRpbyAqICgyNTUgLSBtaW5PcGFjaXR5KSk7XHJcbiAgICAgICAvL+avj+W4p+WIpOaWreWSjOS4u+inkuS5i+mXtOeahOi3neemu+aYr+WQpuWwj+S6juaUtumbhui3neemu1xyXG4gICAgICAgICBpZih0aGlzLmdldFBsYXllckRpc3RhbmNlKCkgPCB0aGlzLnBpY2tSYWRpdXMpe1xyXG4gICAgICAgICAgICAgLy8g6LCD55So5pS26ZuG6KGM5Li6XHJcbiAgICAgICAgICAgICB0aGlzLm9uUGlja2VkKCk7XHJcbiAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgIH1cclxuICAgICAgfSxcclxufSk7XHJcbiIsImNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG4gICAgLy9nYW1lIHN0YXJ0XHJcbiAgICBzdGFydEdhbWU6ZnVuY3Rpb24oKXtcclxuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoJ2dhbWUnLGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdnYW1lIGlzIGxvYWRlZCcpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xyXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuXHJcbiAgICAvLyB9LFxyXG59KTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==
// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,
    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        hero:{
            type:cc.Node,
            default:null,
        },
        pause:cc.Button,
        btnSprite: {
            type: cc.SpriteFrame, 
            default: [],
            tooltip:'暂停按钮不同状态的图片',
        },
        bomb:{
            type:cc.Button,
            default:null,
        },
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         this.gamestatus=0;//0正常游戏 1 停止游戏 
     },

    start () {
        this.bomb = 0;
    },

    PauseButtonClick:function(){
        console.log(this.gamestatus);
            this.gamestatus+=1;
            if(this.gamestatus%2==1)
            {
               
                cc.game.pause();
            }
            else if(this.gamestatus%2==0)
            {
               cc.game.resume();
                this.gamestatus=0;
            }
            console.log("gamestatus = "+this.gamestatus+"gamestatus%2="+this.gamestatus%2);
    },
   


    // update (dt) {},
});

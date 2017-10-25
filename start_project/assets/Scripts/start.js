cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // use this for initialization
    onLoad: function () {
        
    },
    //game start
    startGame:function(){
        cc.director.loadScene('game',function(){
            console.log('game is loaded');
        })
        
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

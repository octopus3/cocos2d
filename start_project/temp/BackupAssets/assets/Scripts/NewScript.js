cc.Class({
    extends: cc.Component,

    properties: {
        game_loading:cc.Node
    },

    // use this for initialization
    onLoad: function () {
        var game_loading = this.game_loading.getComponent(cc.Animation);
        game_loading.play();
        cc.director.preloadScene('game');
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

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
        yellow_bullet:{
            type:cc.Prefab,
            default:null,
        },
        bullet_root:{
            type:cc.Node,
            default:null,
        },
        shootTime:0.25,
        main:{
            type:require('main'),
            default:null,
        },
    },

 
    shoot_bullet(){
        var b = cc.instantiate(this.yellow_bullet);     //获取子弹资源类型
        this.bullet_root.addChild(b);          //生成子弹
        var pos = this.node.getPosition();  //获取节点位置
        console.log('pos.x = '+pos.x +' '+'pos.y = ' + pos.y);
        pos.y += 450;            //调整子弹离飞机节点的y轴位置
        pos.x -= 11.5;
        b.setPosition(pos);     //设置子弹位置

    },

    start () {
         // 监听一个触摸事件;
        // e 是我们的触摸时间对象;
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function(e) {        //cc.Node.EvenType.TOUCH_MOVE 鼠标接触事件
            var delta = e.getDelta();   //获取当前光标与上一光标的偏移量
            this.node.x += delta.x;
            this.node.y += delta.y;
            
        }.bind(this), this);
        this.now_time = 0;
    },

    update (dt) { 
        this.now_time += dt;
        if(this.now_time >= this.shootTime) {
            this.now_time = 0;
            this.shoot_bullet();
        }
    },
});

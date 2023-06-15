<template>
  <div @mousedown="autoTrigger">
    <slot :x="x" :y="y"></slot>
  </div>
</template>

<script lang="ts">
/**
 * 此组件可以感知用户的拖拽操作并提供一个位置 
 * 这个位置可以被用户的拖拽影响 具体要在这个位置渲染什么元素 取决于
 * 两种使用方法 1 作为容器  对象在其中运动 2 作为包装器，对象在div的上面一层运动
 * 这个组件主要起到一个触发作用 属于是抽象组件 其本身没有大小 理论上 不应该有这个div 而应该使用slot本身的节点作为鼠标触发的
 * 对象 
 * 或者通过某种特殊方法来触发 如通过提供一个enter move函数来让外部触发移动
 */
export default {
  props:{
    isAutoTrigger:{
      type:Boolean,
      default:()=>true
    }
  },
  computed:{
    position(){
      return {x:this.x,y:this.y}
    }
  },
  data(){
    return {

        x:0,
        y:0,
      state:0
    }
  },
  methods:{
    /**
     * 外部调用的成员函数 进入移动状态
     */
    startMove(){
      this.mouseHandler("pressed",undefined)
    },
    autoTrigger(){
      if(this.isAutoTrigger)
        this.startMove()
    },
    //用于临时接受document的mouseup事件
    _releaseHandler(){
      this.mouseHandler("release",null)
    },
    _movehandler(e){
      this.mouseHandler("move",e)
    },
    //拖动功能实现
    /**
     * @param e {MouseEvent} 
     */
    mouseHandler(type,e){
      //
      
      switch(type){
        case "pressed":
          this.state=1;
          document.addEventListener("mouseup",this._releaseHandler)
          document.addEventListener("mousemove",this._movehandler)
        break;
        case "release":
          this.state=0;
          document.removeEventListener("mouseup",this._releaseHandler)
          document.removeEventListener("mousemove",this._movehandler)
        break;
        case "move":
          if(this.state==1){
            this.x+=e.movementX;
            this.y+=e.movementY;
          }
        break;
        default:
          throw new Error("错误,无效操作")
      }
    }
  }
}
</script>

<style>

</style>
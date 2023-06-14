<template>
  <div>
    <slot :data="position"></slot>
  </div>
</template>

<script>
/**
 * 此组件可以感知用户的拖拽操作并提供一个位置 
 * 这个位置可以被用户的拖拽影响 具体要在这个位置渲染什么元素 取决于
 * 使用的人
 */
export default {
  data(){
    return {
      position:{
        x:0,
        y:0
      }
    }
  },
  methods:{
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
          this.click();
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
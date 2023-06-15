<template>
  <Container id="nav">
        <HelloWorld/>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
    <svg width="1000" height="1000">
      <circle 
      @mousedown="e=>mouseHandler('pressed',e)"
      id="myCircle" :cx="x" :cy="y" :r="size/2" fill="black"/>
      <rect x="100" y="100" width="100" height="100" fill="yellow"> </rect>
    </svg>

    <Movable >
      <template v-slot="{x,y}">
        <div style="background-color: antiquewhite;height: 100px;width: 100px;position:absolute;" :style="{transform:`translate(${x}px,${y}px)`}">
        {{ x }},{{ y }}
        </div>
      </template>
    </Movable>

  </Container>
  
  <router-view />
</template>

<script lang="ts">
import {delay} from "ts-pystyle"
// import HelloWorld from "./components/HelloWorld.vue"
 import Container from "./components/FormPanel.vue"
import Movable from "./components/Movable.vue";
export default {
  components:{ Container, Movable },
  data(){
    return {
      size:100,
      x:0,
      y:0,
      //state =0 表示正常 1表示拖动中
      state:0
    }
  }
  ,
  methods:{
    async click(){
      this.size+=10;
      await delay(300);
      this.size-=10;

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

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

#myCircle{
  transition:r 0.3s ease-in-out;
}
</style>

<template>
  <div class="container" @contextmenu.capture="cancelDefault">
    <slot/>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

/**
 * 此容器提供一个类似窗口控件Panel区域的纯粹环境 ,替换掉文档环境
* 清理所有系统自己的反应 如右键菜单
* 除非元素自己设置右键菜单或者主动允许选择 否则一律不允许选择
 */
export default defineComponent({
  data(){
    return {

    }
  },
  methods:{
    /**
     * @param e {Event}
     */
cancelDefault(e){
  e.preventDefault();
}
  },
  mounted(){
    //取消右键菜单

  }
})
</script>

<style>
.container{
  user-select:none;
}
</style>
<template>
  <view>test.................</view>
  
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
  methods: {    
    
  },
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
}

</script>

<style>
/*每个页面公共css */
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 使容器高度占满视口 */
}
</style>

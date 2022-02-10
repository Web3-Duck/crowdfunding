<template>
  <div id="app">
    <Header></Header>
    <router-view/>
  </div>
</template>

<script>
import Header from '@/views/Header.vue'
export default {
  name: 'HelloWorld',
  components:{
    Header
  },
  beforeCreate(){
    this.$store.dispatch('setWebProvider')
  },
}
</script>


<style lang="less" scoped>
#app {
  font-family: Roboto, Segoe UI, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  // max-width: 750px;
  // width: 100%;
  // margin: 0 auto;
  background: url(./assets/back.png) no-repeat;
  background-size: 100% 100%;
  min-height: 100vh;
  padding-bottom: 30px;
  color: #fff;

}
</style>

<style lang="less">
a{
  color:rgb(0, 100, 200)
}
</style>
<template>
  <VHeader/>
  <router-view class="route" />
  <VFooter/>
</template>

<script>
import VHeader from '@/components/v-header.vue'
import VFooter from '@/components/v-footer.vue'

export default {
  name: 'App',
  components: {
    VHeader,
    VFooter
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  
  .route{
    min-height: 95vh;
  }
}
body{
 // background-color: #fff;
  background: url("@/assets/image/background4.png") 0 0  repeat;
}
</style>

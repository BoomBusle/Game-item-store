<template>
  <div class="home">
    <VMain/>
    <VDeliver/>
    <VSlider class="v-slider"/>
    <VAdvantages/>
  </div>
</template>

<script>
import VMain from '@/components/HomeView/v-main.vue'
import VDeliver from '@/components/HomeView/v-deliver.vue'
import VAdvantages from '@/components/HomeView/v-advantages.vue'
import VSlider from '@/components/HomeView/v-slider.vue'
import VMap from '@/components/HomeView/v-map.vue'


export default {
  name: 'HomeView',
  components: {
    VMain,
    VDeliver,
    VSlider,
    VAdvantages,
    VMap
  }
}
</script>

<style lang="scss" scoped>
.home{
  overflow-x: hidden;
}
</style>
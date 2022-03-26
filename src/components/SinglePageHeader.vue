<template>
  <div class="bg-twitter-blue mb-5" :style="{'height': height ? height : (subTitle === '' ? '180px' : '240px')}">
    <h1 class="display-1" style="color: white; padding: 60px 0 0 10vw">{{ title }}</h1>
    <p class="lead text-break" style="color: white; padding: 10px 0 0 10vw">{{ subTitle }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: ""
  },
  subTitle: {
    type: String,
    default: ""
  },
  height: {
    type: [Number, String],
    default: ''
  }
})
</script>

<style scoped>

</style>

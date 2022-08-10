<template>
  <div class="bg-twitter-blue mb-5 ps-5" :style="{'height': height ? height : (subTitle === '' ? '180px' : '240px')}">
    <h1 class="display-1 text-white pt-5">{{ title }}</h1>
    <p class="lead text-white text-break pt-2">{{ subTitle }}</p>
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

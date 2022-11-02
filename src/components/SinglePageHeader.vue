<template>
  <div class="bg-twitter-blue mb-5 px-3 px-md-5 py-5">
    <h1 class="display-1 text-white">{{ title }}</h1>
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

<template>
  <svg xmlns="http://www.w3.org/2000/svg" :class="`bi bi-play-circle-fill `+status" :width="width" :height="height" fill="currentColor" viewBox="0 0 16 16">
    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"/>
    <path fill="white" d="M 6.79 5.093 A 0.5 0.5 0 0 0 6 5.5 v 5 a 0.5 0.5 0 0 0 0.79 0.407 l 3.5 -2.5 a 0.5 0.5 0 0 0 0 -0.814 l -3.5 -2.5 z" />
  </svg>
</template>

<script setup lang="ts">
defineProps({
  status: String,
  width: String,
  height: String
})
</script>

<style scoped>

</style>
<template>
  <img :class="imageClass" :alt="imageAlt" v-lazy="{ src: imageSrc }" style="cursor: pointer"/>
  <!--<div style="position: absolute">
    <div style="position: fixed; top: 0; bottom: 0; left: 0; right: 0; height: 100vh; width: 100vw; background-color: black; z-index: 999999">
      ggg
    </div>
  </div>-->

</template>

<script setup lang="ts">
defineProps({
  imageClass: Object,
  imageAlt: {
    type: String,
    default: "Image"
  },
  imageSrc: String,//TODO default src
  blurhash: {
    type: String,
    default: ""
  },
})
</script>

<style scoped>

</style>

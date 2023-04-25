<template>
  <canvas class="fit" ref="BlurHashRef" />
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { decode, isBlurhashValid } from 'blurhash'
const props = defineProps({
  hashText: {
    type: String,
    default: ""
  }
})
const BlurHashRef = ref<HTMLCanvasElement>()

watchEffect(() => {
  const { value: canvas } = BlurHashRef
  // pre check
  if (props.hashText && canvas && isBlurhashValid(props.hashText).result) {
    const canvasLength = 20//square
    canvas.width = canvasLength
    canvas.height = canvasLength
    const pixels = decode(props.hashText, canvasLength,  canvasLength)
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }
    const imageData = ctx.createImageData(canvasLength, canvasLength)
    imageData.data.set(pixels)
    ctx.putImageData(imageData, 0, 0)
  }
})
</script>

<style scoped>

</style>

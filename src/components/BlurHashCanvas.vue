<template>
  <canvas class="fit" ref="canvasRef" />
</template>

<script setup lang="ts">
//from https://github.com/LightNovelShelf/Web/blob/master/src/components/BlurHash.vue
import { ref, watchEffect } from 'vue'
import { decode } from 'blurhash'
const props = defineProps<{ blurhash?: string }>()
const canvasRef = ref<HTMLCanvasElement>()
watchEffect(() => {
  const { value: canvas } = canvasRef
  if (props.blurhash && canvas) {
    const decodeSize = {
      width: 2 * 10,
      height: 2 * 10
    }
    canvas.width = decodeSize.width
    canvas.height = decodeSize.height
    const pixels = decode(props.blurhash, decodeSize.width, decodeSize.height)
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }
    const imageData = ctx.createImageData(decodeSize.width, decodeSize.height)
    imageData.data.set(pixels)
    ctx.putImageData(imageData, 0, 0)
  }
})
</script>

<style scoped>

</style>

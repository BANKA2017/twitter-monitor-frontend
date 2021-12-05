<template>
  <canvas ref="canvas" :width="width" :height="height" />
</template>

<script>
import {decode} from "blurhash";
export default {
  name: "blurHashCanvas",
  props: {
    hashText: {
      type: String,
      default: ""
    },
    width: {
      type: Number,
      default: 128
    },
    height: {
      type: Number,
      default: 128
    }
  },
  mounted() {
    this.draw()
  },
  methods: {
    draw: function () {
      const pixels = decode(this.hashText, Math.floor(this.width), Math.floor(this.height))
      const ctx = this.$refs.canvas.getContext("2d")
      const imageData = ctx.createImageData(Math.floor(this.width), Math.floor(this.height))
      imageData.data.set(pixels)
      ctx.putImageData(imageData, 0, 0)
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <div :style="{'display': 'grid', 'grid-template-columns': '1fr 5fr 1fr', 'align-items': 'center'}">
    <div class="hover-click" style="display: flex; justify-content: center; height: 100vh">
      <div style="padding-top: calc(50vh - 0.5em)">gg</div>
    </div>
    <div style="display: flex; justify-content: center">
      <img src="/test/banner.jpg" alt="header" style="max-width: 45vw;">
    </div>
    <div class="side-click" style="display: flex; justify-content: center; height: 100vh">
      <div style="padding-top: calc(50vh - 0.5em)">gg</div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, ref, watch} from "vue";
import {useStore} from "@/store";
import {onBeforeRouteUpdate, useRoute} from "vue-router";
import {decode} from "blurhash";
export default defineComponent({
  setup() {
    const store = useStore()
    const image = computed(() => store.state.image)
    const height = computed(() => store.state.siteHeight)
    const width = computed(() => store.state.width)

    let realOffset = ref(image.value.offset)

    const background = computed(() => {
      const pixels = decode("LEHV6nWB2yk8pyo0adR*.7kCMdnj", width.value, height.value);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx || width.value === 0 || height.value === 0) {return}console.log([width.value, height.value])
      const imageData = ctx.createImageData(width.value, height.value);
      imageData.data.set(pixels);
      ctx.putImageData(imageData, 0, 0);
      console.log(imageData)
      return ctx
    })


    return {image, realOffset, background}
  },
  beforeRouteEnter(to, from, next) {
    //if ((to.name === 'photo-avatar' || to.name === 'photo-banner') && from.name === undefined) {next({path: '/' + to.params.name + '/all/'})}
    //else if (to.name === 'photo-status-photo' && from.name === undefined) {next({path: '/' + to.params.name + '/status/' + to.params.status})}
    //else {
    //  console.log([to, from])
    //}
    next()
  }
})
</script>

<style scoped>
.hover-click:hover {
  background-color: rgba(0, 0, 0, 0.2);
}
</style>

<template >
  <div id="tw-collection">
    <div v-if="media.length < 1" class="px-1 py-1">
      NO CONTENT
    </div>
    <div v-else >
      <el-image :src="createRealMediaPath(realMediaPath, samePath)+media[0].cover" :preview-src-list="[createRealMediaPath(realMediaPath, samePath)+media[0].url]" :style="{width: '100%', 'border-radius': '14px', 'aspect-ratio': media[0].origin_info_width / media[0].origin_info_height, }" alt="cardImage" fit="cover" lazy preview-teleported hide-on-click-modal></el-image>
      <a :href="multiDestCarouselData[0].url" target="_blank" class="text-muted" v-if="multiDestCarouselData.length >= 1">
        <span class="d-block">{{multiDestCarouselData[0].vanity_url}}</span>
        <span class="d-block">{{multiDestCarouselData[0].description}}</span>
      </a>
      <div class="container x mandatory-scroll-snapping" style="align-items: center; width: 100%; " ref="twCollectionList" v-if="media.length > 1">
        <div class="handle el-backtop" @click="twCollectionList.scrollTo({behavior: 'smooth', left: twCollectionList.scrollLeft - 200})" style="z-index: 1; position: absolute; padding: 0.5rem; border-radius: 9999px; "><el-icon size="1em"><arrow-left height="1em" width="1em" status="text-primary" /></el-icon></div>
        <div class="handle el-backtop" @click="twCollectionList.scrollTo({behavior: 'smooth', left: twCollectionList.scrollLeft + 200})" style="z-index: 1; position: absolute; right: 2rem; padding: 0.5rem; border-radius: 9999px;"><el-icon size="1em"><arrow-right height="1em" width="1em" status="text-primary" /></el-icon></div>
        <a :href="multiDestCarouselData[index + 1].url" target="_blank" v-for="(mediaItem, index) in media.slice(1)" :key="mediaItem.url" >
          <el-image :src="createRealMediaPath(realMediaPath, samePath)+mediaItem.cover" style="width: 15vw; height: 15vw; max-width: 150px; max-height: 150px; min-width: 100px; min-height: 100px; scroll-snap-align: start; border-radius: 14px;" class="mx-1" :alt="multiDestCarouselData[index + 1].description"></el-image>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {computed, PropType, ref} from "vue";
import {Media} from "@/type/Content";
import {createRealMediaPath} from "@/share/Tools";
import {useStore} from "@/store";
import ArrowLeft from "@/icons/ArrowLeft.vue";
import ArrowRight from "@/icons/ArrowRight.vue";

const props = defineProps({
  media: {
    type: Array as PropType<Media[]>,
    default: []
  },
  multiDestCarouselData: {
    type: Array as PropType<{description: string, vanity_url: string, url: string}[]>,
    default: []
  }
})

const store = useStore()
const realMediaPath = computed(() => store.state.realMediaPath)
const samePath = computed(() => store.state.samePath)

let twCollectionList = ref<HTMLElement>()

</script>

<style scoped lang="scss">

.container::-webkit-scrollbar {
  display: none;
}

.container {
  display: flex;
  overflow: auto;
  flex: none;
  scrollbar-width: none;
  scroll-padding: 0 20px 0 80px;
  &.x {
    width: 100%;
    flex-flow: row nowrap;
    &.mandatory-scroll-snapping {
      scroll-snap-type: x mandatory;
    }
  }
  &>.handle {
    display: none;
  }
  &:hover>.handle {
    display: block;
    cursor: pointer;
  }
  &>div {
    text-align: center;
    scroll-snap-align: center;
    flex: none;
  }
}
</style>
<template>
  <div id="twCard">
    <div class="card mb-3" style="border-radius: 14px 14px 14px 14px">
      <a v-if="object?.url && object.type !== 'unified_card'" :href="(object.type === 'audiospace' ? 'https://twitter.com/i/spaces/' : '') + object.url" class="stretched-link text-decoration-none" target="_blank"></a>
      <template v-if="object.type === 'summary' || object.type === 'audio' || object.type === 'app' || object.type === 'moment'">
        <div class="row no-gutters">
          <el-image v-if="object.media === 1 && mediaState" :preview-src-list="[createRealMediaPath(realMediaPath, samePath)+latestMedia.cover]" :src="createRealMediaPath(realMediaPath, samePath)+latestMedia.cover" alt="cardImage" class="col-4 card-img border-right" fit="cover" lazy style="border-radius: 14px 0 0 14px" append-to-body hide-on-click-modal></el-image>
          <div class="col-8">
            <div class="card-body">
              <div class="row no-gutters">
                <p class="col-12 text-truncate card-title" style="color: black">{{ object.title }}</p>
                <template v-if="object.description !== ''"><small class="text-muted text-truncate col-12">{{ object.description }}</small><br></template>
                <small v-if="object.vanity_url !== ''" class="text-muted col-12"><link45deg height="1em" status="" width="1em" />{{ object.vanity_url }}</small>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="object.type === 'audiospace'">
        <div style="border-radius: 14px 14px 14px 14px; background-image: linear-gradient(61.63deg, rgb(45, 66, 255) -15.05%, rgb(156, 99, 250) 104.96%);">
          <div class="card-body">
            <p style="color: #ffffff">{{ userName }} · audiospace · <box-arrow-up-right height="1em" width="1em"/></p>
            <span style="color: #ffffff; font-weight: 500; font-size: 1.2rem">{{ tweetText }}</span>
          </div>
        </div>
      </template>
      <template v-else-if="object.type === 'unified_card'">
        <div v-if="mediaState && object.secondly_type === 'image_website' || object.secondly_type === 'image_app' || object.secondly_type === 'twitter_list_details'" :style="{width: '100%', height: 0, 'padding-bottom': paddingBottom( latestMedia.cover, latestMedia.origin_info_height, latestMedia.origin_info_width) + '%', 'border-radius': '14px 14px 0 0'}" class="no-gutters">
          <el-image :preview-src-list="[createRealMediaPath(realMediaPath, samePath)+latestMedia.cover]" :src="createRealMediaPath(realMediaPath, samePath)+latestMedia.cover" :style="{width: '100%', position: 'absolute', 'border-radius': '14px 14px 0 0'}" alt="cardImage" class="card-img-top" fit="cover" lazy @load="state.load = true" append-to-body hide-on-click-modal></el-image>
        </div>
        <template v-else-if="object.secondly_type === 'video_website' || object.secondly_type === 'video_app'" >
          <div v-if="mediaState" :class="`no-gutters embed-responsive embed-responsive-` + (ratio < 16 / 9 ? (ratio < 4 / 3 ? '1by1' : '4by3') :ratio > 16 / 9 ? '21by9' : '16by9')">
            <video id="videoPlayer" :poster="createRealMediaPath(realMediaPath, samePath) +media[0].cover" :src="createRealMediaPath(realMediaPath, samePath) +media[0].url" :type="media[0].content_type" class="border" controls loop playsinline preload="none" style="width: 100%; height: 100%; border-radius: 14px 14px 0 0; background-color: black"></video>
          </div>
        </template>
        <div v-else-if="object.secondly_type === 'image_carousel_website' || object.secondly_type === 'image_carousel_app' || object.secondly_type === 'image_multi_dest_carousel_website' || object.secondly_type === 'video_carousel_website' || object.secondly_type === 'video_carousel_app' || object.secondly_type === 'video_multi_dest_carousel_website'">
          <el-carousel v-if="mediaState" :style="`border-radius: 14px 14px 0 0`" class="card-img-top" indicator-position="outside" trigger="click" @change="changeMultiDestCarouselOrder">
            <el-carousel-item v-for="(mediaInfo, key) in media" :key="key" :name="key.toString()">
              <el-image v-if="object.secondly_type === 'image_carousel_website' || object.secondly_type === 'image_carousel_app' || object.secondly_type === 'image_multi_dest_carousel_website'" :preview-src-list="[createRealMediaPath(realMediaPath, samePath)+mediaInfo.cover]" :src="createRealMediaPath(realMediaPath, samePath)+mediaInfo.url" alt="cardImage" class="card-img-top" fit="cover" @load="state.load = true" lazy append-to-body hide-on-click-modal></el-image>
              <video v-else id="carouselVideoPlayer" :poster="createRealMediaPath(realMediaPath, samePath) +mediaInfo.cover" :src="createRealMediaPath(realMediaPath, samePath) +mediaInfo.url" :type="mediaInfo.content_type" class="border" controls loop playsinline preload="none" style="width: 100%; height: 100%; border-radius: 14px 14px 0 0; background-color: black"></video>
            </el-carousel-item>
          </el-carousel>
        </div>
        <span v-else class="text-center">{{ $t("tw_card.text.not_supported_type") }}</span>
        <div v-if="object.secondly_type === 'image_multi_dest_carousel_website' || object.secondly_type === 'video_multi_dest_carousel_website'" class="card-body position-relative">
          <a v-if="multiDestCarouselData && !object.app" :href="multiDestCarouselData[state.multiDestCarouselOrder].url" class="stretched-link text-decoration-none" target="_blank"></a>
          <template v-if="multiDestCarouselData[state.multiDestCarouselOrder].description !== ''"><small class="text-muted">{{ multiDestCarouselData[state.multiDestCarouselOrder].description }}</small><br></template>
          <!--<div v-if="object.app" class="mx-auto mt-2" >
                  <a v-for="app in object.app" :key="app.type" :href="app.type === 'android_app' ? 'https://play.google.com/store/apps/details?id=' + app.appid : 'https://apps.apple.com/' + app.country_code.toLowerCase() + '/app/id' + app.appid" class="text-decoration-none" target="_blank">
                    <el-button class="mx-1 mb-1" plain round size="small" type="primary">{{ device[app.type] }}</el-button>
                  </a>
                </div>-->
          <small class="text-muted"><link45deg height="1em" status="" width="1em" /> {{ multiDestCarouselData[state.multiDestCarouselOrder].vanity_url }}</small>
        </div>
        <div v-else-if="object.secondly_type === 'twitter_list_details'">
          <a v-if="userListData.url" :href="userListData.url" class="stretched-link text-decoration-none" target="_blank"></a>
          <div class="card-title text-muted ">
            <List class="ml-1" height="1em" status="text-dark" width="1em" /> <small>{{ $t("tw_card.text.list") }} · {{ $tc("tw_card.text.members_count", userListData.membersCount > 1 ? 2 : 1, [userListData.membersCount]) }}</small>
          </div>
          <div class="mb-1">
            <span class="font-weight-bolder ml-1">{{ userListData.content }}</span><br>
            <small class="font-weight-bold ml-1">{{ userListData.displayName }}</small>
            <Verified height="1em" status="text-primary" width="1em" />
            <small class="ml-1 mb-1">@{{ userListData.name }}</small>
          </div>
        </div>
        <div v-else class="card-body position-relative">
          <a v-if="object?.url && !object.app" :href="object.url" class="stretched-link text-decoration-none" target="_blank"></a>
          <p class="card-title" style="color: black">{{ object.title }}</p>
          <template v-if="object.description !== ''"><small class="text-muted">{{ object.description }}</small><br></template>
          <div v-if="object.app" class="mx-auto mt-2" >
            <a v-for="app in object.app" :key="app.type" :href="app.type === 'android_app' ? 'https://play.google.com/store/apps/details?id=' + app.appid : 'https://apps.apple.com/' + app.country_code.toLowerCase() + '/app/id' + app.appid" class="text-decoration-none" target="_blank">
              <el-button class="mx-1 mb-1" plain round size="small" type="primary">{{ device[app.type] }}</el-button>
            </a>
          </div>
          <small v-else-if="object?.vanity_url" class="text-muted"><link45deg height="1em" status="" width="1em" />{{ object.vanity_url }}</small>
        </div>
      </template>
      <template v-else>
        <div v-if="object.media === 1 && mediaState" class="border-bottom">
          <div :style="{width: '100%', height: 0, 'padding-bottom': paddingBottom( latestMedia.cover, latestMedia.origin_info_height, latestMedia.origin_info_width) + '%', 'border-radius': '14px 14px 0 0'}" class="no-gutters">
            <el-image :preview-src-list="[createRealMediaPath(realMediaPath, samePath)+latestMedia.cover]" :src="createRealMediaPath(realMediaPath, samePath)+latestMedia.cover" :style="{width: '100%', position: 'absolute', 'border-radius': '14px 14px 0 0'}" class="card-img-top" fit="cover" lazy alt="cardImage" @load="state.load = true" append-to-body hide-on-click-modal></el-image>
          </div>
        </div>
        <div class="card-body position-static">
          <p class="card-title" style="color: black">{{ object.title }}</p>
          <template v-if="object.description !== ''"><small class="text-muted">{{ object.description }}</small><br></template>
          <small v-if="object?.vanity_url" class="text-muted"><link45deg height="1em" status="" width="1em" />{{ object.vanity_url }}</small>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import List from "@/icons/List.vue"
import Verified from "@/icons/Verified.vue"
import BoxArrowUpRight from "@/icons/BoxArrowUpRight.vue"
import Link45deg from "@/icons/Link45deg.vue"
import {useStore} from "@/store"
import {computed, PropType, reactive, ref, Ref} from "vue"
import {Card, Media} from "@/type/Content"
import {createRealMediaPath} from "@/share/Tools"

const props = defineProps({
  object: {
    type: Object as PropType<Card>,
    default: () => ({})
  },
  media: {
    type: Array as PropType<Media[]>,
    default: () => []
  },
  mediaState: {
    type: Boolean,
    default: false
  },
  //only for audiospace
  userName: {
    type: String,
    default: "",
  },
  tweetText: {
    type: String,
    default: "",
  },
})

const device = {
  android_app: "Android",
  iphone_app: "iPhone",
  ipad_app: "iPad",
}
const state = reactive<{
  load: Ref<boolean>
  //height: number
  //position: string//'absolute'

  multiDestCarouselOrder: Ref<number>
}>({
  load: ref(false),
  multiDestCarouselOrder: ref(0)
})
const store = useStore()
const settings = computed(() => store.state.settings)
const realMediaPath = computed(() => store.state.realMediaPath)
const samePath = computed(() => store.state.samePath)
const latestMedia = computed(() => {
  if (props.media) {
    return props.media[props.media.length - 1]
  } else {
    return []
  }
})

const ratio = computed(() => props.media[0].origin_info_width / props.media[0].origin_info_height)
const multiDestCarouselData = computed(() => {
  if (props.object?.secondly_type === 'image_multi_dest_carousel_website' || props.object?.secondly_type === 'video_multi_dest_carousel_website') {
    let tmpData = []
    let tmpDescription = props.object.description.split('\\t')
    let tmpVanityUrl = props.object.vanity_url.split('\\t')
    let tmpUrl = props.object.url.split('\\t')
    let tmpOffset = 0
    for (; tmpOffset < tmpDescription.length; tmpOffset++) {
      tmpData.push({
        description: tmpDescription[tmpOffset],
        vanity_url: tmpVanityUrl[tmpOffset],
        url: tmpUrl[tmpOffset]
      })
    }
    return tmpData
  }
  return []
})
const userListData = computed(() => {
  let tmpData = {
    membersCount: 0,
    content: "",
    displayName: "",
    name: "",
    verified: 0,
    url: ""
  }
  let tmp: string[] = []
  if (props.object.secondly_type === 'twitter_list_details') {
    tmp = props.object.description.split('\\t')
    tmpData.membersCount = Number(tmp[0])
    tmpData.content = tmp[1]
    tmp = props.object.vanity_url.split('\\t')
    tmpData.displayName = tmp[0]
    tmpData.name = tmp[1]
    tmpData.verified = Number(tmp[2])
    tmpData.url = props.object.url
  }
  return tmpData
})

const paddingBottom = (link: string, height = 0, width = 0) => {
  if (state.load) {
    let img = new Image();
    img.src = createRealMediaPath(realMediaPath.value, samePath.value) + link;
    return (img.height / img.width) * 100
  } else {
    let getScale = /name=([0-9]+)x([0-9]+)/.exec(link);
    if (getScale) {
      return (Number(getScale[2]) / Number(getScale[1])) * 100;
    } else {
      return (height / width) * 100;
    }
  }
}

const changeMultiDestCarouselOrder = (callback: number) => {
  state.multiDestCarouselOrder = callback
}
//loadEvent: function () {
//  this.load = true
//  this.height = '100%'
//  this.position = 'reali'
//}
</script>

<style scoped>

</style>

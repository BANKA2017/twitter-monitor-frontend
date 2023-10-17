<template>
  <div id="twCard" @click="(e) => {e.stopPropagation()}">
    <div :class="{card: object.secondly_type !== 'image_collection_website', 'mb-3': true, 'background-second': !(object.type === 'unified_card' && object.secondly_type === 'image_collection_website'), }" style="border-radius: 14px 14px 14px 14px">
      <a v-if="object?.url && (object.secondly_type === 'media_with_details_horizontal' || object.secondly_type === 'twitter_article' || object.type !== 'unified_card') && object.type !== 'audiospace' && object.type !== 'broadcast' && object.type !== 'periscope_broadcast'" :href="object.url" class="stretched-link text-decoration-none" target="_blank"></a>
      <template v-if="object.type === 'summary' || object.type === 'audio' || object.type === 'app' || object.type === 'moment' || object.secondly_type === 'media_with_details_horizontal'">
        <div class="row no-gutters">
          <div class="col-4 col-md-3 border-right">
            <el-image v-if="object.media === 1 && mediaState" :preview-src-list="[createRealMediaPath(realMediaPath, samePath)+predictiveMedia.cover]" :src="createRealMediaPath(realMediaPath, samePath)+predictiveMedia.cover" alt="cardImage" fit="cover" lazy style="border-radius: 14px 0 0 14px; height: 100%;" class="ratio ratio-1x1" preview-teleported hide-on-click-modal></el-image>
          </div>
          <div class="col-8 col-md-9">
            <div style="height: 100%; " class="d-flex align-items-center">
              <div style="width: 100%;">
                <p class="text-truncate card-title" style="color: black;" v-if="object.title">{{ object.title }}</p>
                <small v-if="object.description !== ''" class="text-muted text-truncate d-block" style="width: 100%;">{{ object.description }}</small>
                <small v-if="object.vanity_url !== ''" class="text-muted d-block"><link45deg height="1em" status="" width="1em" />{{ object.vanity_url }}</small>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="object.type === 'audiospace'">
        <div style="border-radius: 14px 14px 14px 14px; background-image: linear-gradient(61.63deg, rgb(45, 66, 255) -15.05%, rgb(156, 99, 250) 104.96%);">
          <div class="card-body">
            <a :href="'https://twitter.com/i/spaces/' + object.url" class="text-decoration-none d-block" target="_blank">
              <el-image v-if="settings.onlineMode && state.audioSpaceObject.avatar" class="rounded-circle me-1" :src="createRealMediaPath(realMediaPath, samePath, 'userinfo')+state.audioSpaceObject.avatar.replace('https://', '')" alt="Avatar" style="height: 1em; width: 1em" />
              <p class="text-white d-inline-block"><full-text :full_text_original="state.audioSpaceObject.display_name ? state.audioSpaceObject.display_name : userName" :entities="[]" />
                <template v-if="state.audioSpaceObject.verified">
                  <verified height="1em" width="1em" status="text-primary" class="ms-1"/> ·
                </template>
                <template v-else>
                  · <span >audiospace</span> ·
                </template>
                {{ now < new Date(Number(state.audioSpaceObject.start)) ? 'Wait' : ((now > new Date(Number(state.audioSpaceObject.end)) && state.audioSpaceObject.end !== '0') ? 'Ended' : (state.audioSpaceObject.state !== 'Invalid' ? 'Live' : 'Invalid')) }}
              </p>
            </a>
            <div class="align-middle" v-if="state.updateAudioSpaceFlag"><span class="spinner-border text-white" role="status" aria-hidden="true"></span></div>
            <div v-else>
              <full-text style="font-size: 1.2rem" class="text-white fw-semibold mb-2" :full_text_original="state.audioSpaceObject.title ? state.audioSpaceObject.title : (object.description ? object.description : t('tw_card.text.someone_s_space', {someone: userName}))" :entities="[]" />
              <div class="text-white btn d-block rounded-pill border-white audio-space-play-button" style="cursor: pointer;" v-if="state.audioSpaceObject.state !== 'Invalid' && (state.audioSpaceObject.is_available_for_replay || (now >= new Date(Number(state.audioSpaceObject.start)) || state.audioSpaceObject.end === '0') )" @click="updateSpacesPlayerMeta">
                <span v-if="state.audioSpaceObject.id !== spacesPlayer.id">Play</span>
                <span v-else>. . .</span>
              </div>
              <!--<tw-space v-if="state.audioSpaceStatus.playback && state.audioSpaceObject.playback" :playback="state.audioSpaceObject.playback||''" :id="state.audioSpaceObject.id||''"/>-->
            </div>
          </div>
        </div>
      </template>
      <tw-broadcast v-else-if="object.type === 'broadcast' || object.type === 'periscope_broadcast'" :tweet_id="object.tweet_id" :cover="predictiveMedia.cover" :url="object.url" :title="object.title"/>
      <tw-collection v-else-if="object.type === 'unified_card' && object.secondly_type === 'image_collection_website'" :media="media" :multi-dest-carousel-data="multiDestCarouselData"/>
      <template v-else-if="object.type === 'unified_card' && object.secondly_type !== 'twitter_article' && object.secondly_type !== 'community_details'">
        <div v-if="mediaState && object.secondly_type === 'image_website' || object.secondly_type === 'image_app' || object.secondly_type === 'twitter_list_details'" :style="{width: '100%', height: 0, 'padding-bottom': paddingBottom( predictiveMedia.cover, predictiveMedia.original_info_height, predictiveMedia.original_info_width) + '%', 'border-radius': '14px 14px 0 0'}" class="no-gutters">
          <el-image :preview-src-list="[createRealMediaPath(realMediaPath, samePath)+predictiveMedia.cover]" :src="createRealMediaPath(realMediaPath, samePath)+predictiveMedia.cover" :style="{width: '100%', position: 'absolute', 'border-radius': '14px 14px 0 0'}" alt="cardImage" class="card-img-top" fit="cover" lazy @load="state.load = true" preview-teleported hide-on-click-modal></el-image>
        </div>
        <template v-else-if="object.secondly_type === 'video_website' || object.secondly_type === 'video_app'" >
          <div v-if="mediaState" :class="`no-gutters ratio ratio-` + (ratio < 16 / 9 ? (ratio < 4 / 3 ? '1x1' : '4x3') :ratio > 16 / 9 ? '21x9' : '16x9')">
            <video :id="`videoPlayer_${media[0].tweet_id}`" :poster="createRealMediaPath(realMediaPath, samePath) +media[0].cover" :src="createRealMediaPath(realMediaPath, samePath) +media[0].url" :type="media[0].content_type" class="border" controls loop playsinline preload="none" style="width: 100%; height: 100%; border-radius: 14px 14px 0 0; background-color: black"></video>
          </div>
        </template>
        <div v-else-if="object.secondly_type === 'image_carousel_website' || object.secondly_type === 'image_carousel_app' || object.secondly_type === 'image_multi_dest_carousel_website' || object.secondly_type === 'mixed_media_multi_dest_carousel_website' || object.secondly_type === 'video_carousel_website' || object.secondly_type === 'video_carousel_app' || object.secondly_type === 'video_multi_dest_carousel_website' || object.secondly_type === 'mixed_media_single_dest_carousel_website' || object.secondly_type === 'mixed_media_single_dest_carousel_app'" :style="{width: '100%', height: '100%', 'border-radius': '14px 14px 0 0'}">
          <el-carousel v-if="mediaState" style="border-radius: 14px 14px 0 0" indicator-position="outside" trigger="click" :autoplay="false" @change="changeMultiDestCarouselOrder">
            <el-carousel-item v-for="(mediaInfo, key) in media" :key="key" :name="key.toString()">
              <video v-if="mediaInfo.extension === 'mp4'" :id="`carouselVideoPlayer_${mediaInfo.tweet_id}_${key}`" :poster="createRealMediaPath(realMediaPath, samePath) +mediaInfo.cover" :src="createRealMediaPath(realMediaPath, samePath) +mediaInfo.url" :type="mediaInfo.content_type" class="border" controls loop playsinline preload="none" style="width: 100%; height: 100%; border-radius: 14px 14px 0 0; background-color: black"></video>
              <el-image v-else :id="mediaInfo.filename" :preview-src-list="[createRealMediaPath(realMediaPath, samePath)+mediaInfo.cover]" :src="createRealMediaPath(realMediaPath, samePath)+mediaInfo.url" alt="cardImage" class="card-img-top" fit="cover" preview-teleported hide-on-click-modal>
              </el-image>
            </el-carousel-item>
          </el-carousel>
        </div>
        <span v-else class="text-center">{{ t("tw_card.text.unsupported_type") }}</span>
        <div v-if="object.secondly_type === 'image_multi_dest_carousel_website' || object.secondly_type === 'video_multi_dest_carousel_website' || object.secondly_type === 'mixed_media_multi_dest_carousel_website'" class="card-body position-relative">
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
            <List class="ml-1" height="1em" status="text-dark" width="1em" /> <small>{{ t("tw_card.text.list") }} · {{ t("tw_card.text.members_count", userListData.membersCount > 1 ? 2 : 1, {count: userListData.membersCount}) }}</small>
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
          <div :style="{width: '100%', height: 0, 'padding-bottom': paddingBottom( predictiveMedia.cover, predictiveMedia.original_info_height, predictiveMedia.original_info_width) + '%', 'border-radius': '14px 14px 0 0'}" class="no-gutters">
            <video v-if="predictiveMedia.extension === 'mp4'" :id="`videoPlayer_${predictiveMedia.tweet_id}`" :poster="createRealMediaPath(realMediaPath, samePath) + predictiveMedia.cover" :src="createRealMediaPath(realMediaPath, samePath) + predictiveMedia.url" :type="predictiveMedia.content_type" class="border" controls loop playsinline preload="none" style="width: 100%; position: absolute; border-radius: 14px 14px 0 0; background-color: black"></video>
            <el-image v-else :preview-src-list="[createRealMediaPath(realMediaPath, samePath)+predictiveMedia.cover]" :src="createRealMediaPath(realMediaPath, samePath)+predictiveMedia.cover" style="width: 100%; position: absolute; border-radius: 14px 14px 0 0;" class="card-img-top" fit="cover" lazy alt="cardImage" @load="state.load = true" preview-teleported hide-on-click-modal></el-image>
          </div>
        </div>
        <div class="card-body position-static">
          <p class="card-title" style="color: black">{{ object.title }}</p>
          <p v-if="object.secondly_type === 'community_details'" >
              <small class="text-muted">{{ t("tw_card.text.members_count", {count: object.description}) }}</small>
          </p>
          <template v-else-if="object.description !== ''"><small class="text-muted">{{ object.description }}</small><br></template>
            <a v-if="object.secondly_type === 'community_details' && !settings.onlineMode" :href="object.url" target="_blank" class="btn btn-outline-primary rounded-pill d-block text-decoration-none">{{t('tw_card.text.view_community')}}</a>
            <router-link v-if="object.secondly_type === 'community_details' && settings.onlineMode" :to="object.url.replaceAll('https://twitter.com', '')" class="btn btn-outline-primary rounded-pill d-block text-decoration-none">{{t('tw_card.text.view_community')}}</router-link>
          <small v-else-if="object?.vanity_url" class="text-muted"><link45deg height="1em" status="" width="1em" />{{ object.vanity_url }}</small>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import List from "../icons/List.vue"
import Verified from "../icons/Verified.vue"
import BoxArrowUpRight from "../icons/BoxArrowUpRight.vue"
import Link45deg from "../icons/Link45deg.vue"
import {useStore} from "../store"
import {computed, onMounted, PropType, reactive, ref, Ref} from "vue"
import {AudioSpace, AudioUsersItem, Card, Media} from "../types/Content"
import {autoStopVideo, createRealMediaPath, Notice} from "../share/Tools"
import {useI18n} from "vue-i18n";
import FullText from "./FullText.vue";
import {request} from "../share/Fetch";
import {ApiAudioSpace} from "../types/Api";
import TwSpace from "./TwSpace.vue";
import TwBroadcast from "./TwBroadcast.vue";
import TwCollection from "./TwCollection.vue";

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
  updateAudioSpaceFlag: boolean
  audioSpaceObject: Ref<AudioSpace>
  audioSpaceStatus: {playback: boolean}
}>({
  load: ref(false),
  multiDestCarouselOrder: ref(0),
  updateAudioSpaceFlag: false,
  audioSpaceObject: ref({
    id: '',
    avatar: '',
    name: '',
    display_name: '',
    start: '0',
    end: '0',
    media_key: '',
    title: '',
    total: 0,
    verified: false,
    admins: [],
    listeners: [],
    speakers: [],
    is_available_for_replay: false
  }),
  audioSpaceStatus: {playback: false}
})
const {t} = useI18n()
const store = useStore()
const now = computed(() => store.state.now)
const settings = computed(() => store.state.settings)
const realMediaPath = computed(() => store.state.realMediaPath)
const samePath = computed(() => store.state.samePath)
const onlinePath = computed(() => store.state.onlinePath)
const spacesPlayer = computed(() => store.state.spacesPlayer)
const predictiveMedia = computed((): Media | {} => {
  if (props.media && props.media.some(x => x.extension === 'mp4')) {
    return props.media.filter(x => x.extension === 'mp4')[0]
  } else if (props.media && props.media.length) {
    return props.media[props.media.length - 1]
  } else {
    return {}
  }
})

const ratio = computed(() => props.media[0].original_info_width / props.media[0].original_info_height)
const multiDestCarouselData = computed(() => {
  if (props.object?.secondly_type === 'image_multi_dest_carousel_website' || props.object?.secondly_type === 'video_multi_dest_carousel_website' || props.object?.secondly_type === 'mixed_media_multi_dest_carousel_website' || props.object?.secondly_type === 'image_collection_website') {
    let tmpData = []
    let tmpDescription = props.object.description.split("\t")
    let tmpVanityUrl = props.object.vanity_url.split("\t")
    let tmpUrl = props.object.url.split("\t")
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
  //TODO fix request loop
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

if (props.object?.type === 'audiospace') {
  state.updateAudioSpaceFlag = true
  request<ApiAudioSpace>(onlinePath.value + '/api/v3/data/audiospace/?id=' + props.object.url).then(response => {
    if (response.code === 200) {
      state.audioSpaceObject = response.data
    } else {
      Notice(response.message, "error")
    }
    state.updateAudioSpaceFlag = false
  }).catch(e => {
    state.updateAudioSpaceFlag = false
    Notice(String(e), "error")
  })
}

const updateSpacesPlayerMeta = () => {
  if (state.audioSpaceObject.id !== spacesPlayer.value.id) {
    store.dispatch('updateSpacesPlayerItem', {key: 'id', value: state.audioSpaceObject.id})
    store.dispatch('updateSpacesPlayerItem', {key: 'link', value: state.audioSpaceObject.playback})
    store.dispatch('updateSpacesPlayerItem', {key: 'displayName', value: state.audioSpaceObject.display_name})
    store.dispatch('updateSpacesPlayerItem', {key: 'title', value: state.audioSpaceObject.title})
    store.dispatch('updateSpacesPlayerItem', {key: 'display', value: true})
  }
}

onMounted(() => {
  if (props.media.some(file => file.extension === 'mp4')) {
    if (props.object.type === 'unified_card' && (props.object.secondly_type === 'video_website' || props.object.secondly_type === 'video_app')) {
      const handle = document.getElementById(`videoPlayer_${props.media[0].tweet_id}`)
      if (handle) {
        autoStopVideo(handle)
      }
    } else {
      for (const index in props.media) {
        if (props.media[index].extension === 'mp4') {
          const handle = document.getElementById(`carouselVideoPlayer_${props.media[index].tweet_id}_${index}`)
          if (handle) {
            autoStopVideo(handle)
          }
        }
      }
    }
  }
})
//loadEvent: function () {
//  this.load = true
//  this.height = '100%'
//  this.position = 'reali'
//}
</script>

<style scoped lang="scss">
.audio-space-play-button {
  background: transparent;
  transition-duration: 150ms;
  &:hover {
    background: rgba(0,0,0,0.2);
  }
}
</style>

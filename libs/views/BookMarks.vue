<template>
  <div id="bookmarks">
    <div class="container">
      <div class="row">
        <div class="col-lg-3">
          <div style="position: sticky; top: 1rem;" >
            <div class="fs-2 fw-bold w-100 text-start">Twitter Monitor</div>
            <div class="mb-3" style="padding-left: 5px"><local-router /></div>
            <el-divider class="my-2" />
            <link-list v-if="!settings.onlineMode"/>
            <div v-else class="mb-2 text-muted"><small>NEST.MOE</small></div>
          </div>
        </div>
        <div class="col-lg-9">
          <div class="mt-2 mb-4">
            <input type="file" class="form-control " style="display: none" id="uploadFile" lang="zh" @change="ImportToBrowser(getDocumentById('uploadFile'), importToVuex)" accept="application/json">
            <div class="d-flex justify-content-between">
              <div >
                <div role="button" class="px-2 py-1 btn btn-primary mx-1" @click="Download('data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(bookmarks, null, 2)), 'bookmarks.json')">EXPORT</div>
                <label class="btn btn-primary rounded-2 px-2 py-1 mx-1 " for="uploadFile">IMPORT</label>
                <div role="button" :class="{'px-2': true, 'py-1': true, btn: true, 'btn-outline-primary': !state.mediaMode, 'btn-primary': state.mediaMode, 'mx-1': true,}" @click="state.mediaMode = !state.mediaMode">MEDIA ONLY</div>
              </div>
              <div role="button" class="px-2 py-1 btn btn-outline-danger mx-1" @click="state.cleanFlag = !state.cleanFlag" @dblclick="cleanAll()">{{state.cleanFlag ? 'DOUBLE CLICK TO CLEAN' : 'CLEAN ALL'}}</div>
            </div>
          </div>
          <div v-if="state.mediaMode" class="mb-2 row">
            <tweet-images class="col-md-6" style="max-width: 100%;" :unlimited="true" :list="mediaItems" v-for="mediaItems in constructBookMarkItem.filter(media => media.media).map(media => media.mediaObject)" :key="`${mediaItems.tweet_id}_${mediaItems.uid}`" :scale-down="true"/>
          </div>
          <div v-else class="mb-2 row" v-for="bookmark in constructBookMarkItem" :key="`${bookmark.type}_${bookmark.tweet_id}_${bookmark.uid}`">
            <div class="col-lg-9 order-1 order-lg-0">
              <TweetItem :tweet="bookmark" />
            </div>
            <div class="col-lg-3 order-0 order-lg-1">
              <h5 class="border-start border-4 border-primary px-1 mb-1"> {{getTime(bookmark.add_timestamp)}}</h5>
              <h5 class="border-start border-4 border-info px-1 mb-1"> @{{bookmark.user_info.name}}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useI18n} from "vue-i18n";
import LocalRouter from "../components/LocalRouter.vue";
import {useStore} from "../store";
import {computed, reactive} from "vue";
import LinkList from "../components/LinkList.vue";
import TweetItem from "../components/TweetItem.vue";
import {BookMark, Card, Entity, Media, PollItem, Quote, UserInfo, Vibe} from "../types/Content";
import {Download, ImportToBrowser} from "../share/Tools";
import TweetImages from "../components/TweetImages.vue";

const {t} = useI18n()
const store = useStore()
const bookmarks = computed(() => store.state.bookmarks)
const settings = computed(() => store.state.settings)

const state = reactive<{
  cleanFlag: boolean
  mediaMode: boolean
}>({
  cleanFlag: false,
  mediaMode: false
})

const cleanAll = () => {
  if (state.cleanFlag) {
    store.dispatch('updateBookMarks', {
      cleanAll: true,
      tweet: {}
    })
  }
  state.cleanFlag = false
}
const getDocumentById = (id: string) => {
  return document.getElementById(id)
}
const importToVuex = (content: BookMark[]) => {
  console.log(content)
  store.dispatch('updateBookMarks', {
    import: true,
    tweet: content
  })
}

const getTime = (date: string | number | Date) => {
  if (typeof date === 'string') {
    date = Number(date)
  }
  const tmpDate = new Date(date)
  return `${tmpDate.getFullYear()}-${(tmpDate.getMonth() + 1)}-${tmpDate.getDate()} ${tmpDate.getHours()}:${tmpDate.getMinutes()}:${tmpDate.getSeconds()}`
}

const constructBookMarkItem = computed(() => bookmarks.value.map(x => ({
    tweet_id: x.tweet_id,
    tweet_id_str: x.tweet_id,
    conversation_id_str: x.tweet_id,
    uid: x.uid,
    uid_str: x.uid,
    name: x.name,
    display_name: x.display_name,
    mediaObject: x.media.map(media => {
      let parseURL = new URL(`https://${media.url}`)
      let filename = ''
      let basename = ''
      let extension = ''
      //basename
      if (!parseURL.pathname.endsWith('/')) {
        basename = parseURL.pathname.split("/").pop() || ''
        if (basename) {
          const parseBasename = basename.split(".")
          if (parseBasename.length >= 2) {
            extension = parseBasename.pop() || ''
            filename = parseBasename.join(".")
          }
        }
      }
      return {...media, source: "tweets", basename, filename, extension, tweet_id: x.tweet_id, uid: x.uid, original_info_height: 720 * 9 / 16, original_info_width: 720, content_type: extension === 'mp4' ? "video/mp4" : `image/${extension === 'jpg' ? 'jpeg' : extension}`}
    }),
    media: x.media.length ? 1 : 0,
    video: x.media.some(y => y.is_video),
    card: '',
    poll: 0,
    quote_status: '0',
    quote_status_str: '0',
    source: t('timeline.side_tags.bookmarks'),
    full_text: x.text,
    full_text_original: x.text,
    retweet_from: x?.retweet_from || '',
    retweet_from_name: x?.retweet_from_name || '',
    dispute: 0,
    time: x.timestamp,
    type: x.type,
    entities: x?.entities || [],
    pollObject: [],
    quoteObject: {},
    user_info: {name: x.name, display_name: x.display_name, header: ''},
    add_timestamp: x.add_timestamp
})).reverse())



</script>

<style scoped>

</style>
<template>
  <div id="bookmarks">
    <div class="container">
      <div class="row my-5">
        <div class="col-lg-3">
          <div style="position: sticky; top: 2rem;" >
            <div class="fs-2 fw-bold w-100 text-start">Twitter Monitor</div>
            <div class="mb-3" style="padding-left: 5px"><local-router /></div>
            <el-divider class="my-2" />
            <link-list v-if="!settings.onlineMode"/>
            <div v-else class="mb-2 text-muted"><small>NEST.MOE</small></div>
          </div>
        </div>
        <div class="col-lg-9 row">
          <div class="my-2">
            <div role="button" class="px-2 py-1 btn btn-outline-danger mx-1" @click="cleanAll()">CLEAN ALL</div>
            <div role="button" class="px-2 py-1 btn btn-primary mx-1" @click="Download('data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(bookmarks, null, 2)), 'bookmarks.json')">EXPORT</div>
            <label class="btn btn-primary rounded-2 px-2 py-1 mx-1" for="uploadFile">IMPORT</label>
            <input type="file" class="form-control " style="display: none" id="uploadFile" lang="zh" @change="ImportToBrowser(getDocumentById('uploadFile'), importToVuex)" accept="application/json">
          </div>
          <div class="col-md-6 mb-2" v-for="bookmark in constructBookMarkItem.reverse()" :key="`${bookmark.type}_${bookmark.tweet_id}_${bookmark.uid}`">
            <div class="mb-1">
              <span class="border-start border-4 border-primary px-1">ADDED AT {{getTime(bookmark.add_timestamp)}}</span>
            </div>
            <TweetItem :tweet="bookmark" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useI18n} from "vue-i18n";
import LocalRouter from "@/components/LocalRouter.vue";
import {useStore} from "@/store";
import {computed} from "vue";
import LinkList from "@/components/LinkList.vue";
import TweetItem from "@/components/TweetItem.vue";
import {BookMark, Card, Entity, Media, PollItem, Quote, UserInfo, Vibe} from "@/type/Content";
import {Download, ImportToBrowser} from "@/share/Tools";

const {t} = useI18n()
const store = useStore()
const bookmarks = computed(() => store.state.bookmarks)
const settings = computed(() => store.state.settings)

const cleanAll = () => {
  store.dispatch('updateBookMarks', {
    cleanAll: true,
    tweet: {}
  })
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
    media: x.media,
    video: x.media.some(y => y.is_video),
    card: '',
    poll: 0,
    quote_status: '0',
    quote_status_str: '0',
    source: 'bookmark',
    full_text: x.text,
    full_text_origin: x.text,
    retweet_from: x?.retweet_from || '',
    retweet_from_name: x?.retweet_from_name || '',
    dispute: 0,
    time: x.timestamp,
    type: x.type,
    entities: [],
    pollObject: [],
    mediaObject: [],
    quoteObject: {},
    user_info: {name: x.name, display_name: x.display_name, header: ''},
    add_timestamp: x.add_timestamp
})))



</script>

<style scoped>

</style>
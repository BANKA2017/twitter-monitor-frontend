<template>
  <div id="search" @keyup.enter="$router.push({path: '/search/', query: queryObject})">
  <div class="mb-2" v-if="!(tweetModeValue === 'search' && state.mode === 2)" id="searchTweets">
    <el-input v-model="state.keywords" :placeholder="t('search.normal_search.input_text_here')" clearable type="text" size="large" @focus="state.activeInput = true" @blur="state.activeInput = false"/>
    <template v-if="state.keywords === 'help' || state.keywords === '帮助'">
      <search-tips class="my-4"/>
    </template>
    <search-typeahead v-if="settings.onlineMode" :query-string="state.keywords" :active="state.activeInput" />
  </div>
  <div class="d-grid gap-2" v-if="tweetModeValue === 'search'" >
    <button :class="{'btn': true, 'btn-sm': true, 'btn-outline-primary': true, 'mb-4': state.mode === 2, 'my-4': state.mode !== 2, 'active': state.mode === 2,}" @click="state.mode = ((state.mode === 2) ? 0 : 2)" role="button">{{ t('search.normal_search.advanced_search') }}</button>
  </div>
  <template v-if="tweetModeValue === 'search' && state.mode === 2">
    <!-- advancedSearch -->
    <!--text-->
    <div class="input-group mb-1" id="searchInclude">
      <div class="input-group-text">
        <div class="form-check">
          <input type="checkbox" class="form-check-input" id="searchTextOrMode" v-model="state.advancedSearch.keywords.orMode">
          <label class="custom-control-label" for="searchTextOrMode">OR</label>
        </div>
      </div>
      <div class="input-group-text">
        <div class="form-check">
          <input type="checkbox" class="form-check-input" id="searchTextNotMode" v-model="state.advancedSearch.keywords.notMode">
          <label class="custom-control-label" for="searchTextNotMode">NOT</label>
        </div>
      </div>
      <input type="text" class="form-control" aria-label="Text input with checkbox" :placeholder="t('search.advanced_search.all_of_these_words')" v-model="state.advancedSearch.keywords.text">
    </div>
    <label for="searchInclude" class="text-muted my-2 mb-4 form-label">{{ t('search.advanced_search.example_text_include') }}</label>
    <!--user include-->
    <div class="input-group mb-1" id="searchUserInclude">
      <div class="input-group-text">
        <div class="form-check">
          <input type="checkbox" class="form-check-input" id="searchUserOrMode" v-model="state.advancedSearch.user.andMode">
          <label class="custom-control-label" for="searchUserOrMode">AND</label>
        </div>
      </div>
      <div class="input-group-text">
        <div class="form-check">
          <input type="checkbox" class="form-check-input" id="searchUserNotMode" v-model="state.advancedSearch.user.notMode">
          <label class="custom-control-label" for="searchUserNotMode">NOT</label>
        </div>
      </div>
      <input type="text" class="form-control" aria-label="Text input with checkbox" :placeholder="t('search.advanced_search.from_this_accounts')" v-model="state.advancedSearch.user.text">
    </div>
    <label class="text-muted my-2 mb-4" for="searchUserInclude">{{ t("search.advanced_search.example_from_this_accounts") }}</label>
    <!-- time -->
    <div class="input-group" id="searchTime">
      <input v-model="state.advancedSearch.start" :max="now.getFullYear() + '-' + (now.getMonth() + 1).toString().padStart(2, '0') + '-' + now.getDate().toString().padStart(2, '0')" class="form-control" placeholder="since" type="date">
      <span id="searchTimeTo" class="input-group-text">-></span>
      <input v-model="state.advancedSearch.end" :max="now.getFullYear() + '-' + (now.getMonth() + 1).toString().padStart(2, '0') + '-' + now.getDate().toString().padStart(2, '0')" :min="state.advancedSearch.start" class="form-control" placeholder="to" type="date">
      <button id="searchTimeDel" class="btn btn-outline-danger" type="button" @click="() => {state.advancedSearch.start = ''; state.advancedSearch.end = ''}">
        {{ t('search.advanced_search.clean') }}
      </button>
    </div>
    <label for="searchTime" class="text-muted my-2 form-label">{{ t('search.advanced_search.example_search_time') }}</label>

    <div class="btn-group" role="group" style="width: 100%">
      <button type="button" :class="{'btn': true, 'btn-outline-primary': true, 'btn-sm': true, 'active': state.advancedSearch.tweetType.type === 0}" @click="state.advancedSearch.tweetType.type = 0">{{ t('search.advanced_search.nav_bar.all') }}</button>
      <button type="button" v-if="!settings.onlineMode" :class="{'btn': true, 'btn-outline-primary': true, 'btn-sm': true, 'active': state.advancedSearch.tweetType.type === 1}" @click="state.advancedSearch.tweetType.type = 1">{{ t('search.advanced_search.nav_bar.original') }}</button>
      <button type="button" :class="{'btn': true, 'btn-outline-primary': true, 'btn-sm': true, 'active': state.advancedSearch.tweetType.type === 2}" @click="state.advancedSearch.tweetType.type = 2">{{ t('search.advanced_search.nav_bar.retweet') }}</button>
      <button type="button" :class="{'btn': true, 'btn-outline-primary': true, 'btn-sm': true, 'active': state.advancedSearch.tweetType.media}" @click="state.advancedSearch.tweetType.media = !state.advancedSearch.tweetType.media">{{ t('search.advanced_search.nav_bar.media_only') }}</button>
      <button role="button" v-if="!settings.onlineMode" :class="{'btn': true, 'btn-outline-primary': true, 'btn-sm': true, 'active': state.advancedSearch.order}" @click="state.advancedSearch.order = !state.advancedSearch.order" >{{ t('search.advanced_search.nav_bar.reverse') }}</button>
    </div>
    <!--<div class="btn-group btn-block" role="group">
         <button type="button" :class="{'btn': true, 'btn-outline-primary': true, 'btn-sm': true, 'active': search.advancedSearch.tweetType.media !== 0}" @click="search.advancedSearch.tweetType.media = ((search.advancedSearch.tweetType.media === 0) ? 1 : 0)">视频</button>
         <button type="button" :class="{'btn': true, 'btn-outline-primary': true, 'btn-sm': true, 'active': search.advancedSearch.tweetType.media !== 0}" @click="search.advancedSearch.tweetType.media = ((search.advancedSearch.tweetType.media === 0) ? 1 : 0)">投票</button>
         <button type="button" :class="{'btn': true, 'btn-outline-primary': true, 'btn-sm': true, 'active': search.advancedSearch.tweetType.media !== 0}" @click="search.advancedSearch.tweetType.media = ((search.advancedSearch.tweetType.media === 0) ? 1 : 0)">含有链接</button>
         <button type="button" :class="{'btn': true, 'btn-outline-primary': true, 'btn-sm': true, 'active': search.advancedSearch.tweetType.media !== 0}" @click="search.advancedSearch.tweetType.media = ((search.advancedSearch.tweetType.media === 0) ? 1 : 0)">含有引用</button>
       </div>-->
    <div class="d-grid gap-2 mt-2" v-if="!settings.onlineMode && adminMode">
      <button :class="{'btn': true, 'btn-outline-dark': true, 'btn-sm': true, 'active': state.advancedSearch.hidden}" role="button" @click="state.advancedSearch.hidden = !state.advancedSearch.hidden">{{ t('search.advanced_search.nav_bar.hidden') }}</button>
    </div>
    <div class="my-1"></div>
    <i18n-t class="text-muted" keypath="search.advanced_search.tips.line1.text" tag="label">
      <template #or_mode>
        <code>{{ t('search.advanced_search.tips.line1.or_mode') }}</code>
      </template>
      <template #and_mode>
        <code>{{ t('search.advanced_search.tips.line1.and_mode') }}</code>
      </template>
      <template #not_mode>
        <code>{{ t('search.advanced_search.tips.line1.not_mode') }}</code>
      </template>
    </i18n-t>
    <label class="text-muted form-label">{{ t('search.advanced_search.tips.line2') }}</label>
    <div class="my-1"></div>
    <router-link :to="{path: '/search/', query: queryObject}" type="button" class="btn btn-primary text-right">{{ t('search.advanced_search.search') }}</router-link>
  </template>
  <div class="list-group my-2" v-if="state.keywords && state.mode === 0 && state.keywords.slice(0, 1) !== '!'">
    <template v-if="state.keywords && state.keywords.slice(0, 1) !== '!' && state.mode === 0">
      <!--user-->
      <template v-if="state.keywords.slice(0, 1) === '@'">
        <router-link :key="s" :to="`/`+user.name+`/all`" class="list-group-item list-group-item-action" v-for="(user, s) in correctUserList"><b>{{user.display_name }}</b> | <small>@{{ user.name }}</small> > <small>{{ user.project + ' (' + user.tag + ')' }}</small></router-link>
        <!--<div class="my-3" v-if="search.keywords.slice(1).length > 0"></div>-->
      </template>
      <!--hashtag && cashtag-->
      <router-link :to="`/hashtag/`+state.keywords.slice(1)" class="list-group-item list-group-item-action" v-if="state.keywords.slice(0, 1) === '#'">{{ t('search.nav_list.search_by_tag', [state.keywords]) }}
      </router-link>
      <router-link :to="`/cashtag/`+state.keywords.slice(1)" class="list-group-item list-group-item-action" v-if="state.keywords.slice(0, 1) === '$'">{{ t('search.nav_list.search_by_tag', [state.keywords]) }}
      </router-link>
      <!--status-->
      <router-link :to="`/i/status/`+state.keywords" class="list-group-item list-group-item-action" v-if="state.keywords > 0 && (state.keywords??'').match(/\d+/g)?.[0] === state.keywords">
        {{ t('search.nav_list.search_by_tweet_id', [state.keywords]) }}
      </router-link>
      <router-link :to="{path: '/search/', query: queryObject}" class="list-group-item list-group-item-action" v-if="state.mode === 0">
        <span class="d-inline-block text-truncate" style="max-width: 250px;">{{ t('search.nav_list.search_by_text', [state.keywords]) }}</span>
      </router-link>
    </template>
  </div>
</div>
</template>

<script setup lang="ts">
//TODO add search props local
import SearchTips from "./SearchTips.vue";
import {useI18n} from "vue-i18n";
import {computed, reactive, ref, Ref, watch,} from "vue";
import {useStore} from "../store";
import {RouteLocationNormalized, useRoute, useRouter} from "vue-router";
import {Equal, NullSafeParams, VerifyQueryString} from "../share/Tools";
import {AdvancedSearchQuery} from "../types/Content";
import SearchTypeahead from "./SearchTypeahead.vue";

const {t} = useI18n()
const state = reactive<{
  keywords: string
  mode: 0 | 1 | 2 | 3 | 4//0->keywords, 1->date, 2->advanced
  advancedSearch: {
    user: { text: string; andMode: boolean; notMode: boolean; },
    keywords: { text: string; orMode: boolean; notMode: boolean; },
    tweetType: {
      type: 0 | 1 | 2 | 3 | 4;//0-> all, 1-> original, 2-> retweet
      media: boolean;//media
    },
    start: string;//format 2022-02-10
    end: string;//same
    order: boolean;//正序0, 倒序1
    hidden: boolean;
  }
  name: string
  activeInput: boolean
}>({
  keywords: '',
  mode: 0,//0->keywords, 1->date, 2->advanced
  advancedSearch: {
    user: {"text": "", "andMode": false, "notMode": false,},
    keywords: {"text": "", "orMode": false, "notMode": false,},
    tweetType: {
      type: 0,//0-> all, 1-> original, 2-> retweet//online mode couldn't use mode '1' -> original
      media: false,//media
    },
    start: "",
    end: "",
    order: false,//正序0, 倒序1
    hidden: false,
  },
  name: "",
  activeInput: false
})

const route = useRoute()
const router = useRouter()
const store = useStore()
const tweetModeValue = computed(() => store.state.tweetMode)
const now = computed(() => store.state.now)
const settings = computed(() => store.state.settings)
const project = computed(() => store.state.project)
const userList = computed(() => store.state.userList)
const adminMode = computed(() => store.state.adminMode)
const userTimeZone = computed(() => store.state.userTimeZone)
const correctUserList = computed(() => userList.value.filter(x => state.keywords.slice(1).length > 0 && (RegExp(state.keywords.slice(1), 'i').test(x.name) || RegExp(state.keywords.slice(1)).test(x.display_name))))

watch(() => state.mode, () => {
  if (state.mode === 2) {//时间搜索
    if (state.name && tweetModeValue.value === 'timeline') {
      state.advancedSearch.user.text = '@' + state.name
    }
    if (route.name !==  'search'){
      router.push({path: '/search/'})
    }
  }
})

const defaultAdvancedSearchQueryValues: AdvancedSearchQuery = {
  q: '',
  text_or_mode: '0',
  text_not_mode: '0',
  user: '',
  user_and_mode: '0',
  user_not_mode: '0',
  tweet_type: '0',
  tweet_media: '0',
  start: '',
  end: '',
  order: '0',
  advanced: '1',
  hidden: '0'
}
const queryObject = computed((): AdvancedSearchQuery => {
  if (state.mode === 2) {
    let tmpQueryObject: AdvancedSearchQuery = {
      q: state.advancedSearch.keywords.text.trim(),
      text_or_mode: Equal(state.advancedSearch.keywords.orMode),
      text_not_mode: Equal(state.advancedSearch.keywords.notMode),
      user: state.advancedSearch.user.text,
      user_and_mode: Equal(state.advancedSearch.user.andMode),
      user_not_mode: Equal(state.advancedSearch.user.notMode),
      tweet_type: String(state.advancedSearch.tweetType.type),
      tweet_media: Equal(state.advancedSearch.tweetType.media),
      start: state.advancedSearch.start,
      end: state.advancedSearch.end,
      order: Equal(state.advancedSearch.order),
      hidden: Equal(state.advancedSearch.hidden)
    }
    let returnQueryObject: AdvancedSearchQuery = {
      advanced: '1'//TODO fix type
    }
    let queryKey: keyof AdvancedSearchQuery
    for (queryKey in tmpQueryObject) {
      if (tmpQueryObject[queryKey] !== defaultAdvancedSearchQueryValues[queryKey] && tmpQueryObject[queryKey] !== undefined) {
        returnQueryObject[queryKey] = tmpQueryObject[queryKey]
      }
    }
    return returnQueryObject
  } else {
    return {q: state.keywords.trim()}// + ((this.name.length && !RegExp('@' + this.name).test(state.keywords)) ? ' @' + this.name : '')
  }
})

const updateForms = (to: RouteLocationNormalized) => {
  if (to.name === 'search') {
    if (to.query.advanced === '1') {
      state.advancedSearch.keywords.text = decodeURI(to.query.q ? <string>NullSafeParams(to.query.q, '') : <string>NullSafeParams(to.params.search, ''))
      state.advancedSearch.keywords.orMode = VerifyQueryString(to.query.text_or_mode, '0') !== '0'
      state.advancedSearch.keywords.notMode = VerifyQueryString(to.query.text_not_mode, '0') !== '0'
      state.advancedSearch.user.text = <string>NullSafeParams(to.query.user, '')
      state.advancedSearch.user.andMode = VerifyQueryString(to.query.user_and_mode, '0') !== '0'
      state.advancedSearch.user.notMode = VerifyQueryString(to.query.user_not_mode, '0') !== '0'
      const tmpTweetType = Number(VerifyQueryString(to.query.tweet_type, 0))
      //state.advancedSearch.tweetType.type = (tmpTweetType && tmpTweetType > -1 && tmpTweetType < 5) ? tmpTweetType : 0//0-> all, 1-> original, 2-> retweet, 3 -> album, 4 -> space
      state.advancedSearch.tweetType.media = VerifyQueryString(to.query.tweet_media, '0') !== '0'//media
      state.advancedSearch.start = (!to.query.start ? -1 : Date.parse(to.query.start + ' GMT' + userTimeZone.value) / 1000).toString()
      state.advancedSearch.end = (!to.query.end ? -1 : Date.parse(to.query.end + ' GMT' + userTimeZone.value) / 1000).toString()
      state.advancedSearch.order = VerifyQueryString(to.query.order, '0') === '1'
      state.mode = 2
      if (adminMode) {
        state.advancedSearch.hidden = VerifyQueryString(to.query.order, '0') === '1'
      }
    } else {
      state.keywords = decodeURI(to.query.q ? <string>NullSafeParams(to.query.q, '') : <string>NullSafeParams(to.params.search, ''))
    }
  }
}
updateForms(route)
router.afterEach((to, from) => {
  if (to.name !== 'search') {
    state.keywords = ''
  }
  if ((typeof from.name === 'string' && ['name-display', 'name-status', 'no-name-status'].includes(from.name)) && to.name === 'search') {
    state.name = from.params.name.toString()
    updateForms(to)
  } else if (to.name === 'search') {
    state.name = ""
    updateForms(to)
  } else {
    state.name = ""
  }
})

</script>

<style lang="scss" scoped>
.el-input-group__prepend {
  background-color: #fff;
}
</style>

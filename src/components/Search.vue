<template>
  <div id="search" @keyup.enter="$router.push({path: '/search/', query: queryObject})">
  <div class="mb-2" v-if="!(tweetModeValue === 'search' && state.mode === 2)" id="searchTweets">
    <el-input v-model="state.keywords" :placeholder="t('search.normal_search.input_text_here')" clearable type="text" />
    <template v-if="state.keywords === 'help' || state.keywords === '帮助'">
      <search-tips class="my-4"/>
    </template>
  </div>
  <button v-if="tweetModeValue === 'search'" :class="{'btn': true, 'btn-sm': true, 'btn-block': true, 'btn-outline-primary': true, 'mb-4': state.mode === 2, 'my-4': state.mode !== 2, 'active': state.mode === 2,}" @click="state.mode = ((state.mode === 2) ? 0 : 2)" role="button">{{ t('search.normal_search.advanced_search') }}
  </button>
  <template v-if="tweetModeValue === 'search' && state.mode === 2">
    <!-- advancedSearch -->
    <!--text-->
    <div class="input-group mb-1" id="searchInclude">
      <div class="input-group-prepend">
        <div class="input-group-text">
          <div class="custom-control custom-checkbox">
            <input type="checkbox" class="custom-control-input" id="searchTextOrMode" v-model="state.advancedSearch.keywords.orMode">
            <label class="custom-control-label" for="searchTextOrMode">OR</label>
          </div>
        </div>
      </div>
      <div class="input-group-prepend">
        <div class="input-group-text">
          <div class="custom-control custom-checkbox">
            <input type="checkbox" class="custom-control-input" id="searchTextNotMode" v-model="state.advancedSearch.keywords.notMode">
            <label class="custom-control-label" for="searchTextNotMode">NOT</label>
          </div>
        </div>
      </div>
      <input type="text" class="form-control" aria-label="Text input with checkbox" :placeholder="t('search.advanced_search.all_of_these_words')" v-model="state.advancedSearch.keywords.text">
    </div>
    <label for="searchInclude" class="text-muted my-2 mb-4">{{ t('search.advanced_search.example_text_include') }}</label>
    <!--user include-->
    <div class="input-group mb-1" id="searchUserInclude">
      <div class="input-group-prepend">
        <div class="input-group-text">
          <div class="custom-control custom-checkbox">
            <input type="checkbox" class="custom-control-input" id="searchUserOrMode" v-model="state.advancedSearch.user.andMode">
            <label class="custom-control-label" for="searchUserOrMode">AND</label>
          </div>
        </div>
      </div>
      <div class="input-group-prepend">
        <div class="input-group-text">
          <div class="custom-control custom-checkbox">
            <input type="checkbox" class="custom-control-input" id="searchUserNotMode" v-model="state.advancedSearch.user.notMode">
            <label class="custom-control-label" for="searchUserNotMode">NOT</label>
          </div>
        </div>
      </div>
      <input type="text" class="form-control" aria-label="Text input with checkbox" :placeholder="t('search.advanced_search.from_this_accounts')" v-model="state.advancedSearch.user.text">
    </div>
    <label class="text-muted my-2 mb-4" for="searchUserInclude">{{ t("search.advanced_search.example_from_this_accounts") }}</label>
    <!-- time -->
    <div class="input-group" id="searchTime">
      <input v-model="state.advancedSearch.start" :max="now.getFullYear() + '-' + (now.getMonth() < 9 ? '0' : '') + (now.getMonth() + 1) + '-' + (now.getDate() < 10 ? '0' : '') + now.getDate()" class="form-control" placeholder="since" type="date">
      <div id="searchTimeTo" class="input-group-append"><span class="input-group-text">-></span></div>
      <input v-model="state.advancedSearch.end" :max="now.getFullYear() + '-' + (now.getMonth() < 9 ? '0' : '') + (now.getMonth() + 1) + '-' + (now.getDate() < 10 ? '0' : '') + now.getDate()" :min="state.advancedSearch.start" class="form-control input-group-append" placeholder="to" type="date">
      <div id="searchTimeDel" class="input-group-append">
        <button class="btn btn-outline-danger" type="button" @click="() => {state.advancedSearch.start = ''; state.advancedSearch.end = ''}">
          {{ t('search.advanced_search.clean') }}
        </button>
      </div>
    </div>
    <label for="searchTime" class="text-muted my-2">{{ t('search.advanced_search.example_search_time') }}</label>

    <div class="btn-group btn-block" role="group">
      <button type="button" :class="{'btn': true, 'btn-outline-primary': true, 'btn-sm': true, 'active': state.advancedSearch.tweetType.type === 0}" @click="state.advancedSearch.tweetType.type = 0">{{ t('search.advanced_search.nav_bar.all') }}</button>
      <button type="button" :class="{'btn': true, 'btn-outline-primary': true, 'btn-sm': true, 'active': state.advancedSearch.tweetType.type === 1}" @click="state.advancedSearch.tweetType.type = 1">{{ t('search.advanced_search.nav_bar.origin') }}</button>
      <button type="button" :class="{'btn': true, 'btn-outline-primary': true, 'btn-sm': true, 'active': state.advancedSearch.tweetType.type === 2}" @click="state.advancedSearch.tweetType.type = 2">{{ t('search.advanced_search.nav_bar.retweet') }}</button>
      <button :class="{'btn': true, 'btn-outline-primary': true, 'btn-sm': true, 'active': state.advancedSearch.tweetType.media}" type="button" @click="state.advancedSearch.tweetType.media = !state.advancedSearch.tweetType.media">{{ t('search.advanced_search.nav_bar.media_only') }}</button>
      <button role="button" :class="{'btn': true, 'btn-outline-primary': true, 'btn-sm': true, 'active': state.advancedSearch.order}" @click="state.advancedSearch.order = !state.advancedSearch.order" >{{ t('search.advanced_search.nav_bar.reverse') }}</button>
    </div>
    <!--<div class="btn-group btn-block" role="group">
         <button type="button" :class="{'btn': true, 'btn-outline-primary': true, 'btn-sm': true, 'active': search.advancedSearch.tweetType.media !== 0}" @click="search.advancedSearch.tweetType.media = ((search.advancedSearch.tweetType.media === 0) ? 1 : 0)">视频</button>
         <button type="button" :class="{'btn': true, 'btn-outline-primary': true, 'btn-sm': true, 'active': search.advancedSearch.tweetType.media !== 0}" @click="search.advancedSearch.tweetType.media = ((search.advancedSearch.tweetType.media === 0) ? 1 : 0)">投票</button>
         <button type="button" :class="{'btn': true, 'btn-outline-primary': true, 'btn-sm': true, 'active': search.advancedSearch.tweetType.media !== 0}" @click="search.advancedSearch.tweetType.media = ((search.advancedSearch.tweetType.media === 0) ? 1 : 0)">含有链接</button>
         <button type="button" :class="{'btn': true, 'btn-outline-primary': true, 'btn-sm': true, 'active': search.advancedSearch.tweetType.media !== 0}" @click="search.advancedSearch.tweetType.media = ((search.advancedSearch.tweetType.media === 0) ? 1 : 0)">含有引用</button>
       </div>-->
    <button v-if="adminMode" :class="{'btn': true, 'btn-outline-dark': true, 'btn-sm': true, 'btn-block': true, 'active': state.advancedSearch.hidden}" role="button" @click="state.advancedSearch.hidden = !state.advancedSearch.hidden">{{ t('search.advanced_search.nav_bar.hidden') }}</button>
    <div class="my-1"></div>
    <i18n-t class="text-muted" keypath="search.advanced_search.tips.line1.text" tag="label">
      <template v-slot:or_mode>
        <code>{{ t('search.advanced_search.tips.line1.or_mode') }}</code>
      </template>
      <template v-slot:and_mode>
        <code>{{ t('search.advanced_search.tips.line1.and_mode') }}</code>
      </template>
      <template v-slot:not_mode>
        <code>{{ t('search.advanced_search.tips.line1.not_mode') }}</code>
      </template>
    </i18n-t>
    <label class="text-muted">{{ t('search.advanced_search.tips.line2') }}</label>
    <div class="my-1"></div>
    <router-link :to="{path: '/search/', query: queryObject}" type="button" class="btn btn-primary text-right">{{ t('search.advanced_search.search') }}</router-link>
  </template>
  <div class="list-group my-2" v-if="state.keywords && state.mode === 0 && state.keywords.slice(0, 1) !== '!'">
    <template v-if="state.keywords && state.keywords.slice(0, 1) !== '!' && state.mode === 0">
      <!--user-->
      <template v-if="state.keywords.slice(0, 1) === '@'">
        <router-link :key="s" :to="`/i/project/`+user.project+`/`+user.name+`/all`" class="list-group-item list-group-item-action" v-for="(user, s) in correctUserList"><b>{{user.display_name }}</b> | <small>@{{ user.name }}</small> > <small>{{ user.project + ' (' + user.tag + ')' }}</small></router-link>
        <!--<div class="my-3" v-if="search.keywords.slice(1).length > 0"></div>-->
      </template>
      <!--hashtag && cashtag-->
      <router-link :to="`/hashtag/`+state.keywords.slice(1)" class="list-group-item list-group-item-action" v-if="state.keywords.slice(0, 1) === '#'">{{ t('search.nav_list.search_by_tag', [state.keywords]) }}
      </router-link>
      <router-link :to="`/cashtag/`+state.keywords.slice(1)" class="list-group-item list-group-item-action" v-if="state.keywords.slice(0, 1) === '$'">{{ t('search.nav_list.search_by_tag', [state.keywords]) }}
      </router-link>
      <!--status-->
      <router-link :to="`/i/status/`+state.keywords" class="list-group-item list-group-item-action" v-if="state.keywords > 0 && state.keywords.match(/\d+/g)[0] === state.keywords">
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
import SearchTips from "@/components/SearchTips.vue";
import {useI18n} from "vue-i18n";
import {computed, reactive, ref, Ref, watch,} from "vue";
import {useStore} from "@/store";
import {useRoute, useRouter} from "vue-router";
import {userListInterface} from "@/type/State";
import {Equal} from "@/share/Tools";
import * as stream from "stream";

const {t} = useI18n()
const state = reactive<{
  keywords: string
  mode: Ref<0 | 1 | 2>//0->keywords, 1->date, 2->advanced
  advancedSearch: {
    user: { text: string; andMode: boolean; notMode: boolean; },
    keywords: { text: string; orMode: boolean; notMode: boolean; },
    tweetType: {
      type: 0 | 1 | 2;//0-> all, 1-> origin, 2-> retweet
      media: boolean;//media
    },
    start: string;//format 2022-02-10
    end: string;//same
    order: boolean;//正序0, 倒序1
    hidden: boolean;
  }
  name: string
}>({
  keywords: '',
  mode: ref(0),//0->keywords, 1->date, 2->advanced
  advancedSearch: {
    user: {"text": "", "andMode": false, "notMode": false,},
    keywords: {"text": "", "orMode": false, "notMode": false,},
    tweetType: {
      type: 0,//0-> all, 1-> origin, 2-> retweet
      media: false,//media
    },
    start: "",
    end: "",
    order: false,//正序0, 倒序1
    hidden: false,
  },
  name: "",
})

const route = useRoute()
const router = useRouter()
const store = useStore()
const tweetModeValue = computed(() => store.state.tweetMode)
const now = computed(() => store.state.now)
const settings = computed(() => store.state.now)
const project = computed(() => store.state.project)
const userList = computed(() => store.state.userList)
const adminMode = computed(() => store.state.adminMode)
const correctUserList = computed(() => {
  let tmpList: userListInterface[] = [];
  userList.value.map(x => {
    if (state.keywords.slice(1).length > 0 && (RegExp(state.keywords.slice(1), 'i').test(x.name) || RegExp(state.keywords.slice(1)).test(x.display_name))) {
      tmpList.push(x)
    }
  })
  return tmpList
})

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
//TODO auto insert to default data from route
const queryObject = computed((): {
  q: string
  text_or_mode?: string
  text_not_mode?: string
  user?: string
  user_and_mode?: string
  user_not_mode?: string
  tweet_type?: string
  tweet_media?: string
  start?: string
  end?: string
  order?: string
  advanced?: '1'
  hidden?: string
} => {
  if (state.mode === 2) {
    //TODO 优化query string
    return {
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
      advanced: '1',
      hidden: Equal(state.advancedSearch.hidden)
    }
  } else {
    return {q: state.keywords.trim()}// + ((this.name.length && !RegExp('@' + this.name).test(state.keywords)) ? ' @' + this.name : '')
  }
})

router.afterEach((to, from) => {
  if ((from.name === 'name-display' || from.name === 'name-status') && to.name === 'search') {
    state.name = from.params.name.toString()
  } else {
    state.name = ""
  }
})

</script>

<style lang="scss" scoped>
.el-select .el-input {
  width: 120px;
}
.el-input-group__prepend {
  background-color: #fff;
}
</style>

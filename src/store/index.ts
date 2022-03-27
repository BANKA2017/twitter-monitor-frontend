/* 先填写 .env.local */
import { InjectionKey } from 'vue'
import {createStore, useStore as baseUseStore, Store, ActionContext} from 'vuex'
import {State} from '@/type/State'
import {isDark} from "@/share/Time";
import language from '@/assets/language.json'

const devmode = process.env.NODE_ENV === "development"
const basePath = !devmode ? import.meta.env.VITE_PRO_BASE_PATH : import.meta.env.VITE_DEV_BASE_PATH
const mediaPath = import.meta.env.VITE_MEDIA_PATH ? import.meta.env.VITE_MEDIA_PATH : basePath + '/api/v2/media/'
const twemojiBasePath = import.meta.env.VITE_TW_EMOJI_PATH//twemoji
//const onlinePath = import.meta.env.VITE_ONLINE_PATH


export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    now: new Date(),
    darkMode: isDark(new Date()),
    projects: [],
    names: {},
    topTweetId: "0",
    languageList: language,
    links: [],
    home: true,
    project: "",
    title: "Twitter Monitor",
    tweets: [],
    translate: {},
    userExists: true,
    tweetMode: 'timeline',
    tweetType: 'all',
    updatedCharts: true,
    height: 0,
    width: 0,
    siteHeight: 0,
    viewportHeight: 0,
    altitudeDifference: 0,
    hasBeenSyncFromLocalStorage: false,
    devmode,
    settings: {
      language: "zh-cn",//简体中文
      cookie_accept: false,
      displayPicture: false,
      autoLoadTweets: false,
      autoRefresh: false,
      onlineMode: false,
      loadConversation: false,
      basePath,
      mediaPath,
    },
    adminMode: false,
    image: {
      mode: 'photo',
      offset: 0,
      imageList: [],
    },
    userTimeZone: '',
    userList: [],
    //path
    samePath: false,
    realMediaPath: '',
    twemojiBasePath: twemojiBasePath,
    //onlinePath,
  },
  getters: {
    getBasePath: (state): string => state.settings.basePath,
  },
  mutations: {
    setLanguage: (state, payload) => {
      state.settings.language = payload.lang
    },
    updateUserList: (state, payload) => state.userList = payload.users,
    updateNow: (state, payload) => state.now = payload.now,
    setTrueToHasBeenSyncFromLocalStorage: (state) => state.hasBeenSyncFromLocalStorage = true,
    setUserTimeZone: (state, payload) => state.userTimeZone = payload.userTimeZone,
    //browser
    updateBrowserSize: (state, payload) => {
      state.height = payload.height
      state.width = payload.width
      state.siteHeight = payload.siteHeight
      state.altitudeDifference = payload.altitudeDifference
      state.viewportHeight = payload.viewportHeight
    },
    //settings
    swapDisplayPictureStatus: (state) => state.settings.displayPicture = !state.settings.displayPicture,
    //updateDisplayPictureStatus: (state, payload) => state.settings.displayPicture = payload.status,
    updateSettingsItem: (state: State, payload: {key: keyof State["settings"]; value: string & boolean}) => {state.settings[payload.key] = payload.value},
    checkSamePath: (state) =>state.samePath = (state.settings.basePath === state.settings.mediaPath),
    updateRealMediaPath: (state, payload) => state.realMediaPath = payload.realMediaPath,
    //set core data
    setCoreValue: <K extends keyof State>(state: State, payload: {key: K; value: State[K]}) => state[payload.key] = payload.value,
    //pushCoreValue: (state, payload) => state[payload.key] = state[payload.key].concat(payload.value),
    updateTweetsTranslate: (state, payload) => state.translate[payload.tweet_id] = payload.translate,
  },
  actions: {
    setLanguage: function (context, payload: {lang: string}) {
      context.commit({
        type: 'setLanguage',
        lang: ((lang: string) => {
          if (/^(?:zh|zh-cn|zh-sg|zh-hans)$/.test(lang)) {
            return 'zh-cn'
          } else if (/^(?:zh-tw|zh-hk|zh-mo|zh-hant)$/.test(lang)) {
            return 'zh-tw'
          } else if (/^(?:ja|ja-jp)$/.test(lang)) {
            return 'ja'
          } else if (/^(?:ko|ko-kp)$/.test(lang)) {
            return 'ko'
          } else {
            return 'en'
          }
        })(payload.lang)
      })
    },
    updateUserList: function (context) {
      let users: State["userList"] = [];
      for (let project in context.state.names) {
        for (let group in context.state.names[project]) {
          for (let member of context.state.names[project][group]) {
            users.push({
              name: member.name,
              display_name: member.display_name,
              project: project,
              tag: group
            })
          }
        }
      }
      context.commit({type: 'updateUserList', users})
    },
    updateNow: (context) => context.commit({type: 'updateNow', now: new Date()}),
    setTrueToHasBeenSyncFromLocalStorage: (context) => context.commit('setTrueToHasBeenSyncFromLocalStorage'),
    setUserTimeZone: (context) => {
      let timeValue = (new Date().getTimezoneOffset() / 60) * (-1);
      context.commit({type: 'setUserTimeZone', userTimeZone: (timeValue >= 0 ? '+' + timeValue.toString() : timeValue.toString())})
    },
    //browser
    updateBrowserSize: (context, payload) => {
      context.commit({
        type: 'updateBrowserSize',
        height: payload.height,
        width: payload.width,
        siteHeight: payload.siteHeight,
        altitudeDifference: payload.altitudeDifference,
        viewportHeight: payload.viewportHeight,
      })
    },
    //settings
    swapDisplayPictureStatus: (context) => context.commit('swapDisplayPictureStatus'),
    //updateDisplayPictureStatus: (context, payload) => context.commit('updateDisplayPictureStatus', {status: payload.status}),
    updateSettingsItem: (context: ActionContext<State, State>, payload: {key: keyof State["settings"]; value: string & boolean}) => context.commit('updateSettingsItem', {key: payload.key, value: payload.value}),
    checkSamePath: (context) => context.commit({type: 'checkSamePath'}),
    updateRealMediaPath: (context) => context.commit({type: 'updateRealMediaPath', realMediaPath: context.state.settings.mediaPath + (context.state.settings.mediaPath === context.state.settings.basePath ? '/api/v2/media/' : '')}),
    //set core data
    setCoreValue: <K extends keyof State>(context: ActionContext<State, State>, payload: {key: K; value: State[K]}) => context.commit('setCoreValue', {key: payload.key, value: payload.value}),
    pushCoreValue: (context: any, payload) => context.commit({type: 'setCoreValue', key: payload.key, value: context.state[payload.key].concat(payload.value)}),
    //TODO fix all any type
    updateTweetsTranslate: (context, payload) => context.commit("updateTweetsTranslate", {tweet_id: payload.tweet_id, translate: payload.translate}),
  }
})

export function useStore () {
  return baseUseStore(key)
}

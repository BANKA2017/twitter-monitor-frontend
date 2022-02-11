/* 先填写 .env.local */
import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import {State} from '@/type/State'
import {isDark} from "@/share/Time";
import language from '@/assets/language.json'
import {i18n} from "@/i18n";

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
    languageList: language,
    links: [],
    home: true,
    project: "",
    title: "Twitter Monitor v3",
    tweets: [],
    translate: {},
    userExists: true,
    tweetMode: 'timeline',
    tweetType: 'all',
    height: 0,
    width: 0,
    siteHeight: 0,
    viewportHeight: 0,
    altitudeDifference: 0,
    hasBeenSyncFromLocalStorage: false,
    devmode: devmode,
    settings: {
      language: "zh-cn",//简体中文
      cookie_accept: false,
      displayPicture: false,
      autoLoadTweets: false,
      autoRefresh: false,
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
  mutations: {
    setLanguage: (state, payload) => {
      state.settings.language = payload.lang
    },
    updateUserList: (state, payload) => state.userList = payload.users,
    updateNow: (state, payload) => state.now = payload.now,
    setTrueToHasBeenSyncFromLocalStorage: (state) => state.hasBeenSyncFromLocalStorage = true,
    setSettings: (state: any, payload) => state.settings[payload.node] = payload.data,
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
    updateDisplayPictureStatus: (state, payload) => state.settings.displayPicture = payload.status,
    updateBasePath: (state, payload) => state.settings.basePath = payload.basePath,
    updateMediaPath: (state, payload) => state.settings.mediaPath = payload.mediaPath,
    checkSamePath: (state) =>state.samePath = (state.settings.basePath === state.settings.mediaPath),
    updateRealMediaPath: (state, payload) => state.realMediaPath = payload.realMediaPath,
    updateAutoRefreshStatus: (state, payload) => state.settings.autoRefresh = payload.value,
    updateAutoLoadMoreStatus: (state, payload) => state.settings.autoLoadTweets = payload.value,
    //set core data
    setCoreValue: (state: any, payload) => state[payload.key] = payload.value,
    //pushCoreValue: (state, payload) => state[payload.key] = state[payload.key].concat(payload.value),
    updateTweetsTranslate: (state, payload) => state.translate[payload.tweet_id] = payload.translate,
  },
  actions: {
    setLanguage: function (context, payload) {
      context.commit({
        type: 'setLanguage',
        lang: ((lang) => {
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
      //TODO 更好的拍平技巧？
      Object.keys(context.state.names).forEach(project => {
        Object.keys(context.state.names[project]).forEach(group => {
          context.state.names[project][group].map(member => {
            users.push({
              name: member["name"],
              display_name: member["display_name"],
              project: project,
              tag: group
            });
          })
        })
      });
      context.commit({type: 'updateUserList', users})
    },
    updateNow: (context) => context.commit({type: 'updateNow', now: new Date()}),
    setTrueToHasBeenSyncFromLocalStorage: (context) => context.commit('setTrueToHasBeenSyncFromLocalStorage'),
    setSettings: (context, payload) => context.commit({type: 'setSettings', node: payload.node, data: payload.data}),
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
    updateDisplayPictureStatus: (context, payload) => context.commit({type: 'updateDisplayPictureStatus', status: payload.status}),
    updateBasePath: (context, payload) => context.commit({type: 'updateBasePath', basePath: payload.basePath}),
    updateMediaPath: (context, payload) => context.commit({type: 'updateMediaPath', mediaPath: payload.mediaPath}),
    updateAutoRefreshStatus: (context, payload) => context.commit({type: 'updateAutoRefreshStatus', value: payload.value}),
    updateAutoLoadMoreStatus: (context, payload) => context.commit({type: 'updateAutoLoadMoreStatus', value: payload.value}),
    checkSamePath: (context) => context.commit({type: 'checkSamePath'}),
    updateRealMediaPath: (context) => context.commit({type: 'updateRealMediaPath', realMediaPath: context.state.settings.mediaPath + (context.state.settings.mediaPath === context.state.settings.basePath ? '/api/v2/media/' : '')}),
    //set core data
    setCoreValue: (context, payload) => context.commit({type: 'setCoreValue', key: payload.key, value: payload.value}),
    pushCoreValue: (context: any, payload) => context.commit({type: 'setCoreValue', key: payload.key, value: context.state[payload.key].concat(payload.value)}),
    //TODO fix all any type
    updateTweetsTranslate: (context, payload) => context.commit("updateTweetsTranslate", {tweet_id: payload.tweet_id, translate: payload.translate}),
  }
})

export function useStore () {
  return baseUseStore(key)
}

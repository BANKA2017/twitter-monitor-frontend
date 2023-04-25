<template>
  <div id="app">
    <div style="position: absolute"></div>
    <transition name="el-fade-in" v-show="height > 200">
      <div class="el-backtop" style="right: 40px; bottom: 40px; z-index: 1500" @click="ScrollTo(0)">
        <el-icon size="1em"><caret-top /></el-icon>
      </div>
    </transition>
    <pwa />
    <router-view/>
    <transition name="el-fade-in" style="z-index: 1;">
      <tw-space />
    </transition>
    <div v-if="devmode" class="bg-dark text-white" style="left: 0; bottom: 0; position: fixed; z-index: 9999; padding: 5px">
      <span style="align-content: end">{{width + 'x' + viewportHeight}}</span>
    </div>
  </div>
</template>

<script lang="ts">
  import {useHead} from "@vueuse/head";
  import {store, useStore} from "./store";
  import {computed, inject, onMounted, reactive, watch} from "vue";
  import {request} from "./share/Fetch";
  import {ApiAccounts} from "./types/Api";
  import {Notice} from "./share/Tools";
  import {useI18n} from "vue-i18n";
  import {ScrollTo} from "./share/Tools";
  import {CaretTop} from "@element-plus/icons-vue";
  import Pwa from "./pwa.vue";
  import TwSpace from "./components/TwSpace.vue";

  export default {
    name: 'App',
    components: {TwSpace, Pwa, CaretTop},
    setup() {
      const {locale} = useI18n()
      const store = useStore()
      const settings = computed(() => store.state.settings)
      const hasBeenSyncFromLocalStorage = computed(() => store.state.hasBeenSyncFromLocalStorage)
      const names = computed(() => store.state.names)
      const devmode = computed(() => store.state.devmode)
      const height = computed(() => store.state.height)
      const viewportHeight = computed(() => store.state.viewportHeight)
      const width = computed(() => store.state.width)
      const title = computed(() => store.state.title)
      const onlinePath = computed(() => store.state.onlinePath)
      const adminMode = computed(() => store.state.adminMode)
      const bookMarks = computed(() => store.state.bookmarks)
      const force_online = inject('online_mode')
      useHead({
        title,
        meta: [
          {name: "description", content: "Collection, processing and analysis"},
          {name: "keywords", content: "bangdream, LoveLive!, 少女乐团派对twitter, Twitter Monitor, twitter监控"}
        ]
      })
      watch(settings, () => {
        locale.value = settings.value.language
        if (hasBeenSyncFromLocalStorage) {
          localStorage.setItem('tm_settings', JSON.stringify(settings.value))
        }
      }, {deep: true})
      watch(names, () => {
        if (names.value && Object.keys(names.value).length) {
          store.dispatch('updateUserList')
        }
      })

      const state = reactive<{
        updateHeightFlag: boolean
      }>({
        updateHeightFlag: false
      })

      const updateNow = () => {
        store.dispatch('updateNow')
      }

      const updateHeight = () => {
        if (state.updateHeightFlag) {return}
        const tmpDocument = document
        const tmpWindow = window
        store.dispatch({
          type: 'updateBrowserSize',
          altitudeDifference: height.value - tmpDocument.documentElement.scrollTop,
          height: tmpDocument.documentElement.scrollTop,
          width: tmpWindow.innerWidth,
          siteHeight: tmpDocument.body.scrollHeight,
          viewportHeight: tmpWindow.innerHeight,
          scrollBarWidth: tmpWindow.innerWidth - tmpDocument.body.scrollWidth,
        })
        state.updateHeightFlag = true
      }
      const setLanguage = () => {
        store.dispatch({
          type: 'setLanguage',
          lang: window.navigator.language.toLowerCase()
        })
      }
      const konamiCode = () => {
        if ( window.addEventListener ) {
          let tmpKeys: string[] = []
          const konamiCode = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","KeyB","KeyA"];
          window.addEventListener("keydown", (e) => {
            if (!adminMode.value) {
              if (e.code === konamiCode[tmpKeys.length]) {
                tmpKeys.push( e.code );
              } else {
                tmpKeys = []
              }
              if (tmpKeys.toString() === konamiCode.toString()) {
                store.dispatch({
                  type: 'setCoreValue',
                  key: 'adminMode',
                  value: true
                })
              }
            }
          }, true);
        }
      }

      //localStorage
      let tm_settings = localStorage.getItem('tm_settings')
      if (!tm_settings || Object.keys(JSON.parse(tm_settings)).join('') !== Object.keys(settings.value).join('')) {
        if (force_online) {
          store.dispatch('updateSettingsItem', {key: 'basePath', value: onlinePath.value})
          store.dispatch("updateSettingsItem", {key: "onlineMode", value: true})
        }
        localStorage.setItem('tm_settings', JSON.stringify(settings.value))//提前写入
        setLanguage()
      } else {
        //TODO support third-party interface
        let tmpSettings = JSON.parse(tm_settings)
        if (force_online) {
          tmpSettings.onlineMode = true
        }
        if (tmpSettings.basePath) {
          delete tmpSettings.basePath
        }
        if (tmpSettings.mediaPath) {
          delete tmpSettings.mediaPath
        }
        for (const key in tmpSettings) {
          if (key === 'onlineMode' && tmpSettings.onlineMode) {
            store.dispatch({
              type: 'updateSettingsItem',
              key: 'basePath',
              value: onlinePath.value
            })
          }
          store.dispatch({
            type: 'updateSettingsItem',
            key,
            value: tmpSettings[key]
          })
        }
      }
      store.dispatch('setTrueToHasBeenSyncFromLocalStorage')
      store.dispatch('setUserTimeZone')
      store.dispatch('checkSamePath')
      store.dispatch('updateRealMediaPath')

      //bookmarks
      let localstorage_bookmarks = localStorage.getItem('tm_bookmarks')
      if (!localstorage_bookmarks) {
        localStorage.setItem('tm_bookmarks', JSON.stringify(bookMarks.value))//提前写入
      } else {
        store.dispatch({
          type: 'setCoreValue',
          key: 'bookmarks',
          value: JSON.parse(localstorage_bookmarks)
        })
      }
      watch(bookMarks, () => {
        localStorage.setItem('tm_bookmarks', JSON.stringify(bookMarks.value))
      }, {deep: true})
      onMounted(() => {
        //time
        updateNow()
        // height
        updateHeight()

        setInterval(() => {
          updateNow()
          updateHeight()
        }, 500)
        addEventListener('scroll', () => {state.updateHeightFlag = false})
        addEventListener('resize', () => {state.updateHeightFlag = false})
        //updateHeightStatus
        //this.isUp();
        konamiCode()
        if (!settings.value.onlineMode) {
          request<ApiAccounts>(settings.value.basePath + '/api/v3/data/accounts/').then(response => {
            store.dispatch({type: 'setCoreValue', key: 'names', value: response.data.account_info})
            store.dispatch("updateUserList")
            store.dispatch({type: 'setCoreValue', key: 'projects', value: response.data.projects})
            store.dispatch({type: 'setCoreValue', key: 'links', value: response.data.links})
          }).catch((e: Error) => {
            Notice(String(e), "error")
          })
        }
      })

      return {devmode, viewportHeight, width, height, ScrollTo}
    },
  }
</script>

<style lang="scss">
@import "assets/style";
</style>

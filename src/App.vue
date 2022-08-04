<template>
  <div id="app">
    <div style="position: absolute"></div>
    <transition name="el-fade-in" v-show="height > 200">
      <div class="el-backtop" style="right: 40px; bottom: 40px; z-index: 1500" @click="ScrollTo">
        <el-icon size="1em"><caret-top /></el-icon>
      </div>
    </transition>
    <router-view/>
    <div v-if="devmode" class="bg-dark text-white" style="left: 0; bottom: 0; position: fixed; z-index: 9999; padding: 5px">
      <span style="align-content: end">{{width + 'x' + viewportHeight}}</span>
    </div>
  </div>
</template>

<script lang="ts">
  import {useHead} from "@vueuse/head";
  import {useStore} from "@/store";
  import {computed, onMounted, reactive, watch} from "vue";
  import {request} from "@/share/Fetch";
  import {ApiAccounts} from "@/type/Api";
  import {Notice} from "@/share/Tools";
  import {useI18n} from "vue-i18n";
  import {ScrollTo} from "@/share/Tools";
  import {CaretTop} from "@element-plus/icons-vue";

  export default {
    name: 'App',
    components: {CaretTop},
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
        if (names.value && names.value.length) {
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
        let tmpDocument = document
        store.dispatch({
          type: 'updateBrowserSize',
          altitudeDifference: height.value - tmpDocument.documentElement.scrollTop,
          height: tmpDocument.documentElement.scrollTop,
          width: window.innerWidth,
          siteHeight: tmpDocument.body.scrollHeight,
          viewportHeight: window.innerHeight,
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
          const konamiCode = "ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,KeyB,KeyA";
          window.addEventListener("keydown", (e) => {
            tmpKeys.push( e.code );
            if ( tmpKeys.toString() === konamiCode ) {
              store.dispatch({
                type: 'setCoreValue',
                key: 'adminMode',
                value: true
              })
              tmpKeys = [];
            }
          }, true);
        }
      }

      //localStorage
      let tm_settings = localStorage.getItem('tm_settings')
      if (!tm_settings || Object.keys(JSON.parse(tm_settings)).join('') !== Object.keys(settings.value).join('')) {
        localStorage.setItem('tm_settings', JSON.stringify(settings.value))//提前写入
        setLanguage()
      } else {
        store.dispatch({
          type: 'setCoreValue',
          key: 'settings',
          value: JSON.parse(tm_settings)
        })
      }
      store.dispatch('setTrueToHasBeenSyncFromLocalStorage')
      store.dispatch('setUserTimeZone')
      store.dispatch('checkSamePath')
      store.dispatch('updateRealMediaPath')
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
          request<ApiAccounts>(settings.value.basePath + '/api/v2/data/accounts/').then(response => {
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

<style>
.light-mode {
  background-color: #ffffff;
  color: #011100;
}
.dark-mode {
  background-color: #011100;
  color: #ffffff;
}
.bg-twitter-blue {
  background-color: #1da1f2;
}
.plyr {
  border-radius: 14px;
}
a:link {text-decoration: none}
a:hover {text-decoration: underline}
</style>

<template>
  <div id="app">
    <div style="position: absolute"></div>
    <el-backtop style="z-index: 1500"/>
    <router-view/>
    <div v-if="devmode" class="bg-dark text-white" style="left: 0; bottom: 0; position: fixed; z-index: 9000">开发测试版本</div>
  </div>
</template>

<script lang="ts">
  import {useHead} from "@vueuse/head";
  import {useStore} from "@/store";
  import {computed, onMounted, watch} from "vue";
  import { i18n } from './i18n';
  export default {
    name: 'App',
    setup() {
      useHead({
        title: 'Twitter Monitor',
        meta: [
          {name: "description", content: "Collection, processing and analysis"},
          {name: "keywords", content: "bangdream, LoveLive!, 少女乐团派对twitter, Twitter Monitor, twitter监控"}
        ]
      })

      const store = useStore()
      const settings = computed(() => store.state.settings)
      const hasBeenSyncFromLocalStorage = computed(() => store.state.hasBeenSyncFromLocalStorage)
      const names = computed(() => store.state.names)
      const devmode = computed(() => store.state.devmode)
      const height = computed(() => store.state.height)

      watch(settings, () => {
        //TODO divide language
        i18n.global.locale = settings.value.language
        if (hasBeenSyncFromLocalStorage) {
          localStorage.setItem('tm_settings', JSON.stringify(settings.value))
        }
      }, {deep: true})
      watch(names, () => {
        if (names.value.length) {
          store.dispatch('updateUserList')
        }
      })

      const updateNow = () => {
        store.dispatch('updateNow')
        setTimeout(updateNow, 500)
      }
      const updateHeight = () => {
        store.dispatch({
          type: 'updateBrowserSize',
          altitudeDifference: Number(height) - document.documentElement.scrollTop,//TODO check number type
          height: document.documentElement.scrollTop,
          width: window.innerWidth,
        })
        setTimeout(updateHeight, 500)
      }
      const setLanguage = () => {
        store.dispatch({
          type: 'setLanguage',
          lang: 'zh-cn'//window.navigator.language.toLowerCase()
        })
      }
      const konamiCode = () => {
        if ( window.addEventListener ) {
          let tmpKeys: string[] = []
          const konamiCodeArray = "ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,KeyB,KeyA";
          window.addEventListener("keydown", (e) => {
            tmpKeys.push( e.code );
            if ( tmpKeys.toString() === konamiCodeArray ) {
              store.dispatch({
                type: 'setSettings',
                node: 'adminStatus',
                data: true
              })
              tmpKeys = [];
            }
          }, true);
        }
      }


      onMounted(() => {
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
        //time
        updateNow()
        updateHeight()
        //updateHeightStatus
        //this.isUp();
        konamiCode()
      })

      return {devmode}
    },
  }
</script>

<style lang="scss">
@import "./assets/style.scss";
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
</style>

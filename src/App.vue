<template>
  <div id="app">
    <div style="position: absolute"></div>
    <el-backtop style="z-index: 1500"/>
    <router-view/>
    <div v-if="this.devmode" class="bg-dark text-white" style="left: 0; bottom: 0; position: fixed; z-index: 9000">开发测试版本</div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {useHead} from "@vueuse/head";
  export default {
    name: 'App',
    setup() {
      useHead({
        title: 'Twitter Monitor',
        meta: [{
          name: "description",
          content: "Collection, processing and analysis"
        },
          {
            name: "keywords",
            content: "bangdream, LoveLive!, 少女乐团派对twitter, Twitter Monitor, twitter监控"
          }]
      })
    },
    computed: mapState({
      settings: 'settings',
      hasBeenSyncFromLocalStorage: 'hasBeenSyncFromLocalStorage',
      names: 'names',
      devmode: 'devmode',
      //browser
      height: 'height',
    }),
    watch: {
      "settings.data.language": {
        deep: true,
        handler: function () {
          this.$i18n.locale = this.settings.data.language
        }
      },
      "settings.data": {
        deep: true,
        handler: function () {
          if (this.hasBeenSyncFromLocalStorage) {
            localStorage.setItem('tm_settings', JSON.stringify(this.settings.data))
          }
        }
      },
      "names": function () {
        if (this.names) {
          this.$store.dispatch('updateUserList')
        }
      }
    },
    mounted: function () {
      this.localrun();
    },
    methods: {
      localrun: function () {
        //localStorage
        if (!localStorage.getItem('tm_settings') || JSON.stringify(Object.keys(JSON.parse(localStorage.getItem('tm_settings')))) !== JSON.stringify(Object.keys(this.settings.data))) {
          localStorage.setItem('tm_settings', JSON.stringify(this.settings.data))//提前写入
          this.setLanguage()
        } else {
          this.$store.dispatch({
            type: 'setSettings',
            node: 'data',
            data: JSON.parse(localStorage.getItem('tm_settings'))
          })
        }
        this.$store.dispatch('setTrueToHasBeenSyncFromLocalStorage')
        this.$store.dispatch('setUserTimeZone')
        this.$store.dispatch('checkSamePath')
        this.$store.dispatch('updateRealMediaPath')
        //time
        this.updateNow()
        this.updateHeight()
        //updateHeightStatus
        //this.isUp();
        this.konamiCode()
      },
      updateNow: function () {
        this.$store.dispatch('updateNow')
        setTimeout(this.updateNow, 500)
      },
      updateHeight: function () {
        this.$store.dispatch({
          type: 'updateBrowserSize',
          altitudeDifference: this.height - document.documentElement.scrollTop,
          height: document.documentElement.scrollTop,
          width: window.innerWidth,
        })
        setTimeout(this.updateHeight, 500)
      },
      setLanguage: function () {
        this.$store.dispatch({
          type: 'setLanguage',
          lang: window.navigator.language.toLowerCase()
        })
      },
      konamiCode: function () {
        if ( window.addEventListener ) {
          let tmpKeys = []
          const konamiCodeArray = "ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,KeyB,KeyA";
          window.addEventListener("keydown", (e) => {
            tmpKeys.push( e.code );
            if ( tmpKeys.toString() === konamiCodeArray ) {
              this.$store.dispatch({
                type: 'setSettings',
                node: 'adminStatus',
                data: true
              })
              tmpKeys = [];
            }
          }, true);
        }
      }
    }
  }
</script>

<style>

</style>

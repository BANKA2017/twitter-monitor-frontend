//'use strict';
import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//import 'bootstrap';
import 'bootstrap/js/dist/util'
import 'bootstrap/js/dist/button'
import 'bootstrap/js/dist/dropdown'
import 'bootstrap/js/dist/collapse'
import "bootstrap/scss/bootstrap.scss";
import 'jquery';
//import 'popper.js';

//icons
//TODO svg-loader
//import "bootstrap-icons/font/bootstrap-icons.css";

import {
    ElBacktop,
    ElImage,
    ElSkeletonItem,
    ElCollapseTransition,
    ElSkeleton,
    ElTable,
    ElTableColumn,
    ElButton,
    ElLoading,
    ElDivider,
    ElInput,
    ElCarousel,
    ElCarouselItem,
    ElNotification,
    ElTag,
    ElAffix,
    ElRow,
    ElSelect,
    ElOption,
    ElSwitch,
    ElAvatar,
    ElProgress,
    //ElIcon,
} from 'element-plus'//


//import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import { createI18n } from 'vue-i18n/index'

import VueGtag from "vue-gtag-next";
import { trackRouter } from 'vue-gtag-next'

//TODO fix vue-meta
//import { createMetaManager, plugin as metaPlugin } from 'vue-meta'

//use @vueuse/head
import { createHead } from "@vueuse/head"

import './registerServiceWorker'


//public functions
const scrollToTop = require('@/plugins/scrollToTop')
const notice = function (text, status = 'success') {
  this.$notify({
    message: text,
    type: status,
    duration: 1500
  });
}

router.afterEach(() => {
  scrollToTop()
})

export const i18n = createI18n({
  locale: 'zh-cn',
  fallbackLocale: 'en',
  messages: {
    'zh-cn': require('@/i18n/zh_hans'),
    'zh-tw': require('@/i18n/zh_hant'),
    'en': require('@/i18n/en'),
  }
})

const app = createApp(App)
app.config.globalProperties.append = (path, pathToAppend) => path + (path.endsWith('/') ? '' : '/') + pathToAppend

//element-plus
app.use(ElBacktop)
app.use(ElImage)
app.use(ElSkeletonItem)
app.use(ElCollapseTransition)
app.use(ElSkeleton)
app.use(ElTable)
app.use(ElTableColumn)
app.use(ElButton)
app.use(ElLoading)
app.use(ElDivider)
app.use(ElInput)
app.use(ElCarousel)
app.use(ElCarouselItem)
app.use(ElNotification)
app.use(ElTag)
app.use(ElAffix)
app.use(ElRow)
app.use(ElSelect)
app.use(ElOption)
app.use(ElSwitch)
app.use(ElAvatar)
app.use(ElProgress)
//app.use(ElIcon)
//app.use(ElementPlus)
app.use(router)
app.use(store)
app.use(i18n)
//TODO waiting for pigeons from nuxt.js
//app.use(createMetaManager())
//app.use(metaPlugin, {keyName: 'metaInfo'})
app.use(createHead())
app.provide('scrollToTop', scrollToTop)
app.provide('notice', notice)

//app.config.globalProperties.scrollToTop = scrollToTop
//app.config.globalProperties.notice = notice

if (process.env.NODE_ENV !== 'development') {
  app.use(VueGtag, {
    property: [
      {id: process.env.VUE_APP_GA_ID},
    ]
  });
  trackRouter(router);
}
router.isReady().then(() => app.mount('#app'))
//app.mount('#app')

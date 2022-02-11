//'use strict';
import {createApp} from 'vue'
import App from '@/App.vue'
import router from '@/router'
import {store, key} from '@/store'
//import 'bootstrap';
import 'bootstrap/js/dist/util'
import 'bootstrap/js/dist/button'
import 'bootstrap/js/dist/dropdown'
import 'bootstrap/js/dist/collapse'
import 'jquery';
//import 'popper.js';

//icons
//TODO svg-loader
//import "bootstrap-icons/font/bootstrap-icons.css";



import VueGtag from "vue-gtag-next";
import { trackRouter } from 'vue-gtag-next'

//TODO fix vue-meta
//import { createMetaManager, plugin as metaPlugin } from 'vue-meta'

//use @vueuse/head
import { createHead } from "@vueuse/head"

import '@/registerServiceWorker'
import {ScrollTo} from "@/share/Tools";


router.afterEach(() => {
  ScrollTo(0)
})

import {i18n} from "@/i18n"
const app = createApp(App)
app.config.globalProperties.append = (path: string, pathToAppend: string) => path + (path.endsWith('/') ? '' : '/') + pathToAppend

//element-plus
//app.use(ElIcon)
//app.use(ElementPlus)
app.use(router).use(store, key).use(i18n).use(createHead())

//app.config.globalProperties.scrollToTop = scrollToTop
//app.config.globalProperties.notice = notice

if (process.env.NODE_ENV !== 'development') {
  app.use(VueGtag, {
    property: [
      {id: import.meta.env.VITE_GA_ID},
    ]
  });
  trackRouter(router);
}
router.isReady().then(() => app.mount('#app'))
//app.mount('#app')

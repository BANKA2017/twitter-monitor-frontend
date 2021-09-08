//'use strict';
import Vue from 'vue'
import App from './App.vue'
import router from './router'
//import 'bootstrap';
import 'bootstrap/js/dist/util'
import 'bootstrap/js/dist/button'
import 'bootstrap/js/dist/dropdown'
import 'bootstrap/js/dist/collapse'
import "bootstrap/scss/bootstrap.scss";
import 'jquery';
//import 'popper.js';
import {
  Input,
  Drawer,
  Row,
  Backtop,
  Select,
  Option,
  Image,
  Divider,
  Icon,
  Button,
  Loading,
  MessageBox,
  Message,
  Progress,
  Switch,
  Table,
  TableColumn,
  Tag,
  Notification,//https://github.com/ElemeFE/element/issues/3450#issuecomment-500717476
  Carousel,
  CarouselItem,
  Avatar,
  Skeleton,
  SkeletonItem,
  //InfiniteScroll
} from 'element-ui';
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
import VueI18n from 'vue-i18n'

//import VueHighlightJS from 'vue-highlightjs'
//Vue.use(VueHighlightJS)

/* 先填写 .env */
Vue.prototype.devmode = process.env.NODE_ENV === "development"
Vue.prototype.basePath = !Vue.prototype.devmode ? process.env.VUE_APP_PRO_BASE_PATH : process.env.VUE_APP_DEV_BASE_PATH
Vue.prototype.mediaPath = process.env.VUE_APP_MEDIA_PATH ? process.env.VUE_APP_MEDIA_PATH : Vue.prototype.basePath + '/api/v2/media/'
Vue.prototype.twemojiBasePath = process.env.VUE_APP_TW_EMOJI_PATH//twemoji
Vue.prototype.onlinePath = process.env.VUE_APP_ONLINE_PATH
Vue.prototype.GA_ID = process.env.VUE_APP_GA_ID
Vue.prototype.adminModePassword = process.env.VUE_APP_ADMIN_MODE_PW

//gtag
//骚玩法不要学, 老老实实写代码
import VueGtag from "vue-gtag";

Vue.prototype.ready = false;

if (!Vue.prototype.devmode) {
  Vue.use(VueGtag, {
    config: {id: Vue.prototype.GA_ID},
    onReady() {
      Vue.prototype.ready = true;
    }
  }, router);
} else {
  Vue.prototype.ready = true;
}

import VueMeta from 'vue-meta'
import './registerServiceWorker'

Vue.use(VueMeta);
Vue.use(Input);
Vue.use(Drawer);
Vue.use(Row);
Vue.use(Backtop);
Vue.use(Select);
Vue.use(Option);
Vue.use(Image);
Vue.use(Divider);
Vue.use(Icon);
Vue.use(Button);
Vue.use(Progress);
Vue.use(Switch);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Tag);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Avatar);
Vue.use(Loading.directive);
Vue.use(Skeleton);
Vue.use(SkeletonItem);
//Vue.use(InfiniteScroll);
Vue.use(VueI18n)

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
Vue.component(CollapseTransition.name, CollapseTransition);
//Vue.use(ElementUI);

Vue.config.productionTip = false;

//public functions
Vue.prototype.scrollToTop = function (top = 0) {
  window.scrollTo({
    top: top,
    behavior: "smooth"
  });
};

Vue.prototype.notice = function (text, status = 'success') {
  this.$message({
    message: text,
    type: status
  });
}

router.afterEach(() => {
  Vue.prototype.scrollToTop()
})

export const i18n = new VueI18n({
  locale: 'zh-cn',
  fallbackLocale: 'en',
  messages: {
    'zh-cn': require('@/i18n/zh_hans'),
    'zh-tw': require('@/i18n/zh_hant'),
    'en': require('@/i18n/en'),
  }
})

new Vue({
  render: h => h(App),
  router,
  i18n,
  data() {
    return {
      now: new Date(),
      projects: [],
      names: [],
      languageList: [
        {
          "code": "en",
          "name": "\u82f1\u8bed",
          "local_name": "English",
          "status": "production"
        },
        {
          "code": "ja",
          "name": "\u65e5\u8bed",
          "local_name": "\u65e5\u672c\u8a9e",
          "status": "production"
        },
        {
          "code": "ko",
          "name": "\u97e9\u8bed",
          "local_name": "\ud55c\uad6d\uc5b4",
          "status": "production"
        },
        {
          "code": "zh-tw",
          "name": "\u7e41\u4f53\u4e2d\u6587",
          "local_name": "\u7e41\u9ad4\u4e2d\u6587",
          "status": "production"
        },
        {
          "code": "zh-cn",
          "name": "\u7b80\u4f53\u4e2d\u6587",
          "local_name": "\u7b80\u4f53\u4e2d\u6587",
          "status": "production"
        }
      ],
      links: [],
      home: true,
      project: "",
      title: "Twitter Monitor",
      tweets: [],
      height: 0,
      width: 0,
      altitudeDifference: 0,
      hasBeenSyncFromLocalStorage: false,
      settings: {
        data: {
          language: ((lang) => {
            if (/^(?:zh|zh-cn|zh-sg|zh-hans)$/.test(lang)) {
              i18n.locale = 'zh-cn'
              return 'zh-cn'
            } else if (/^(?:zh-tw|zh-hk|zh-mo|zh-hant)$/.test(lang)) {
              i18n.locale = 'zh-tw'
              return 'zh-tw'
            } else if (/^(?:ja|ja-jp)$/.test(lang)) {
              i18n.locale = 'en'
              return 'ja'
            } else if (/^(?:ko|ko-kp)$/.test(lang)) {
              i18n.locale = 'en'
              return 'ko'
            } else {
              i18n.locale = 'en'
              return 'en'
            }
          })(window.navigator.language.toLowerCase()),
          cookie_accept: false,
          displayPicture: false,
          basePath: Vue.prototype.basePath,//Vue.prototype.onlinePath !== '' ? Vue.prototype.onlinePath : ,
          mediaPath: Vue.prototype.mediaPath,
        },
        panel: false,
        adminStatus: false,
      },
    }
  },
  computed: {
    userTimeZone: function () {
      let timeValue = (new Date().getTimezoneOffset() / 60) * (-1);
      return timeValue >= 0 ? '+' + timeValue.toString() : timeValue.toString();
    },
    userList: function () {
      let users = [];
      Object.keys(this.$root.names).forEach(value1 => {
        Object.keys(this.$root.names[value1]).forEach(value2 => {
          Object.keys(this.$root.names[value1][value2]).forEach(value3 => {
            users.push({
              name: this.$root.names[value1][value2][value3]["name"],
              display_name: this.$root.names[value1][value2][value3]["display_name"],
              project: value1,
              tag: value2
            });
          })
        })
      });
      return users;
    },
  },
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
    }
  }
}).$mount('#app');

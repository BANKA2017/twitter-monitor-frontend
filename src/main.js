//'use strict';
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker';
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
} from 'element-ui';
//import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
import '@femessage/element-ui/lib/theme-chalk/skeleton.css';
import Skeleton from '@femessage/element-ui/lib/skeleton.js';

//import VueHighlightJS from 'vue-highlightjs'
//Vue.use(VueHighlightJS);

Vue.prototype.basePath = process.env.NODE_ENV !== "development" ? "https://bangdream.fun/twitter" : "https://bangdream.fun/dev/tmv2";
Vue.prototype.onlinePath = ""

//gtag
//骚玩法不要学, 老老实实写代码
import VueGtag from "vue-gtag";

Vue.prototype.ready = false;
Vue.prototype.GA_ID = "UA-90617066-2";
if (process.env.NODE_ENV !== "development") {
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

//import './registerServiceWorker'
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
Vue.use(Loading.directive);
Vue.use(Skeleton);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
//Vue.component(CollapseTransition.name, CollapseTransition);
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

new Vue({
  render: h => h(App),
  router,
  data() {
    return {
      now: new Date(),
      projects: [],
      names: [],
      languageList: [],
      links: [],
      home: true,
      project: "",
      title: "Twitter Monitor",
      //height: 0,
      //altitudeDifference: 0,
      settings: {
        data: {
          language: /zh/.test(window.navigator.language.toLowerCase()) ? window.navigator.language.toLowerCase() : 'en',
          cookie_accept: false,
          displayPicture: false,
        },
        panel: false,
      },
    }
  },
  computed: {
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
  }
}).$mount('#app');

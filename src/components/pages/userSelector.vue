<template>
  <div id="userSelector">
    <div style="min-height: calc(100vh - 30px)">
      <div class="jumbotron jumbotron-fluid">
        <div class="container">
          <h1 class="display-4">Twitter Monitor</h1>
        </div>
      </div>
      <div class="container">
        <div class="col-md-8 offset-md-2">
          <search display-type="userSelector" name="" />
          <div
            v-if="project && names[project] && !home"
            class="list-group my-2"
          >
            <router-link
              v-for="(user, s) in userWithProjectList"
              :key="s"
              :to="`/i/project/` + user.project + `/` + user.name + `/all`"
              class="list-group-item list-group-item-action"
              ><b>{{ user.display_name }}</b> |
              <small>@{{ user.name }}</small> >
              <small>{{ project + " (" + user.tag + ")" }}</small>
            </router-link>
          </div>
          <template v-for="(project, s) in projects" :key="s">
            <router-link :to="`/i/project/` + project">
              <el-button
                class="text-decoration-none mx-1 mb-1"
                round
                size="mini"
                >{{ project }}
              </el-button>
            </router-link>
          </template>
          <div class="my-4"></div>
        </div>
      </div>
    </div>
    <div class="text-center" style="height: 30px">
      <link-list v-if="0 in this.links"/>
      <span v-else>NEST.MOE</span>
      <!--<template  v-if="settings.adminStatus">
            <router-link class="text-decoration-none badge badge-pill badge-dark" to="/i/admin">管理</router-link>
          </template>-->
    </div>
  </div>
</template>

<script>
import Search from "../modules/search";
import LinkList from "@/components/modules/linkList";
import {mapState, useStore} from "vuex";
import {computed, inject} from "vue";
import {useHead} from "@vueuse/head";
export default {
  name: "userSelector",
  setup() {
    const store = useStore()
    useHead({
      title: computed(() => store.state.title),
      htmlAttrs: {
        lang: computed(() => store.state.settings.data.language)
      }
    })
    const notice = inject("notice");
    return {
      notice,
    };
  },
  components: { LinkList, Search },
  computed: mapState({
    now: "now",
    title: "title",
    userList: "userList",
    project: "project",
    names: "names",
    projects: "projects",
    links: 'links',
    languageList: "languageList",
    settings: "settings",
    home: "home",
    userWithProjectList: function () {
      let list = [];
      this.userList.forEach((values) => {
        if (values.project === this.project && values.name) {
          list.push(values);
        }
      });
      return list;
    },
  }),
  beforeRouteUpdate(to) {
    this.routeCase(to)
  },
  beforeRouteEnter(to, from, next) {
    //none
    next((vm) => {
      vm.$store.dispatch({
        type: "setCoreValue",
        key: "title",
        value: "Twitter Monitor",
      });
      vm.routeCase(to);
    });
  },
  mounted: function () {
    //check $route
    if (this.names.length === 0) {
      let startTime = this.now;
      fetch(this.settings.data.basePath + "/api/v2/data/accounts/")
        .then(async accountList => {
          accountList = await accountList.json()
          this.$store.dispatch({
            type: "setCoreValue",
            key: "names",
            value: accountList.data.account_info,
          });
          this.$store.dispatch({
            type: "setCoreValue",
            key: "projects",
            value: accountList.data.projects,
          });
          this.$store.dispatch({
            type: "setCoreValue",
            key: "links",
            value: accountList.data.links,
          });
          //处理网速
          if (this.now - startTime > 3000) {
            this.$store.dispatch({
              type: "updateDisplayPictureStatus",
              status: true,
            });
            this.notice(
              this.$t(
                "notice.internet_speed_is_too_slow_now_image_display_has_been_turned_off"
              ),
              "warning"
            );
          }
        })
        .catch((error) => {
          this.notice(error, "error");
        });
    }
  },
  methods: {
    routeCase: function (to = this.$route) {
      if (to.path === "/") {
        this.$store.dispatch({
          type: "setCoreValue",
          key: "project",
          value: "",
        });
      }
      //project
      if (to.params.project) {
        this.$store.dispatch({
          type: "setCoreValue",
          key: "home",
          value: false,
        });
        this.$store.dispatch({
          type: "setCoreValue",
          key: "project",
          value: to.params.project,
        });
        if (to.params.name) {
          this.$router.replace({
            path: "/" + to.params.name +
                (to.params.status ? "/status/" + to.params.status + "/" :
                    (to.params.display ? "/" + to.params.display + "/" : "/all/")),
          });
        } else {
          this.$store.dispatch({
            type: "setCoreValue",
            key: "title",
            value: this.project + " / Twitter Monitor",
          });
        }
      }
    },
  },
};
</script>

<style scoped>
</style>

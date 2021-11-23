<template>
    <div id="userSelector">
        <div style="min-height: calc(100vh - 30px);">
            <div class="jumbotron jumbotron-fluid">
                <div class="container">
                    <h1 class="display-4">Twitter Monitor</h1>
                </div>
            </div>
            <div class="container">
                <div class="col-md-8 offset-md-2">
                    <search display-type="userSelector" name=""/>
                    <div class="list-group my-2" v-if="$root.project && $root.names[$root.project] && !$root.home">
                        <router-link :key="s" :to="`/i/project/`+user.project+`/`+user.name+`/all`"
                                     class="list-group-item list-group-item-action"
                                     v-for="(user, s) in userWithProjectList"><b>{{ user.display_name }}</b> | <small>@{{
                            user.name }}</small> > <small>{{ $root.project + ' (' + user.tag + ')' }}</small>
                        </router-link>
                    </div>
                    <template v-for="(project, s) in $root.projects">
                        <router-link :to="`/i/project/`+project" :key="s">
                            <el-button class="text-decoration-none mx-1 mb-1" round size="mini">{{
                                project
                              }}
                            </el-button>
                        </router-link>
                    </template>
                    <div class="my-4"></div>
                </div>
            </div>
        </div>
        <div class="text-center" style="height: 30px">
          <link-list v-if="$root.links.length !== 0"/>
          <span v-else>NEST.MOE</span>
          <!--<template  v-if="$root.settings.adminStatus">
            <router-link class="text-decoration-none badge badge-pill badge-dark" to="/i/admin">管理</router-link>
          </template>-->
        </div>
    </div>
</template>

<script>
    import Search from "../modules/search";
    import axios from "axios";
    import LinkList from "@/components/modules/linkList";
    export default {
      name: "userSelector",
      components: {LinkList, Search},
      metaInfo() {
        return {
          title: this.$root.title,
          htmlAttrs: {
            lang: 'zh',
          }
        }
      },
      computed: {
        userWithProjectList: function () {
          let list = [];
          this.$root.userList.forEach(values => {
            if (values.project === this.$root.project && values.name) {
              list.push(values);
            }
          });
          return list;
        },
        },
        beforeRouteUpdate(to, from, next) {
            this.routeCase(to)
            next()
        },
        beforeRouteEnter(to, from, next) {
            //none
            next(vm => {
              vm.$root.title = "Twitter Monitor"
              vm.routeCase(to)
                next()
            })
        },
        mounted: function () {
            //check $route
            if (this.$root.names.length === 0 || this.$root.languageList.length === 0) {
                let startTime = Date.now();
                axios.all([this.getAccountList(), this.getLanguageList()]).then(axios.spread((accountList, languageList) => {
                  this.$root.languageList = languageList.data;
                  this.$root.names = accountList.data.data.account_info;
                  this.$root.projects = accountList.data.data.projects;
                  this.$root.links = accountList.data.data.links;
                  this.$root.settings.adminStatus = !!accountList.data.whiteIP
                  //处理网速
                  if (Date.now() - startTime > 3000) {
                    this.$root.settings.data.displayPicture = true;
                    this.notice(this.$t("notice.internet_speed_is_too_slow_now_image_display_has_been_turned_off"), 'warning');
                  }
                })).catch(error => {
                    this.notice(error, 'error');
                });
            }

        },
        methods: {
            getAccountList: function () {
              return axios.get(this.$root.settings.data.basePath + "/api/v2/data/accounts/");
            },
            getLanguageList: function () {
                return axios.get("/language_target.json");
            },
            routeCase: function (to = this.$route) {
              if (to.path === '/') {
                this.$root.project = ''
              }
              //project
              if (to.params.project) {
                this.$root.home = false
                this.$root.project = to.params.project;
                if (to.params.name) {
                  this.$router.replace({path: '/' + to.params.name + (to.params.status ? ('/status/' + to.params.status + '/') : (to.params.display ? ('/' + to.params.display + '/') : '/all/'))});
                } else {
                  this.$root.title = this.$root.project + ' / Twitter Monitor';
                }
              }
            }
        }
    }
</script>

<style scoped>

</style>

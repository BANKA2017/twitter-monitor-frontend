<template>
    <div id="stats">
        <div class="jumbotron jumbotron-fluid" style="background-color: #1da1f2">
            <div class="container">
                <h1 class="display-3" style="color: white">统计</h1>
                <p class="lead" style="color: white">咕咕咕</p>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <tmv2-chart :chart-rows="chartData('followers')" :colors="['#19d4ae']"
                                :label-map="{name: 'name', followers: '关注者'}" sort-key="followers"/>
                    <div class="my-4"></div>
                  <tmv2-chart :chart-rows="chartData('following')" :colors="['#5ab1ef']"
                              :label-map="{name: 'name', following: '正在关注'}" sort-key="following"/>
                    <div class="my-4"></div>
                  <tmv2-chart :chart-rows="chartData('statuses_count')" :colors="['#fa6e86']"
                              :label-map="{name: 'name', statuses_count: '总推文数'}" sort-key="statuses_count"/>
                </div>
              <div class="col-md-6">
                <tmv2-table :table-data="tableData"/>
              </div>
            </div>
        </div>
      <div class="my-4"></div>
      <div class="text-center">
        <el-button circle @click="$router.go(-1)"><arrow-left height="1em" status="" width="1em"/></el-button>
      </div>
      <div class="my-4"></div>
      <div class="text-center" style="height: 30px">
        NEST.MOE
      </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import Tmv2Table from "../modules/tmv2Table";
    import Tmv2Chart from "../modules/tmv2Chart";
    import {mapState} from "vuex/dist/vuex.esm-browser.prod";
    import {inject} from "vue";
    import {useHead} from "@vueuse/head";
    import ArrowLeft from "@/components/icons/arrowLeft";
    export default {
      name: "stats",
      setup() {
        useHead({
          title: '统计',
          meta: [{
            name: "theme-color",
            content: "#1da1f2"
          }]
        })
      },
      components: {ArrowLeft, Tmv2Chart, Tmv2Table},
      data() {
        return {
          rawData: [],
        }
      },
      computed: mapState({
        names: 'names',
        setup () {
          const notice = inject('notice')
          return {
            notice
          }
        },
        settings: 'settings',
        tableData: function () {
          return this.rawData.map(x => {
            return {
              name: x.display_name,
              following: x.following,
              followers: x.followers,
              statuses_count: x.statuses_count,
              group: x.group
            }
          })
            },
        }),
        mounted: function () {
            //document.title = 'Stats/统计';
            if (this.names.length === 0) {
              axios.get(this.settings.data.basePath + "/api/v2/data/accounts/").then(response => {
                this.$store.dispatch({
                  type: 'setCoreValue',
                  key: 'names',
                  value: response.data.data.account_info
                })
                this.$store.dispatch({
                  type: 'setCoreValue',
                  key: 'projects',
                  value: response.data.data.projects
                })
                this.$store.dispatch({
                  type: 'setCoreValue',
                  key: 'links',
                  value: response.data.data.links
                })
                this.$store.dispatch({
                  type: 'setSettings',
                  node: 'adminStatus',
                  data: !!response.data.whiteIP
                })
              }).catch(error => {
                this.notice(error, 'error');
              });
            }
            axios.get(this.settings.data.basePath + '/api/v2/data/stats').then(response => {
                this.rawData = response.data.data;
            }).catch(error => {
                this.$message({
                    message: error,
                    type: 'error'
                });
            })
        },
        methods: {
            chartData: function (type) {
                return this.rawData.map(x => ({
                        name: x.display_name,
                        [type]: x[type],
                    }))
            },
        }
    }
</script>

<style scoped>

</style>

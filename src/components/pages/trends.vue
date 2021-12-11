<template>
  <div id="trends">
    <div class="jumbotron jumbotron-fluid" style="background-color: #1da1f2">
      <div class="container">
        <h1 class="display-4" style="color: white">趋势</h1>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-md-6 mb-2">
          <el-skeleton :loading="hashTagsRank24.length === 0" :rows="7" animated>
            <ul class="list-group">
              <router-link v-for="(hashtagInfo, order) in hashTagsRank24" :key="order" :to="`/hashtag/` + hashtagInfo.text" class="col-md-12 text-muted text-decoration-none list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                #{{ hashtagInfo.text }}
                <span class="badge badge-primary badge-pill">{{ hashtagInfo.count }}</span>
              </router-link>
            </ul>
          </el-skeleton>
        </div>
        <div class="col-md-6 mb-2">
          <div class="row">
            <div v-for="(v, k) in userData" :key="k" :class="{'mb-2': true, 'col-md-12': true}">
              <label :for="`list`+k" class="text-muted small mb-2">{{ listType[k][0] }}</label>
              <div :id="`list`+k" class="list-group">
                <template v-for="(data, key) in v">
                  <router-link v-if="!(k === 2 && data.count < 0)" :key="key" :class="{'list-group-item': true, 'list-group-item-action': true, 'd-flex': false, 'justify-content-between': true, 'align-items-center': true}" :to="`/` + data.name + `/all`">
                    <el-image :src="createRealMediaPath('userinfo') + (data.header.replace(/https:\/\/|http:\/\//, ''))" class="rounded-circle img-fluid" lazy style="max-height: 50px; max-width: 50px"></el-image>
                    <div class="d-flex w-100 justify-content-between">
                      <h5 class="mb-1 d-inline-block text-truncate">{{ data.display_name }}</h5>
                      <small><span class="badge badge-primary badge-pill">{{ data.count }}</span></small>
                    </div>
                    <p class="mb-1">@{{ data.name }}</p>
                  </router-link>
                </template>
              </div>
            </div>
            <div class="col-md-12">
              <tmv2-chart :chart-rows="timeCount" :label-map="{time: '发推时间', count: '数量'}" :y-axis="{type: 'value', name: '推文数量'}" chartHeight="220px" title="发推时间段 (GMT+9)"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <transition name="el-fade-in">
      <div class="el-backtop" style="right: 40px; bottom: 90px"
           @click="()=>{getData()}">
        <arrow-clockwise height="1em" status="" width="1em" />
      </div>
    </transition>
  </div>
</template>

<script>
import Tmv2Chart from "@/components/modules/tmv2Chart";
import {mapState} from "vuex";
import {inject} from "vue";
import {useHead} from "@vueuse/head";
import ArrowClockwise from "@/components/icons/arrowClockwise";
export default {
  name: "trends",
  setup () {
    useHead({
      title: '趋势',
      meta: [{
        name: "theme-color",
        content: "#1da1f2"
      }]
    })
    const notice = inject('notice')
    return {
      notice
    }
  },
  components: {ArrowClockwise, Tmv2Chart},
  data: () => ({
    //24小时榜
    hashTagsRank24: [],
    timeCountOrigin: [],
    userData: [],
    listType: [['增粉榜', '#fa6e86'], ['掉粉榜', '#19d4ae'], ['发推榜', '#fa6e86']],
  }),
  computed: mapState({
    settings: 'settings',
    realMediaPath: 'realMediaPath',
    samePath: 'samePath',
    timeCount: function () {
      return this.timeCountOrigin.map((count, time) => ({time: time, count: count}))
    }
  }),
  mounted: function () {
    this.getData()
  },
  methods: {
    getData: function () {
      fetch(this.settings.data.basePath + '/api/v2/data/trends').then(async response => {
        response = await response.json()
        this.hashTagsRank24 = response.data.hashtag_list
        this.timeCountOrigin = response.data.tweet_time_list
        response.data.following.push(response.data.statuses)
        this.userData = response.data.following
        this.userData[1] = this.userData[1].reverse()
      }).catch(error => {
        this.notice(error, "error")
        //if (this.tweetStatus.displayType === "timeline" && error.toString() !== 'Cancel') {
        //  this.notice('加载失败，5s后重试重试 #' + error, 'error');
        //  setTimeout(() => {
        //    this.createChart()
        //  }, 5000);
        //}
      });
    },
    createRealMediaPath: function (type = 'tweets') {
      return this.realMediaPath + (this.samePath ? type + '/' : '')
    }
  }
}
</script>

<style scoped>

</style>

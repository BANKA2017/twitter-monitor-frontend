<template>
    <div id="status">
      <div class="jumbotron jumbotron-fluid" style="background-color: #1da1f2">
        <div class="container">
          <h1 class="display-3" style="color: white">状态</h1>
          <p class="lead" style="color: white">最近24小时爬虫服务状态</p>
        </div>
      </div>
      <div class="container">
        <div class="row">
          <div v-for="(row, order) in itemRows" :key="order" class="col-md-12">
            <tmv2-chart :chart-rows="row" :colors="color[order]" :label-map="labelMap[order]"
                        chart-type="line"></tmv2-chart>
          </div>
        </div>
        <div class="my-4"></div>
        <div class="text-center">
          <el-button @click="$router.go(-1)" circle icon="el-icon-back"></el-button>
        </div>
        <div class="my-4"></div>
      </div>
      <div class="text-center" style="height: 30px">
        >_ KDNETWORK
      </div>
    </div>
</template>

<script>
import axios from "axios";
import Tmv2Chart from "@/components/modules/tmv2Chart";

export default {
  name: "status",
  components: {Tmv2Chart},
  data() {
    return {
      rows: [],
      itemRows: {
        account: [],
        tweets: [],
        requests: [],
        timeCount: [],
      },
      labelMap: {
        account: {
          'time': '日期',
          'total_users': '帐号数',
        },
        tweets: {
          'time': '日期',
          'total_media_count': '总媒体数',
          'total_tweets': '推文数',
          'total_req_tweets': '处理推文数',
          'total_throw_tweets': '丢弃推文数',

        },
        requests: {
          'time': '日期',
          'total_req_times': '总请求数',
          'total_errors_count': '总失败数',
        },
        timeCount: {
          'time': '日期',
          'total_time_cost': '总耗时',
        }
      },
      color: {
        account: ['#19d4ae'],
        tweets: ['#5ab1ef', '#fa6e86', '#ffb980', '#c4b4e4'],
        requests: ['#0067a6', '#5ab1ef'],
        timeCount: ['#d87a80'],
      }
    }
  },
  metaInfo() {
    return {
      title: "状态",
      meta: [{
        name: "theme-color",
        content: "#1da1f2"
      }]
    }
  },
  watch: {
    "rows": function () {
      this.rows.map(x => {
        let time = new Date(x.time * 1000)
        time = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes()
        this.itemRows.account.push({time: time, total_users: x.total_users})
        this.itemRows.tweets.push({
          time: time,
          total_tweets: x.total_tweets,
          total_req_tweets: x.total_req_tweets,
          total_throw_tweets: x.total_throw_tweets,
          total_media_count: x.total_media_count
        })
        this.itemRows.requests.push({
          time: time,
          total_req_times: x.total_req_times,
          total_errors_count: x.total_errors_count
        })
        this.itemRows.timeCount.push({time: time, total_time_cost: x.total_time_cost})
      })
    },
  },
  mounted: function () {
    axios.get(this.basePath + '/api/v2/data/status').then(response => {
      this.rows = response.data.data;
      if (!this.rows.length) {
        this.notice("chart: " + response.data.message, "warning");
      }
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
}
</script>

<style scoped>

</style>

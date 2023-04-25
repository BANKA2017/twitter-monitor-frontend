<template>
  <div id="topics-index">
    <template v-if="$route.name === 'mainTopics'">
      <single-page-header title="专题" />
      <div class="container">
        <div class="row">
          <div class="col-md-8 offset-md-2 mb-4" v-for="info in topics" :key="info.link">
            <router-link class="card text-decoration-none stretched-link" :to="info.link">
              <div class="card-body">
                <h5 class="card-title" style="color: black">{{ info.title }}</h5>
                <h6 class="card-subtitle mb-2 text-muted">{{ info.update_time }}</h6>
                <p class="card-text" style="color: black">{{info.description }}</p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
      <div class="text-center">&gt;_ Twitter Monitor</div>
    </template>
    <router-view v-else />
  </div>
</template>

<script lang="ts">
import {useHead} from "@vueuse/head";
import {defineComponent} from "vue";
import SinglePageHeader from "../../components/SinglePageHeader.vue";

export default defineComponent({
  components: {SinglePageHeader},
  setup() {
    useHead({
      title: '专题',
      meta: [{name: "theme-color", content: "#1da1f2"}]
    })

    const topics = [{
      title: "2019年度统计",
      description: "Twitter monitor 2019年度统计，第一次做这玩意，写得很烂",
      update_time: "2021-02-24",
      link: "/i/topics/2019/"
    }, {
      title: "2020年度统计",
      description: "Twitter monitor 2020年度统计，尝试整了一些新表格什么的，做的不够完整略有遗憾，明年继续努力",
      update_time: "2020-12-31",
      link: "/i/topics/2020/"
    }, {
      title: "Love Live! 统计",
      description: "这是以周为更新周期自动生成的报告，报告仅供参考，Twitter monitor 不对其内容负责",
      update_time: "2021-04-10",
      link: "/i/topics/lovelive_trends/"
    }, {
      title: "全员K线图",
      description: "这是以10分钟为更新周期、以天为最小单位自动生成的报告，报告仅供参考，Twitter monitor 不对其内容负责，未来将会合并到其他板块",
      update_time: "2021-09-07",
      link: "/i/trends/bang_dream_info"
    }, {
      title: "2021年度统计",
      description: "Twitter monitor 2021年度报告",
      update_time: "2021-12-30",
      link: "/i/topics/2021/"
    },{
      title: "BanG Dream! 统计",
      description: "这是以周为更新周期自动生成的报告，报告仅供参考，Twitter monitor 不对其内容负责",
      update_time: "2022-08-15",
      link: "/i/topics/bangdream_trends/"
    },{
      title: "2022年度统计",
      description: "Twitter monitor 2022年度报告",
      update_time: "2022-12-31",
      link: "/i/topics/2022/"
    }].reverse()
    return {topics}
  }
})
</script>

<style scoped>

</style>

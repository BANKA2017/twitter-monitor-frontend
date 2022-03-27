<template>
  <div class="api">
    <single-page-header title="API" />
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h3>说在前面</h3>
          <ul>
            <li>API仅供参考，由于内部版本更新很快，有很多的功能不能及时更新，还请见谅</li>
            <li>短时间需要大量请求请联系站长设置白名单，否则可能会遇到CloudFlare的限制访问</li>
            <li>如果只是为了爬本站的数据（尤其是要爬全部数据），请联系站长导出数据库而不是爬半天还得防反爬</li>
            <li>以下所有api仅限于本站已稳定开放的功能，允许自行抓取并使用未列出部分（如媒体下载器），但此部分可能会有剧烈改动，不建议使用</li>
            <li>下面的内容选自 <a href="https://github.com/BANKA2017/twitter-monitor/blob/master/v2api.php" target="_blank">BANKA2017:
              twitter-monitor~/v2api.php</a> 注释，组合后可使用
            </li>
            <li>关于接口返回的数据类型，请访问 <a href="https://github.com/BANKA2017/twitter-monitor-frontend/blob/v3/src/type/Api.ts" target="_blank">BANKA2017/twitter-monitor-frontend~/src/type/Api.ts</a> 了解更多</li>
          </ul>
          <el-divider class="my-4" />
          <p>api基础链接 {{ store.getters.getBasePath + "/api/v2" }}</p>
          <template v-for="doc in docs" :key="doc">
            <pre>{{ doc }}</pre>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import SinglePageHeader from "@/components/SinglePageHeader.vue"
import {computed, defineComponent} from "vue"
import {useStore} from "@/store"
export default defineComponent({
  components: {SinglePageHeader},
  setup() {
    const docs = [
      "// /data/userinfo/?name={$username}\n// /?mode=data&type=userinfo&name=bang_dream_info\n// /?mode=data&type=userinfo&uid=3009772568",
      "// /data/tweets/?name={$username}[&tweet_id={$tweet_id}[&is_status]]\n// /?mode=data&type=tweets&name=bang_dream_info",
      "// /data/chart/?name={$username}[&end={$endTimestamp}[&refresh=1[&length={$length}]]]\n// /?mode=data&type=chart&name=bang_dream_info\n// /?mode=data&type=chart&uid=3009772568",
      "// /data/search/?q={$q}[&tweet_id={$tweet_id}]\n// /?mode=data&type=search&q={$q}",
      "// /data/hashtag/?hash={$hashtag}\n// /data/symbol/?hash={$hashtag}//cashtag\n// /?mode=data&type=tag&hash=gg",
      "// /data/translate/?tweet_id={$tweet_id}&to={$language}&tr_type={$translate_type}\n// /?mode=data&type=translate&tweet_id=0&to=zh_CN&tr_type=tweets //for tweets\n// /?mode=data&type=translate&uid=0&to=zh_CN&tr_type=profile //for user description",
      "// /data/stats/\n// /?mode=data&type=stats",
      "// /data/status/\n// /?mode=data&type=status",
      "// /data/accounts/\n// /?mode=data&type=accounts"
    ]
    const store = useStore()
    return {store, docs}
  }
})
</script>

<style scoped>

</style>

<template>
  <div v-once id="annual2019">
    <single-page-header title="Twitter Monitor" sub-title="2019 年度数据" />
    <div class="container">
      <div class="row">
        <div class="col-md-10 offset-md-1">
          <p>2019年即将结束，下面是最近半年Twitter Monitor的统计。(截至2019年12月31日13:00 GMT+8)</p>
          <p>本站建立于2019年5月12日，至今已运行233天，全站数据库共占用224MB，内部版本已提交89次，开源版本已提交3次</p>
          <p>现在共监控84个twitter账号，其中有24个Twitter已认证的账号</p>
          <p>共存有约114,219条推文，共含有165,095个hash tag。其中使用量最大的hash tag是 <a href="https://twitter.com/hashtag/lovelive" target="_blank">#lovelive</a> ，出现了11,196次；紧追其后的是 <a href="https://twitter.com/hashtag/%E3%83%90%E3%83%B3%E3%83%89%E3%83%AA" target="_blank">#バンドリ</a> ，共出现了10,020次</p>
          <p>全站共有61,173条含有媒体的推文，占总推文数的54%；已翻译推文有302条，占总推文数的0.26%，在新的一年里面希望能够有所增长</p>
          <p>站内记录中发推数量最多的是 <a href="https://twitter.com/Yuki_Nakashim" target="_blank">中島由貴</a> ，共有3,052条推文；而总发推数最多的是 <a href="https://twitter.com/lovelive_SIF" target="_blank">【公式】ラブライブ！スクフェス事務局</a> ，共发推2,391,252条</p>
          还有一些有无趣的数据：
          <ul class="ms-4">
            <li>粉丝数最多的是 <a href="https://twitter.com/bang_dream_gbp" target="_blank">バンドリ！ ガールズバンドパーティ！</a>，共有1,511,462粉丝</li>
            <li>最愿意关注他人的账号是 <a href="https://twitter.com/nekopara_pr" target="_blank">NEKO WORKs@Official</a>，共关注了2,689个twitter账号</li>
            <li>发送最多媒体文件（图片/视频）的是<a href="https://twitter.com/lovelive_SIF" target="_blank">【公式】ラブライブ！スクフェス事務局</a>，共发送了2,387,538条带媒体推文</li>
            <li>最早创建的账号是 <a href="https://twitter.com/C2_STAFF" target="_blank">C2機関</a>，创建于 2010-01-15 12:26:29 UTC+8</li>
            <li>最新的账号创建于2019-08-06 17:45:44 UTC+8，是<a href="https://twitter.com/LLAS_STAFF" target="_blank">ラブライブ！スクスタ公式</a></li>
            <li>有一个账号在twitter消失，叫做 <span class="font-weight-bold">【公式】ぷちぐるラブライブ！運営</span></li>
            <li>以上几列数据里面没有一个是个人账号</li>
          </ul>
          <div class="lead my-2">2021-02-24补充</div>
          <p>未来应该会将v1的数据与v2的合并，至于能不能成嘛……还真的不好说</p>
          <code>于 2021-02-24 转移至此</code><br>
          <code>Project Twitter Monitor</code><br>
          <div class="mb-2"><code>Copyright © 2019 KDNETWORK</code></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useHead} from "@vueuse/head";
import SinglePageHeader from "../../components/SinglePageHeader.vue";
useHead({
  title: '2019统计',
  meta: [{
    name: "theme-color",
    content: "#1da1f2"
  }]
})
</script>

<style scoped>

</style>

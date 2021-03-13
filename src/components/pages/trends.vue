<template>
  <div id="trends">
    <div class="jumbotron jumbotron-fluid" style="background-color: #1da1f2">
      <div class="container">
        <h1 class="display-4" style="color: white">趋势</h1>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <ul class="list-group">
            <router-link v-for="(hashtagInfo, order) in hashTagsRank24" :key="order" :to="`/hashtag/` + hashtagInfo.text" class="text-muted text-decoration-none list-group-item list-group-item-action d-flex justify-content-between align-items-center">
              #{{ hashtagInfo.text }}
              <span class="badge badge-primary badge-pill">{{ hashtagInfo.count }}</span>
            </router-link>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "trends",
  data: () => ({
    //24小时榜
    hashTagsRank24:
        [{"text":"\u82b1\u67f3\u9999\u5b50\u8a95\u751f\u796d2021","count":5},{"text":"\u30b9\u30bf\u30ea\u30e9","count":4},{"text":"\u4f0a\u85e4\u5f69\u6c99","count":1},{"text":"D4DJ","count":1},{"text":"\u30b0\u30eb\u30df\u30af","count":1},{"text":"\u30ef\u30f3\u30c0\u30fc\u30a8\u30c3\u30b0\u30fb\u30d7\u30e9\u30a4\u30aa\u30ea\u30c6\u30a3","count":1},{"text":"\u30ef\u30f3\u30a8\u30b0","count":1},{"text":"\u304b\u3082\u3059\u305f","count":1},{"text":"\u30a2\u30eb\u30b4\u30ca\u30d3\u30b9","count":1},{"text":"\u30c0\u30d6\u30a8\u30b9","count":1}],
    hashTagsSpecial: [//特别关注 //#バンドリ #ラブライブ

    ],
    twitterTrendsRank: [

    ]
  }),
  metaInfo () {
    return {
      title: "趋势",
      meta: [{
        name: "theme-color",
        content: "#1da1f2"
      }]
    }
  },
}
</script>

<style scoped>

</style>

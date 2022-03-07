<template>
  <single-page-header title="Twitter Monitor" height="230px" />
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <project-list :on-main="true"/>
        <link-list style="padding-left: 5px" />
      </div>
      <div class="col-md-6">
        <tweets class="my-4"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref, Ref, toRefs} from "vue";
import SinglePageHeader from "@/components/SinglePageHeader.vue";
import WordCloudChartForAnnual2021 from "@/views/events/modules/wordCloudChartForAnnual2021.vue";
import {HashtagList} from "@/type/Content";
import {controller, request} from "@/share/Fetch";
import {ApiHashtagList} from "@/type/Api";
import {useStore} from "@/store";
import {Notice} from "@/share/Tools";
import Tweets from "@/components/Tweets.vue";
import ProjectList from "@/components/ProjectList.vue";
import {onBeforeRouteLeave} from "vue-router";
import LinkList from "@/components/LinkList.vue";
export default defineComponent({
  components: {LinkList, ProjectList, Tweets, WordCloudChartForAnnual2021, SinglePageHeader},
  setup() {
    const state = reactive<{
      hashtagList: Ref<HashtagList[]>
    }>({
      hashtagList: ref([])
    })
    onMounted(async () => {
      //await request<ApiHashtagList>(settings.value.basePath + '/api/v2/data/hashtag_rank/', controller).then(response => {
      //  state.hashtagList = response.data.list
      //  if (!state.hashtagList.length) {
      //    Notice("chart: " + response.message, "warning");
      //  }
      //}).catch((e: Error) => Notice(String(e), "error"))
    })
    return {...toRefs(state)}
  }
})
</script>

<style scoped>

</style>
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
import {defineComponent} from "vue";
import SinglePageHeader from "@/components/SinglePageHeader.vue";
import WordCloudChartForAnnual2021 from "@/views/events/modules/wordCloudChartForAnnual2021.vue";
import Tweets from "@/components/Tweets.vue";
import ProjectList from "@/components/ProjectList.vue";
import LinkList from "@/components/LinkList.vue";
export default defineComponent({
  components: {LinkList, ProjectList, Tweets, WordCloudChartForAnnual2021, SinglePageHeader},
})
</script>

<style scoped>

</style>
<template>
  <single-page-header title="Twitter Monitor" height="230px" />
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <project-list :on-main="true"/>
        <local-router class="mt-3" style="padding-left: 5px" />
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
import Tweets from "@/components/Tweets.vue";
import ProjectList from "@/components/ProjectList.vue";
import LinkList from "@/components/LinkList.vue";
import LocalRouter from "@/components/LocalRouter.vue";
export default defineComponent({
  components: {LocalRouter, LinkList, ProjectList, Tweets, SinglePageHeader},
})
</script>

<style scoped>

</style>
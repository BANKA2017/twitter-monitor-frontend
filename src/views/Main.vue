<template>
  <single-page-header title="Twitter Monitor" height="230px" />
  <div class="container">
    <div class="row">
      <div :class="{'col-md-6': !settings.onlineMode, 'col-md-8': settings.onlineMode, 'offset-md-2': settings.onlineMode}">
        <project-list :on-main="true" class="mb-3"/>
        <local-router class="mb-3" style="padding-left: 5px" />
        <link-list style="padding-left: 5px" class="mb-2" />
        <search :style="{position: 'sticky', top: '2rem'}" class="mb-3" />
      </div>
      <div class="col-md-6" v-if="!settings.onlineMode">
        <tweets class="my-4"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";
import SinglePageHeader from "@/components/SinglePageHeader.vue";
import Tweets from "@/components/Tweets.vue";
import ProjectList from "@/components/ProjectList.vue";
import LinkList from "@/components/LinkList.vue";
import LocalRouter from "@/components/LocalRouter.vue";
import Search from "@/components/Search.vue";
import {useStore} from "@/store";
export default defineComponent({
  components: {Search, LocalRouter, LinkList, ProjectList, Tweets, SinglePageHeader},
  setup() {
    const store = useStore()
    const width = computed(() => store.state.width)
    const height = computed(() => store.state.height)
    const settings = computed(() => store.state.settings)
    return {width, height, settings}
  }
})
</script>

<style scoped>

</style>
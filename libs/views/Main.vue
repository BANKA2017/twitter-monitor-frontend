<template>
  <div v-if="settings.onlineMode">
    <single-page-header title="Twitter Monitor" height="230px" />
    <div class="container">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <div class="mb-3" style="padding-left: 5px"><local-router :keep-inline="true" /></div>
          <div style="position: sticky; top: 2rem;" class="mb-3"><search /></div>
        </div>
        <div class="col-md-8 offset-md-2">
          <div class="mt-2 mb-5">
            <online-trends />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else >
    <div class="container">
      <div class="row">
        <div class="col-md-3 order-1 order-md-2">
          <div style="position: sticky; top: 2rem;" class="mb-3"><search /></div>
        </div>
        <div class="col-md-6 order-2 order-md-1">
          <div class="mt-2 mb-5"><tweets/></div>
        </div>
        <div class="col-md-3 order-0 order-md-0">
          <div style="position: sticky; top: 2rem;" >
            <div class="fs-2 fw-bold w-100 text-start">Twitter Monitor</div>
            <div class="mb-3"><project-list/></div>
            <div class="mb-3" style="padding-left: 5px"><local-router :dynamic-block="true"/></div>
            <div style="padding-left: 5px" class="mb-2 d-none d-md-block "><link-list /></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import SinglePageHeader from "../components/SinglePageHeader.vue";
import Tweets from "../components/Tweets.vue";
import ProjectList from "../components/ProjectList.vue";
import LinkList from "../components/LinkList.vue";
import LocalRouter from "../components/LocalRouter.vue";
import Search from "../components/Search.vue";
import {useStore} from "../store";
import OnlineTrends from "../components/OnlineTrends.vue";

const store = useStore()
const width = computed(() => store.state.width)
const height = computed(() => store.state.height)
const settings = computed(() => store.state.settings)

</script>

<style scoped>

</style>
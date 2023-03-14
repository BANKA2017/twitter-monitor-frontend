<template id="time-line">
  <!--TODO add type for navigation-->
  <div class="container my-4" >
    <div class="row">
      <div class="fs-2 fw-bold w-100 text-start d-block d-lg-none mb-2">Twitter Monitor</div>
      <div id="global-left-card" class="col-md-12 col-lg-3 mb-2 order-0 order-lg-2" v-if="$route.name === 'search' || $route.name === 'hashtag' || $route.name === 'cashtag'">
        <div class="card card-body" :style="{'position': 'sticky', 'top': '1.5rem'}">
          <h3 v-if="$route.name === 'search'">{{ t("public.search") }}</h3>
          <template v-else>
            <h3>
              <router-link :to="{path: '/' + $route.name + '/' + $route.params.tag}">{{ ($route.name === 'hashtag' ? '#' : '$') + $route.params.tag }}</router-link>
              <a :href="`https://twitter.com/search?q=`+ encodeURIComponent(($route.name === 'hashtag' ? '#' : '$') + $route.params.tag)" target="_blank">
                <box-arrow-up-right height="1em" status="text-primary" width="1em"/>
              </a>
            </h3>
          </template>
        </div>
        <!--TODO hashtag list-->
        <!--<div class="my-2" v-if="$route.name === 'search'">
          <hash-tag-list />
        </div>-->
      </div>
      <div id="user-info" class="col-md-12 col-lg-3 mb-2 order-0 order-lg-2" v-else-if="userExists">
        <user-info/>
      </div>
      <div class="col-md-8 order-0 order-lg-2" v-else>
        <h5 class="text-center mb-4">{{ t("timeline.message.not_exist", [$route.params.name]) }}</h5>
      </div>
      <div id="tweets" class="col-md-12 col-lg-6 order-1" v-if="userExists">
        <!--TODO update display-type-->
        <div class="mb-4"><search display-type="timeline" :name="($route.params.name && userExists) ? $route.params.name : ''" /></div>
        <tweets />
      </div>
      <div id="links" class="col-md-12 col-lg-3 order-3 order-lg-0">
        <div :style="{'position': 'sticky', 'top': '1.5rem'}">
          <div class="fs-2 fw-bold w-100 text-start d-none d-lg-block">Twitter Monitor</div>
          <project-list v-if="!settings.onlineMode"/>
          <div class="mb-1"><local-router style="padding-left: 0;" /></div>
          <el-divider class="my-2" />
          <link-list v-if="!settings.onlineMode"/>
          <div v-else class="mb-2 text-muted"><small>NEST.MOE</small></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue"
import Navigation from "@/components/Navigation.vue";
import ProjectList from "@/components/ProjectList.vue";
import LinkList from "@/components/LinkList.vue";
import ArrowClockwise from "@/icons/ArrowClockwise.vue";
import UserInfo from "@/components/UserInfo.vue";
import {useI18n} from "vue-i18n";
import {useStore} from "@/store";
import Search from "@/components/Search.vue";
import Tweets from "@/components/Tweets.vue";
import { useRoute } from "vue-router";
import BoxArrowUpRight from "@/icons/BoxArrowUpRight.vue";
import LocalRouter from "@/components/LocalRouter.vue";
import router from "@/router";

const { t } = useI18n()
const store = useStore()
const route = useRoute()
const userExists = computed(() => store.state.userExists)
const settings = computed(() => store.state.settings)
const tweetType = computed(() => store.state.tweetType)
const width = computed(() => store.state.width)
const swapDisplayPictureStatus = () => {
  store.dispatch('swapDisplayPictureStatus')
}
router.beforeEach(() => {
  store.dispatch("setCoreValue", {key: 'userExists', value: true})
})
</script>

<style scoped>

</style>

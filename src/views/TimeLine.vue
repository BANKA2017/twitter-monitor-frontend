<template id="time-line">
  <!--TODO add type for navigation-->
  <navigation display-type="timeline" class="mb-4" />
  <div class="container" >
    <div class="row">
      <div id="global-left-card" class="col-sm-12 col-md-4 mb-4" v-if="$route.name === 'search' || $route.name === 'hashtag' || $route.name === 'cashtag'">
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
      </div>
      <div id="user-info" class="col-sm-12 col-md-4" v-else-if="userExists">
        <user-info class="mb-4"/>
      </div>
      <div class="col-md-10" v-else>
        <h5 class="text-center mb-4">{{ t("timeline.message.not_exist", [$route.params.name]) }}</h5>
      </div>
      <div id="tweets" class="col-sm-12 col-md-6" v-if="userExists">
        <!--TODO update display-type-->
        <search display-type="timeline" :name="($route.params.name && userExists) ? $route.params.name : ''" class="mb-4" />
        <tweets />
      </div>
      <div id="links" class="col-sm-12 col-md-2">
        <div :style="{'position': 'sticky', 'top': '1.5rem'}">
          <project-list v-if="!settings.onlineMode"/>
          <local-router class="mb-1 col-10 col-md-12" style="padding-left: 0;" />
          <el-divider class="my-4" />
          <link-list v-if="!settings.onlineMode"/>
          <div v-else class="mb-2 text-muted"><small>NEST.MOE</small></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, reactive, ref, toRefs} from "vue"
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
export default defineComponent({
  components: {LocalRouter, BoxArrowUpRight, Tweets, Search, UserInfo, ArrowClockwise, LinkList, ProjectList, Navigation},
  setup() {
    const { t } = useI18n()
    const store = useStore()
    const route = useRoute()
    const userExists = computed(() => store.state.userExists)
    const settings = computed(() => store.state.settings)
    const tweetType = computed(() => store.state.tweetType)
    const swapDisplayPictureStatus = () => {
      store.dispatch('swapDisplayPictureStatus')
    }
    router.beforeEach(() => {
      store.dispatch("setCoreValue", {key: 'userExists', value: true})
    })
    return {t, userExists, settings, swapDisplayPictureStatus, tweetType, route}
  }
})
</script>

<style scoped>

</style>

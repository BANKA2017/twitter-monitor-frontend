<template id="time-line">
  <!--TODO add type for navigation-->
  <navigation display-type="timeline" class="mb-4" />
  <div class="container" >
    <div class="row">
      <div id="global-left-card" class="col-sm-12 col-md-5 col-xl-4 mb-4" v-if="$route.name === 'search' || $route.name === 'hashtag' || $route.name === 'cashtag'">
        <div class="card card-body">
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
      <div id="user-info" class="col-sm-12 col-md-5 col-xl-4" v-else-if="userExists">
        <user-info class="mb-4"/>
      </div>
      <div class="col-md-10" v-else>
        <h5 class="text-center mb-4">{{ t("timeline.message.not_exist", [$route.params.name]) }}</h5>
      </div>
      <div id="tweets" class="col-sm-12 col-md-7 col-xl-6" v-if="userExists">
        <!--TODO update display-type-->
        <search display-type="timeline" :name="($route.params.name && userExists) ? $route.params.name : ''" class="mb-4" />
        <tweets  />
      </div>
      <div id="links" class="col-sm-12 col-md-5 col-xl-2">
        <div :style="{'position': 'sticky', 'top': '1.5rem'}">
          <project-list/>
          <div class="mb-1 col-10 col-md-12" style="padding-left: 0;">
            <router-link class="text-decoration-none badge badge-pill badge-primary mr-1" to="/search/">{{ t("timeline.side_tags.search") }}</router-link>
            <router-link class="text-decoration-none badge badge-pill badge-primary mr-1" to="/settings/" >{{ t("timeline.side_tags.settings") }}</router-link>
            <router-link class="text-decoration-none badge badge-pill badge-primary mr-1" to="/about/">{{ t("timeline.side_tags.about") }}</router-link>
            <router-link class="text-decoration-none badge badge-pill badge-primary mr-1" to="/i/stats/">{{ t("timeline.side_tags.stats") }}</router-link>
            <router-link class="text-decoration-none badge badge-pill badge-primary mr-1" to="/i/status/">{{ t("timeline.side_tags.status") }}</router-link>
            <router-link class="text-decoration-none badge badge-pill badge-primary mr-1" to="/api/">{{ t("timeline.side_tags.api") }}</router-link>
            <!--<router-link class="text-decoration-none badge badge-pill badge-primary mr-1" to="/i/online">{{ t("timeline.side_tags.media_download_tool") }}</router-link>-->
            <!--TODO RSS-->
            <!--<a :href="settings.basePath + `/api/v2/rss/` + info.name + `.xml`" target="_blank"><span
               v-if="!hidden && (tweetStatus.displayType === 'timeline' || tweetStatus.displayType === 'status')"
               class="text-decoration-none text-white badge badge-pill badge-primary mx-1">{{ t("timeline.side_tags.rss") }}</span></a>-->
            <!--<router-link is="span" v-if="settings.adminStatus"
                   class="text-decoration-none badge badge-pill badge-dark mx-1"
                   to="/i/admin">{{ t("timeline.side_tags.backstage") }}</router-link>-->
          </div>
          <hr class="my-4">
          <link-list/>
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
export default defineComponent({
  components: {BoxArrowUpRight, Tweets, Search, UserInfo, ArrowClockwise, LinkList, ProjectList, Navigation},
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
    return {t, userExists, settings, swapDisplayPictureStatus, tweetType, route}
  }
})
</script>

<style scoped>

</style>

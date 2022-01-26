<template id="time-line">
  <!--TODO add type for navigation-->
  <navigation display-type="timeline" class="mb-4" />
  <div class="container" >
    <div class="row">
      <div class="col-md-10" v-if="!userExists">
        <h5 class="text-center mb-4">{{ t("timeline.message.not_exist", [$route.params.name]) }}</h5>
      </div>
      <div id="user-info" class="col-sm-12 col-md-5 col-xl-4" v-if="userExists">
        <user-info class="mb-4"/>
      </div>
      <div id="tweets" class="col-sm-12 col-md-7 col-xl-6" v-if="userExists">
        <!--TODO update display-type-->
        <search display-type="timeline" :name="($route.params.name && userExists) ? $route.params.name : ''" class="mb-4" />
        <nav :style="{'position': 'sticky', 'top': '1.5rem', 'z-index': 1, 'background-color': 'rgba(255, 255, 255, 0.9)', 'border-radius': '0.25rem'}" class="nav nav-pills nav-fill border">
          <!--<template v-if="tweetStatus.displayType === 'timeline' && !load.leftCard">
            <li v-for="(value, s) in displayMode" :key="s" class="nav-item">
              <\!--TODO update while click--\>
              <div v-if="value[1] === tweetStatus.display" class="nav-link active" role="button">{{ value[0] }}</div>
              <router-link v-else :to="`/`+info.name+`/`+value[1]" class="nav-link">{{ value[0] }}</router-link>
            </li>
          </template>-->
          <li class="nav-item">
            <div :class="{'nav-link': true, 'active': settings.displayPicture, 'text-primary': !settings.displayPicture}" role="button" @click="swapDisplayPictureStatus">{{ t("timeline.nav_bar.no_image") }}</div>
          </li>
        </nav>
        <hr class="my-4">
      </div>
      <div id="links" class="col-sm-12 col-md-5 col-xl-2">
        <div :style="{'position': 'sticky', 'top': '1.5rem'}">
          <project-list/>
          <div class="mb-1 col-10" style="padding-left: 0;">
            <router-link class="text-decoration-none badge badge-pill badge-primary mr-1" to="/settings" >{{ t("timeline.side_tags.settings") }}</router-link>
            <router-link class="text-decoration-none badge badge-pill badge-primary mr-1" to="/about">{{ t("timeline.side_tags.about") }}</router-link>
            <router-link class="text-decoration-none badge badge-pill badge-primary mr-1" to="/i/stats">{{ t("timeline.side_tags.stats") }}</router-link>
            <router-link class="text-decoration-none badge badge-pill badge-primary mr-1" to="/i/status">{{ t("timeline.side_tags.status") }}</router-link>
            <router-link class="text-decoration-none badge badge-pill badge-primary mr-1" to="/api">{{ t("timeline.side_tags.api") }}</router-link>
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
      <!--TODO REFRESH-->
      <transition name="el-fade-in">
        <div class="el-backtop" style="right: 40px; bottom: 90px; z-index: 1500" @click="ScrollTo">
          <arrow-clockwise height="1em" status="" width="1em" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, reactive, toRefs} from "vue"
import Navigation from "@/components/Navigation.vue";
import ProjectList from "@/components/ProjectList.vue";
import LinkList from "@/components/LinkList.vue";
import ArrowClockwise from "@/icons/ArrowClockwise.vue";
import {ScrollTo} from "@/share/Tools";
import UserInfo from "@/components/UserInfo.vue";
import {useI18n} from "vue-i18n";
import {store, useStore} from "@/store";
import Search from "@/components/Search.vue";
export default defineComponent({
  components: {Search, UserInfo, ArrowClockwise, LinkList, ProjectList, Navigation},
  setup() {
    const { t } = useI18n()
    const state = reactive({

    })
    const store = useStore()
    const userExists = computed(() => store.state.userExists)
    const settings = computed(() => store.state.settings)

    const swapDisplayPictureStatus = () => {
      store.commit('swapDisplayPictureStatus')
    }

    return {...toRefs(state), ScrollTo, t, userExists, settings, swapDisplayPictureStatus}
  }
})
</script>

<style scoped>

</style>

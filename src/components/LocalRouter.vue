<template>
  <div >
    <router-link to="/search/"><el-tag class="text-decoration-none me-1 mb-1">{{ t("timeline.side_tags.search") }}</el-tag></router-link>
    <router-link to="/settings/"><el-tag class="text-decoration-none me-1 mb-1" >{{ t("timeline.side_tags.settings") }}</el-tag></router-link>
    <router-link to="/about/"><el-tag class="text-decoration-none me-1 mb-1">{{ t("timeline.side_tags.about") }}</el-tag></router-link>
    <router-link v-if="!settings.onlineMode" to="/i/trends/"><el-tag class="text-decoration-none me-1 mb-1">{{ t("timeline.side_tags.trends") }}</el-tag></router-link>
    <router-link v-if="!settings.onlineMode" to="/i/stats/"><el-tag class="text-decoration-none me-1 mb-1">{{ t("timeline.side_tags.stats") }}</el-tag></router-link>
    <router-link v-if="!settings.onlineMode" to="/i/status/"><el-tag class="text-decoration-none me-1 mb-1">{{ t("timeline.side_tags.status") }}</el-tag></router-link>
    <router-link v-if="!settings.onlineMode" to="/api/"><el-tag class="text-decoration-none me-1 mb-1" >{{ t("timeline.side_tags.api") }}</el-tag></router-link>
    <router-link to="/i/online"><el-tag class="text-decoration-none me-1 mb-1">{{ t("timeline.side_tags.media_download_tool") }}</el-tag></router-link>
    <a :href="store.getters.getBasePath + `/api/v2/rss/` + $route.params.name.toString().toLowerCase() + `.xml`" target="_blank" v-if="!settings.onlineMode && ($route.name === 'name-display' || $route.name === 'name-status') && $route.params.name"><el-tag class="text-decoration-none me-1 mb-1">{{ t("timeline.side_tags.rss") }}</el-tag></a>
  </div>
</template>

<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {useStore} from "@/store";
import {computed} from "vue";

const {t} = useI18n()
const store = useStore()
const settings = computed(() => store.state.settings)
</script>

<style scoped>

</style>

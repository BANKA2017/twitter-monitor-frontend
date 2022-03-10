<template>
  <div >
    <router-link class="text-decoration-none badge badge-pill badge-primary mr-1" to="/search/">{{ t("timeline.side_tags.search") }}</router-link>
    <router-link class="text-decoration-none badge badge-pill badge-primary mr-1" to="/settings/" >{{ t("timeline.side_tags.settings") }}</router-link>
    <router-link class="text-decoration-none badge badge-pill badge-primary mr-1" to="/about/">{{ t("timeline.side_tags.about") }}</router-link>
    <router-link class="text-decoration-none badge badge-pill badge-primary mr-1" to="/i/stats/">{{ t("timeline.side_tags.stats") }}</router-link>
    <router-link class="text-decoration-none badge badge-pill badge-primary mr-1" to="/i/status/">{{ t("timeline.side_tags.status") }}</router-link>
    <router-link class="text-decoration-none badge badge-pill badge-primary mr-1" to="/api/">{{ t("timeline.side_tags.api") }}</router-link>
    <router-link class="text-decoration-none badge badge-pill badge-primary mr-1" to="/i/online">{{ t("timeline.side_tags.media_download_tool") }}</router-link>
    <a :href="settings.basePath + `/api/v2/rss/` + $route.params.name.toString().toLowerCase() + `.xml`" target="_blank" v-if="($route.name === 'name-display' || $route.name === 'name-status') && $route.params.name"><span class="text-decoration-none text-white badge badge-pill badge-primary mx-1">{{ t("timeline.side_tags.rss") }}</span></a>
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
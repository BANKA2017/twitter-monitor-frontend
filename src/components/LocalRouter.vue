<template>
  <div >
    <router-link class="text-decoration-none badge badge-pill badge-primary mr-1" to="/search/">{{ t("timeline.side_tags.search") }}</router-link>
    <router-link class="text-decoration-none badge badge-pill badge-primary mr-1" to="/settings/" >{{ t("timeline.side_tags.settings") }}</router-link>
    <router-link class="text-decoration-none badge badge-pill badge-primary mr-1" to="/about/">{{ t("timeline.side_tags.about") }}</router-link>
    <router-link class="text-decoration-none badge badge-pill badge-primary mr-1" to="/i/stats/">{{ t("timeline.side_tags.stats") }}</router-link>
    <router-link class="text-decoration-none badge badge-pill badge-primary mr-1" to="/i/status/">{{ t("timeline.side_tags.status") }}</router-link>
    <router-link class="text-decoration-none badge badge-pill badge-primary mr-1" to="/api/">{{ t("timeline.side_tags.api") }}</router-link>
    <router-link class="text-decoration-none badge badge-pill badge-primary mr-1" to="/i/online">{{ t("timeline.side_tags.media_download_tool") }}</router-link>
    <!--TODO RSS-->
    <!--<a :href="settings.basePath + `/api/v2/rss/` + info.name + `.xml`" target="_blank"><span
       v-if="!hidden && (tweetStatus.displayType === 'timeline' || tweetStatus.displayType === 'status')"
       class="text-decoration-none text-white badge badge-pill badge-primary mx-1">{{ t("timeline.side_tags.rss") }}</span></a>-->
  </div>
</template>

<script setup lang="ts">
import {useI18n} from "vue-i18n";

const {t} = useI18n()
</script>

<style scoped>

</style>
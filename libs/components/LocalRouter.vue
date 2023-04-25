<template>
  <div class="">
    <router-link to="/" :class="'btn btn-outline-dark btn-sm border-0 fw-bold fs-5 text-decoration-none my-1 ' + (isBlock ? 'd-block ' : 'me-1 ') + ($route.name === 'main' ? 'active ' : '')">{{ t("timeline.side_tags.home") }}</router-link>
    <router-link to="/search/" :class="'btn btn-outline-dark btn-sm border-0 fw-bold fs-5 text-decoration-none my-1 ' + (isBlock ? 'd-block ' : 'me-1 ') + ($route.name === 'search' ? 'active ' : '')">{{ t("timeline.side_tags.search") }}</router-link>
    <router-link to="/i/bookmarks/" :class="'btn btn-outline-dark btn-sm border-0 fw-bold fs-5 text-decoration-none my-1 ' + (isBlock ? 'd-block ' : 'me-1 ') + ($route.name === 'bookmarks' ? 'active ' : '')">{{ t("timeline.side_tags.bookmarks") }}</router-link>
    <router-link v-if="!settings.onlineMode" to="/i/trends/" :class="'btn btn-outline-dark btn-sm border-0 fw-bold fs-5 text-decoration-none my-1 ' + (isBlock ? 'd-block' : 'me-1')">{{ t("timeline.side_tags.trends") }}</router-link>
    <router-link v-if="!settings.onlineMode" to="/i/stats/" :class="'btn btn-outline-dark btn-sm border-0 fw-bold fs-5 text-decoration-none my-1 ' + (isBlock ? 'd-block' : 'me-1')">{{ t("timeline.side_tags.stats") }}</router-link>
    <router-link v-if="!settings.onlineMode" to="/i/status/" :class="'btn btn-outline-dark btn-sm border-0 fw-bold fs-5 text-decoration-none my-1 ' + (isBlock ? 'd-block' : 'me-1')">{{ t("timeline.side_tags.status") }}</router-link>
    <router-link v-if="!settings.onlineMode" to="/api/" :class="'btn btn-outline-dark btn-sm border-0 fw-bold fs-5 text-decoration-none my-1 ' + (isBlock ? 'd-block' : 'me-1')">{{ t("timeline.side_tags.api") }}</router-link>
    <router-link to="/i/tools" :class="'btn btn-outline-dark btn-sm border-0 fw-bold fs-5 text-decoration-none my-1 ' + (isBlock ? 'd-block' : 'me-1')">{{ t("timeline.side_tags.tools") }}</router-link>
    <router-link to="/settings/" :class="'btn btn-outline-dark btn-sm border-0 fw-bold fs-5 text-decoration-none my-1 ' + (isBlock ? 'd-block ' : 'me-1 ') + ($route.name === 'settings' ? 'active ' : '')">{{ t("timeline.side_tags.settings") }}</router-link>
    <router-link to="/about/" :class="'btn btn-outline-dark btn-sm border-0 fw-bold fs-5 text-decoration-none my-1 ' + (isBlock ? 'd-block ' : 'me-1 ') + ($route.name === 'about' ? 'active ' : '')">{{ t("timeline.side_tags.about") }}</router-link>
    <a :href="store.getters.getBasePath + `/api/v3/rss/` + $route.params.name.toString().toLowerCase() + `.xml`" target="_blank" v-if="!settings.onlineMode && ($route.name === 'name-display' || $route.name === 'name-status') && $route.params.name" :class="'btn btn-outline-dark btn-sm border-0 fw-bold fs-5 text-decoration-none my-1 ' + (isBlock ? 'd-block' : 'me-1')">{{ t("timeline.side_tags.rss") }}</a>
  </div>
</template>

<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {useStore} from "../store";
import {computed} from "vue";

const props = defineProps({
  keepBlock: {
    type: Boolean,
    default: false
  },
  keepInline: {
    type: Boolean,
    default: false
  },
  dynamicBlock: {
    type: Boolean,
    default: false
  }
})

const {t} = useI18n()
const store = useStore()
const settings = computed(() => store.state.settings)
const isBlock = computed(() => !props.keepInline && (props.keepBlock || store.state.width >= 992 || (props.dynamicBlock && store.state.width >= 768)))
</script>

<style scoped>

</style>

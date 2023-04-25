<template>
  <div id="trends">
    <single-page-header title="趋势" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import {useHead} from "@vueuse/head"
import SinglePageHeader from "../../components/SinglePageHeader.vue"

useHead({
  title: '趋势',
  meta: [{name: "theme-color", content: "#1da1f2"}]
})
</script>

<style scoped>

</style>

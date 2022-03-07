<template>
  <div v-if="links && links.length" id="linkList" class="my-4">
    <template v-for="(link, s) in links" :key="link.url+s">
      <span v-if="s!==0"> · </span>
      <router-link :to="link.url" class="text-muted" v-if="!/(http|https|ftp):\/\//.test(link.url)"><small>{{ link.display }}</small></router-link>
      <a :href="link.url" class="text-muted" target="_blank" v-else><small>{{link.display }}</small></a>
    </template>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue"
import {useStore} from "@/store"

const store = useStore()
const links = computed(() => store.state.links)
</script>

<style scoped>

</style>

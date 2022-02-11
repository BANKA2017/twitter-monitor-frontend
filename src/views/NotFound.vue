<template id="not-found">
  <div :class="{'text-center': true, 'y-center': true, 'dark-mode': dark, 'light-mode': !dark}" style="min-height: 100vh">
    <h1 class="display-1">404</h1>
    <p class="lead">{{ t("notice.nothing_here") }}</p>
    <p>{{now}}</p>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from "vue"
import {useHead} from "@vueuse/head"
import { useStore } from "@/store"
import {useI18n} from "vue-i18n";
export default defineComponent({
  setup() {
    const { t } = useI18n()
    const store = useStore()
    const dark = computed(() => store.state.darkMode)
    const now = computed(() => store.state.now)
    useHead({
      title: '404',
      meta: [{name: "theme-color", content: dark ? "#011100" : "#ffffff"}]
    })
    return {dark, now, t}
  }
})
</script>

<style scoped>
.y-center {
  padding: 40vh 0 0 0;
}
</style>

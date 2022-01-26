<template id="project-list">
  <!--有确定的project-->
  <button v-if="project" class="btn btn-outline-primary btn-block btn-sm mb-4" @click="projectS = !projectS">{{ project }}</button>
  <!--未确定project-->
  <router-link v-else class="btn btn-outline-primary btn-block btn-sm mb-4" to="/">{{ t("project_list.button.select_project") }}</router-link>
  <div class="list-group my-4" v-if="projectS">
    <router-link v-for="project_ in projects" :key="project_" :to="`/i/project/`+project_" @click="projectS = !projectS" :class="`list-group-item list-group-item-action`+(project_.toLowerCase() === project.toLowerCase() ? ' active' : '')">{{ project_ }}</router-link>
  </div>
</template>

<script setup lang="ts">
import {useStore} from "@/store";
import {computed, ref} from "vue";
import {useI18n} from "vue-i18n";
const { t } = useI18n()
const store = useStore()
const project = computed(() => store.state.project)
const projects = computed(() => store.state.projects)
const projectS = ref(false)
</script>

<style scoped>

</style>

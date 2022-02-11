<template id="project-list">
  <button class="btn btn-outline-primary btn-block btn-sm mb-4" @click="projectS = !projectS">{{ project ? project : t("project_list.button.select_project") }}</button>

  <el-drawer v-model="projectS" :title="t('public.user_list')" size="100vw" append-to-body ref="elDrawer">
    <div class="container">
      <div class="col-md-8 offset-md-2">
        <template v-for="(project, s) in projects" :key="s">
          <el-button class="text-decoration-none mx-1 mb-2" round size="small" @click="setProject(project)">{{ project }}</el-button>
        </template>
        <div v-if="project && state.list.length" class="list-group my-2">
          <router-link v-for="(user, s) in state.list" :key="s" :to="`/` + user.name + `/all`" class="list-group-item list-group-item-action" @click="$refs.elDrawer.handleClose()"><b>{{ user.display_name }}</b> |
            <small>@{{ user.name }}</small> >
            <small>{{ project + " (" + user.tag + ")" }}</small>
          </router-link>
        </div>
      </div>
    </div>
  </el-drawer>

  <!--<div class="list-group my-4" v-if="projectS">
    <router-link v-for="project_ in projects" :key="project_" :to="`/i/project/`+project_" @click="projectS = !projectS" :class="`list-group-item list-group-item-action`+(project_.toLowerCase() === project.toLowerCase() ? ' active' : '')">{{ project_ }}</router-link>
  </div>-->
</template>

<script setup lang="ts">
import {useStore} from "@/store";
import {computed, reactive, Ref, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import {userListInterface} from "@/type/State";
const { t } = useI18n()
const store = useStore()
const project = computed(() => store.state.project)
const projects = computed(() => store.state.projects)
const names = computed(() => store.state.names)
const userList = computed(() => store.state.userList)
const state = reactive<{
  list: Ref<userListInterface[]>
}>({
  list: ref([])
})
const createList = () => {
  let tmpList: userListInterface[] = []
  userList.value.map((values) => {
    if (values.project === project.value && values.name) {
      tmpList.push(values);
    }
  })
  state.list = tmpList
}
createList()
watch(project, () => createList())

const setProject = (project: string) => {
  store.dispatch("setCoreValue", {key: 'project', value: project})
}
const projectS = ref(false)

</script>

<style scoped>

</style>

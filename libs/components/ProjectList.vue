<template id="project-list">
  <!--TODO fix element-->
  <button class="btn navbar-toggler" data-toggle="collapse" type="button" v-if="onNav" @click="state.projectS = !state.projectS">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="d-grid gap-2" v-else-if="!onNav && !onMain">
    <button class="btn btn-outline-primary btn-sm fw-bold fs-5 text-decoration-none d-md-block my-1" @click="state.projectS = !state.projectS">{{t("public.user_list") }}</button>
  </div>

  <div v-if="onMain" >
    <template v-for="(projectName, s) in projects" :key="s">
      <button :class="{'me-1': true, 'btn': true, 'btn-sm': true, 'btn-primary': project === projectName, 'btn-outline-dark': project !== projectName}"  @click="setProject(project === projectName ? '' : projectName)">{{ projectName }}</button>
    </template>
    <div v-if="project && state.list.length" class="list-group my-2">
      <router-link v-for="(user, s) in state.list" :key="s" :to="`/` + user.name + `/all`" class="list-group-item list-group-item-action" @click="$refs.elDrawer.handleClose()"><b>{{ user.display_name }}</b> |
        <small>@{{ user.name }}</small> >
        <small>{{ project + " (" + user.tag + ")" }}</small>
      </router-link>
    </div>
  </div>
  <el-drawer v-else v-model="state.projectS" :title="t('public.user_list')" size="100vw" append-to-body ref="elDrawer">
    <div class="container">
      <div class="col-md-8 offset-md-2">
        <template v-for="(projectName, s) in projects" :key="project">
          <button :class="{'me-1': true, 'btn': true, 'btn-sm': true, 'btn-primary': project === projectName, 'btn-outline-dark': project !== projectName}"  @click="setProject(project === projectName ? '' : projectName)">{{ projectName }}</button>
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
</template>

<script setup lang="ts">
import {useStore} from "../store";
import {computed, onMounted, reactive, Ref, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import {userListInterface} from "../types/State";
import {useRouter} from "vue-router";
const { t } = useI18n()
const router = useRouter()
const store = useStore()
const project = computed(() => store.state.project)
const projects = computed(() => store.state.projects)
const names = computed(() => store.state.names)
const userList = computed(() => store.state.userList)
const props = defineProps({
  onNav: {
    type: Boolean,
    default: false
  },
  onMain: {
    type: Boolean,
    default: false
  }
})

const state = reactive<{
  list: Ref<userListInterface[]>
  projectS: Ref<boolean>
}>({
  list: ref([]),
  projectS: ref(false)
})

const createList = () => state.list = userList.value.filter((values: userListInterface) => (values.project === project.value && values.name))

createList()
watch(project, () => createList())

const setProject = (project: string) => {
  store.dispatch("setCoreValue", {key: 'project', value: project})
}

router.beforeEach(() => {
  state.projectS = false
})
</script>

<style scoped>

</style>

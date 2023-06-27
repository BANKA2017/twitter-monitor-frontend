<script setup lang="ts">
import {onBeforeRouteUpdate, useRoute} from "vue-router";
import {useStore} from "../store";
import {computed, onMounted, reactive} from "vue";
import {Controller, request} from "../share/Fetch";
import {ApiCommunityInfo} from "../types/Api";
import {createRealMediaPath, Notice,} from "../share/Tools";
import {useI18n} from "vue-i18n";
import FullText from "./FullText.vue";

const route = useRoute()
const {t} = useI18n()
const store = useStore()
const settings = computed(() => store.state.settings)
const realMediaPath = computed(() => store.state.realMediaPath)
const samePath = computed(() => store.state.samePath)
const width = computed(() => store.state.width)
const height = computed(() => store.state.height)

const state = reactive<{
    communityInfo: ApiCommunityInfo["data"]
    loading: boolean
}>({
    communityInfo: {
        name: '',
        description: '',
        id: '0',
        member_count: 0,
        moderator_count: 0,
        default_theme: '_',
        created_at: 0,
        rules: [],
        banner: {
            url: '',
            original_height: 0,
            original_width: 0,
            media_key: '',
        }
    },
    loading: true,
})

const updateInfo = () => {
  request<ApiCommunityInfo>(settings.value.basePath + '/api/v3/data/communityinfo/?community_id=' + route.params.communityId.toString(), fetchController).then(response => {
    state.communityInfo = response.data
    state.loading = false
  }).catch(e => {
    state.loading = false
    if (fetchController.afterAbortSignal.aborted) {
      //Notice(t("public.loading"), "warning")
    } else {
      store.dispatch("setCoreValue", {key: 'userExists', value: false})
      Notice(t("timeline.message.message.not_exist", [`Community ${route.params.communityId.toString()}`]), "error")
      console.error(e)
    }
  })
}

const fetchController = new Controller()
onMounted(() => {
  if (route.params.communityId) {
    updateInfo()
  }
})

onBeforeRouteUpdate((to, from) => {
  if (to.params.communityId) {
    updateInfo()
  }
})

</script>

<template>
    <div>
        <el-skeleton :style="{'position': 'sticky', 'top': '1.5rem'}" :loading="state.loading" animated>
            <div class="card mb-4">
                <el-collapse-transition v-if="state.communityInfo.banner.url">
                    <div class="transition-height" :style="{'position': 'relative', 'aspect-ratio': !settings.displayPicture ? '3 / 1' : ''}">
                        <el-image v-if="!settings.displayPicture" :src="createRealMediaPath(realMediaPath, samePath, 'userinfo')+`/`+state.communityInfo.banner.url.replace('https://', '').replace('http://', '')" :preview-src-list="[createRealMediaPath(realMediaPath, samePath, 'userinfo')+`/`+state.communityInfo.banner.url.replace('https://', '').replace('http://', '')]" alt="Banner" style="position: absolute; max-height: 100%;  " class="card-img-top banner" fit="cover" lazy preview-teleported hide-on-click-modal/>
                    </div>
                </el-collapse-transition>
                <div style="padding: 0.15em 0.65em;" class="fw-bold fs-3">{{state.communityInfo.name}}</div>
                <div v-show="state.communityInfo.description" style="padding: 0.15em 1em;" class="">
                    <full-text :entities="[]" :full_text_origin="state.communityInfo.description" class="card-text transition-box"></full-text>
                </div>
                <small class="d-block mb-2 " style="margin-left: 0.85em;">
                    <span class="px-1"><span class="fw-bold">{{ state.communityInfo.member_count }}</span> {{ t('public.members') }}</span>
                </small>
            </div>
            <div id="rules">
                <el-divider ><h3 class="fw-bold">{{t('community.rules')}}</h3></el-divider>
                <ol class="list-group list-group-flush">
                    <li class="list-group-item" v-for="rule in state.communityInfo.rules" :key="rule.name"><span class="fw-bold d-block">{{rule.name}}</span> <span v-if="rule.description" class="d-block">{{rule.description}}</span></li>
                </ol>
            </div>
        </el-skeleton>
    </div>
</template>

<style scoped>

</style>
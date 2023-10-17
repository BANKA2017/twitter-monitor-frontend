<script setup lang="ts">
import {onBeforeRouteUpdate, useRoute} from "vue-router";
import {useStore} from "../store";
import {computed, onMounted, reactive} from "vue";
import {Controller, request} from "../share/Fetch";
import {ApiListInfo, ApiListMember} from "../types/Api";
import {createRealMediaPath, Notice, VerifiedStatus} from "../share/Tools";
import {useI18n} from "vue-i18n";
import Verified from "../icons/Verified.vue";
import Translate from "./Translate.vue";
import BlueVerifiedIcon from "../icons/BlueVerifiedIcon.vue";
import FullText from "./FullText.vue";
import {UserInfo} from "../types/Content";

const route = useRoute()
const {t} = useI18n()
const store = useStore()
const settings = computed(() => store.state.settings)
const realMediaPath = computed(() => store.state.realMediaPath)
const samePath = computed(() => store.state.samePath)
const width = computed(() => store.state.width)
const height = computed(() => store.state.height)

const verifiedStatus = computed(() => VerifiedStatus(state.listInfo.user_info?.verified))

const state = reactive<{
    listInfo: ApiListInfo["data"]
    //memberList: UserInfo[]
    memberCursor: string
    moreMember: boolean
    memberCount: number,
    loading: boolean
    //memberListLoading: boolean
    //memberListBottomLoading: boolean
}>({
    listInfo: {
        name: '',
        banner: {
            url: '',
            original_height: 0,
            original_width: 0,
            media_key: ''
        },
        description: '',
        created_at: 0,
        member_count: 0,
        subscriber_count: 0,
        id: '',
        user_info: {}
    },
    //memberList: [],
    memberCursor: '',
    moreMember: true,
    memberCount: 20,
    loading: true,
    //memberListLoading: true,
    //memberListBottomLoading: false
})

const updateInfo = () => {
  request<ApiListInfo>(settings.value.basePath + '/api/v3/data/listinfo/?list_id=' + route.params.listId.toString(), fetchController).then(response => {
    state.listInfo = response.data
    state.loading = false
    //getMemberList()
  }).catch(e => {
    state.loading = false
    if (fetchController.afterAbortSignal.aborted) {
      //Notice(t("public.loading"), "warning")
    } else {
      store.dispatch("setCoreValue", {key: 'userExists', value: false})
      Notice(t("timeline.message.message.not_exist", [`List ${route.params.listId.toString()}`]), "error")
      console.error(e)
    }
  })
}

//const getMemberList = () => {
//    state.memberListBottomLoading = true
//    //default count is 20
//    request<ApiListMember>(settings.value.basePath + '/api/v3/data/listmember/?list_id=' + route.params.listId.toString() + (state.memberCursor ? `&cursor=${state.memberCursor}` : '') + `&count=${state.memberCount}`, fetchController).then(response => {
//        state.memberList = state.memberList.concat(response.data.users)
//        state.memberCursor = response.data.cursor.bottom
//        state.memberListLoading = false
//        state.memberListBottomLoading = false
//        if (response.data.users.length < state.memberCount) {
//            state.moreMember = false
//        }
//    }).catch(e => {
//        state.memberListLoading = false
//        state.memberListBottomLoading = false
//        if (fetchController.afterAbortSignal.aborted) {
//            //Notice(t("public.loading"), "warning")
//        } else {
//            store.dispatch("setCoreValue", {key: 'userExists', value: false})
//            Notice(t("timeline.message.message.not_exist", [`List member ${route.params.listId.toString()}`]), "error")
//            console.error(e)
//        }
//    })
//}

const fetchController = new Controller()
onMounted(() => {
  if (route.params.listId) {
    updateInfo()
  }
})

onBeforeRouteUpdate((to, from) => {
  if (to.params.listId) {
    updateInfo()
  }
})

</script>

<template>
    <div>
        <el-skeleton :style="{'position': 'sticky', 'top': '1.5rem'}" :loading="state.loading" animated>
            <div class="card mb-4">
                <el-collapse-transition v-if="state.listInfo.banner.url">
                    <div class="transition-height" :style="{'position': 'relative', 'aspect-ratio': !settings.displayPicture ? '3 / 1' : ''}">
                        <el-image v-if="!settings.displayPicture" :src="createRealMediaPath(realMediaPath, samePath, 'userinfo')+`/`+state.listInfo.banner.url.replace('https://', '').replace('http://', '')" :preview-src-list="[createRealMediaPath(realMediaPath, samePath, 'userinfo')+`/`+state.listInfo.banner.url.replace('https://', '').replace('http://', '')]" alt="Banner" style="position: absolute; max-height: 100%;  " class="card-img-top banner" fit="cover" lazy preview-teleported hide-on-click-modal/>
                    </div>
                </el-collapse-transition>
                <div style="padding: 0.10em 0.85em;" class="fw-bold fs-5 text-center">{{state.listInfo.name}}</div>
                <div v-show="state.listInfo.description" style="padding: 0.15em 1em;" class=" text-center">
                    <full-text :entities="[]" :full_text_original="state.listInfo.description" class="card-text transition-box"></full-text>
                </div>
                <div style="display: flex; align-content: center; margin: 0 0.5em; justify-content: center;">
                    <div class="" style="width: 45px; aspect-ratio: 1; display: inline-block; padding: 0.5em;" v-if="!settings.displayPicture">
                        <el-image class="rounded-circle" :src="createRealMediaPath(realMediaPath, samePath, 'userinfo')+state.listInfo.user_info.header.replace(/([\w]+)\.([\w]+)$/gm, `$1_reasonably_small.$2`)" :preview-src-list="[createRealMediaPath(realMediaPath, samePath, 'userinfo')+state.listInfo.user_info.header]" alt="Avatar" preview-teleported hide-on-click-modal/>
                    </div>
                    <!--<div :class="{ 'col-8': ((width > 768 && height > 50) || state.listInfo.user_info.banner === 0), 'col-12': !((width > 768 && height > 50) || state.listInfo.user_info.banner === 0), 'my-4': (width > 768 && (height > 50 || state.listInfo.user_info.banner === 0)), 'mt-5': ((height <= 50 || width <= 768) && state.listInfo.user_info.banner !== 0), }" style=" justify-content: center;">-->
                    <div style="padding: 0.5em 0.25em; display: inline-block; align-self: center">
                        <div class="mb-1" style="display: flex; justify-content: space-between; align-self: center;"><a :href="`//twitter.com/`+state.listInfo.user_info.name" class="text-dark" target="_blank"><full-text class=" fw-bold" :entities="[]" :full_text_original="state.listInfo.user_info.display_name" :inline="true"/></a><verified v-if="verifiedStatus.verified" height="1em" :status="verifiedStatus.verified_type ? {business: 'text-gold', government: 'text-secondary'}[verifiedStatus.verified_type] : 'text-primary'" width="1em" class="m-1 d-inline"/><blue-verified-icon v-if="!verifiedStatus.verified && verifiedStatus.blue_verified" :status="verifiedStatus.verified_type ? {business: 'text-gold', government: 'text-secondary'}[verifiedStatus.verified_type] : 'text-primary'" height="1em" width="1em" class="m-1 d-inline"/></div>
                    </div>
                </div>
                <small class="text-center d-block mb-2">
                    <span class="px-1"><span class="fw-bold">{{ state.listInfo.member_count }}</span> {{ t('public.members') }}</span>
                    <span class="px-1"><span class="fw-bold">{{ state.listInfo.subscriber_count }}</span> {{ t('public.following') }}</span>
                </small>
            </div>
        </el-skeleton>
        <!--<el-skeleton class="d-none d-md-block" :loading="state.memberListLoading" animated>
            <div class="d-none d-md-block">
                <div class="list-group">
                    <router-link :to="`/${user.name}/all`" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" v-for="(user, index) in state.memberList" :key="user.uid_str">
                        <div class="d-flex w-100 align-items-center">
                            <div class="d-flex w-100 align-content-center">
                                <el-image :src="settings.mediaPath + user.header.replace(/https:\/\/|http:\/\//, '').replace(/([\w]+)\.([\w]+)$/gm, `$1_reasonably_small.$2`)" class="rounded-circle flex-shrink-0" style="height: 15%; width: 15%; aspect-ratio: 1;"></el-image>
                                <div class="ms-2" style="width: 85%;">
                                    <full-text class="d-block text-truncate fw-bold" :entities="[]" :full_text_original="user.display_name" :inline="true" />
                                    <span class="d-block">@{{ user.name }}</span>
                                    <full-text :full_text_original="user.description_original" :entities="user.description_entities" />
                                </div>
                            </div>
                        </div>
                    </router-link>
                </div>
                <el-divider class="my-3" />
                <div class="d-grid gap-2" v-if="state.moreMember && !state.memberListBottomLoading">
                    <button class="btn btn-primary btn-sm mb-3" type="button" @click="getMemberList">
                        <span>{{ t("timeline.message.load_more") }}</span>
                    </button>
                </div>

                <el-skeleton v-else-if="state.moreMember && state.memberListBottomLoading" :rows="1" animated class="mb-2"/>
                <div v-else-if="!state.moreMember">
                    <h5 class="text-center">{{ t("timeline.message.no_more") }}</h5>
                </div>
            </div>
        </el-skeleton>-->
    </div>
</template>

<style scoped>

</style>
<template>
  <el-skeleton id="online-trends" :loading="state.loading" :rows="5" animated>
    <router-link class="my-1 mx-1 p-1 h-100 rounded-2 btn btn-outline-dark border-0 text-decoration-none text-start text-md-center swap-color" :style="{width: (width >= 768 ? 'auto' : '100%')}" v-for="trendData in state.data" :key="trendData.name" :to='{path: `/search/`, query: {q: trendData.name.startsWith("#") || trendData.name.startsWith("$") ? trendData.name : `"${trendData.name}"`}}'>
      <div class="mx-1">
        <div class="fw-bold fs-5">{{trendData.name}}</div>
        <div v-if="trendData.displayedRelatedVariants">
          <template v-for="(displayedRelatedVariant, index) in trendData.displayedRelatedVariants" :key="displayedRelatedVariant">
            <span v-if="index !== 0">, </span>
            <router-link :to='{path: `/search/`, query: {q: displayedRelatedVariant.startsWith("#") || displayedRelatedVariant.startsWith("$") ? displayedRelatedVariant : `"${displayedRelatedVariant}"`}}' style="font-size: smaller;" class="mx-1 swap-color-item text-decoration-underline">{{ displayedRelatedVariant }}</router-link>
          </template>
        </div>
      </div>
      <div class="d-inline mx-1" style="font-size: small" v-if="trendData.metaDescription">{{ trendData.metaDescription }}</div>
    </router-link>
  </el-skeleton>
</template>

<script setup lang="ts">

import {computed, onMounted, reactive} from "vue";
import {request} from "@/share/Fetch";
import {ApiOnlineTrends} from "@/type/Api";
import {useStore} from "@/store";

const store = useStore()
const onlinePath = computed(() => store.state.onlinePath)
const width = computed(() => store.state.width)

const state = reactive<{
  loading: boolean
  data: ApiOnlineTrends["data"]
}>({
  loading: true,
  data: []
})

onMounted(() => {
  request<ApiOnlineTrends>(onlinePath.value + `/api/v3/data/trends`).then(response => {
    state.data = response.data
    state.loading = false
  }).catch(e => {
    console.log((e))
    state.loading = false
  })
})

</script>

<style scoped lang="scss">
@import "../assets/style.scss";
.swap-color {
  .swap-color-item {
    color: $dark;
  }
  &:hover {
    .swap-color-item {
      color: $light;
    }
  }
}
</style>
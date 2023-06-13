<template>
    <div id="tools">
        <div class="container" id="main" role="main">
            <div class="row">
                <div class="col-lg-3">
                    <div style="position: sticky; top: 1rem;" >
                        <div class="fs-2 fw-bold w-100 text-start">Twitter Monitor</div>
                        <div class="mb-3" style="padding-left: 5px"><local-router /></div>
                        <el-divider class="my-2" />
                        <div class="mb-2 text-muted"><small>NEST.MOE</small></div>
                    </div>
                </div>
                <div v-if="$route.name === 'tool-main-page'" class="col-lg-9 mt-2 row">
                    <div class="col-md-6 mb-2" v-for="item in linkList" :key="item.name">
                        <a v-if="item.link.startsWith('https://')||item.link.startsWith('http://')" :href="item.link" target="_blank" style="text-decoration: none">
                            <div class="card">
                                <div class="card-body text-black">
                                    <h2>{{ item.name }}</h2>
                                    <p >{{ item.description }}</p>
                                </div>
                            </div>
                        </a>
                        <router-link v-else :to="item.link" style="text-decoration: none">
                            <div class="card">
                                <div class="card-body text-black">
                                    <h2>{{ item.name }}</h2>
                                    <p >{{ item.description }}</p>
                                </div>
                            </div>
                        </router-link>
                    </div>
                </div>
                <div v-else class="col-lg-9 mt-2">
                    <router-view />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import LocalRouter from "../../components/LocalRouter.vue";
import {useHead} from "@vueuse/head";

useHead({
  title: '工具',
})

const linkList = [{
  link: "/i/tools/media",
  name: "媒体下载工具",
  description: "下载推文的图片或视频"
},{
  link: "/i/tools/snowflake_tool",
  name: "SnowFlake Tool",
  description: "雪花算法相关的工具"
},{
    link: "https://gamealbum.nest.moe/",
    name: "WebAlbum",
    description: "通过 NS / PS / Xbox 上传的媒体库"
},{
    link: "https://archive-viewer.nest.moe/",
    name: "Archive viewer",
    description: "查看和备份 twitter 内容"
},]
//{
//  link: "/i/tools/translator",
//  name: "烤推机",
//  description: "人工翻译工具"
//}
</script>

<style scoped>

</style>
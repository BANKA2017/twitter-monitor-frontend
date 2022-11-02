<template>
  <template v-if="$route.name === 'tool-main-page'">
    <div ref="tools">
      <navigation display-name="Twitter Monitor Online" display-type="online" class="mb-5" />
      <div class="container">
        <div class="row">
          <div class="col-md-6 mb-4" v-for="item in linkList" :key="item.name">
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
      </div>
    </div>
  </template>
  <router-view v-else />
</template>

<script setup lang="ts">
import Navigation from "@/components/Navigation.vue";

const linkList = [{
  link: "/i/tools/media",
  name: "媒体下载工具",
  description: "下载推文的图片或视频"
},{
  link: "/i/tools/snowflake_tool",
  name: "SnowFlake Tool",
  description: "雪花算法相关的工具"
},{
  link: "https://webalbum.nest.moe/",
  name: "WebAlbum",
  description: "通过 Nintendo Switch Share / PlayStation®Network 上传的媒体库"
},]
//{
//  link: "/i/tools/translator",
//  name: "烤推机",
//  description: "人工翻译工具"
//}
</script>

<style scoped>

</style>
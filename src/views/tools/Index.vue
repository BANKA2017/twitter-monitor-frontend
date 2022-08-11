<template>
  <template v-if="$route.name === 'ToolMainPage'">
    <div ref="tools">
      <navigation display-name="Twitter Monitor Online" display-type="online" class="mb-5" />
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <router-link to="/i/tools/media" style="text-decoration: none">
              <div class="card">
                <div class="card-body text-black">
                  <h2>媒体下载工具</h2>
                  <p >下载推文的图片或视频</p>
                </div>
              </div>
            </router-link>
          </div>
          <div class="col-md-6">
            <router-link to="/i/tools/snowflake_tool" style="text-decoration: none">
              <div class="card">
                <div class="card-body text-black">
                  <h2>SnowFlake Tool</h2>
                  <p >雪花算法相关的工具</p>
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
</script>

<style scoped>

</style>
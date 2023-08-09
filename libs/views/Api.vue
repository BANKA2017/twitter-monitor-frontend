<template>
    <div id="api">
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
                <div class="col-lg-9">
                    <h3 class="my-3">Twitter Monitor Api</h3>
                    <ul>
                        <li>We use CloudFlare, high frequency crawling may be blocked.</li>
                        <li>We allow packet capture to find undisclosed endpoints, but the response content of these endpoints may be unstable, and we may delete the corresponding endpoints directly.</li>
                        <li>The backend server is located in Tokyo, Japan, some copyright-affected media may not be available.</li>
                    </ul>

                    <div class="">
                        <a href="https://www.postman.com/kdwnil/workspace/open-twitter-monitor/overview" target="_blank" class="me-2"><button class="btn btn-outline-primary">Getting started with Postman</button></a>
                        <a href="https://github.com/BANKA2017/twitter-monitor-frontend/blob/v3/libs/types/Api.ts" target="_blank"><button class="btn btn-outline-success">Response type</button></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useHead} from "@vueuse/head";
import {useStore} from "../store";
import LocalRouter from "../components/LocalRouter.vue";
useHead({
    title: 'Api',
})
const store = useStore()
</script>

<style scoped>

</style>

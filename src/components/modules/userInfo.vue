<template>
    <div id="userInfo">
        <div class="my-4"/>
        <el-skeleton v-if="load" animated/>
        <div v-else>
            <div class="card">
                <template>
                    <el-image v-if="info.profile_banner_url" class="card-img-top" :src="basePath+`/api/v2/online/media/?url=` + info.profile_banner_url.substr(8)" alt="Banner" :preview-src-list="[basePath+`/api/v2/online/media/?url=` + info.profile_banner_url.substr(8)]" >
                        <div slot="placeholder" class="image-slot" >
                            <div v-loading="true" style="height: 100px" />
                        </div>
                    </el-image>
                    <div class="card-body">
                        <div class="container">
                            <div class="row">
                                <div class="col-4" style="max-height: 100px; max-width: 100px">
                                    <el-image class="rounded-circle img-fluid" :src="basePath+`/api/v2/online/media/?url=`+info.profile_image_url_https.substr(8, info.profile_image_url_https.length - 19) + info.profile_image_url_https.substr(-4)" v-if="info.profile_image_url_https" lazy :preview-src-list="[basePath+`/api/v2/online/media/?url=`+info.profile_image_url_https.substr(8, info.profile_image_url_https.length - 19) + info.profile_image_url_https.substr(-4)]">
                                        <div slot="error" class="image-slot">
                                            <i class="el-icon-user-solid"></i>
                                        </div>
                                    </el-image>
                                    <div class="my-4"></div>
                                </div>
                                <div class="col-8">
                                    <h5 class="card-title mt-0">
                                        <b>{{ info.name }}</b>
                                        <verified status="text-primary" width="1em" height="1em"  v-if="info.verified" />
                                        <locked status="text-primary" width="1em" height="1em" v-else-if="info.protect" />
                                    </h5>
                                    <p>
                                        <small>
                                            <a :href="`//twitter.com/`+info.screen_name" target="_blank" class="text-dark">@{{ info.screen_name }}</a>
                                        </small>
                                    </p>
                                </div>
                            </div>
                            <p class='card-text'>{{ info.description }}</p>
                        </div>
                    </div>
                </template>
            </div>
            <div class="my-4"/>
            <span id="followers_count"><b>{{ $t("public.followers") }}:</b> {{ info.followers_count }} </span><br>
            <span id="friends_count"><b>{{ $t("public.following") }}:</b> {{ info.friends_count }}</span><br>
            <span id="statuses_count"><b>{{ $t("public.statuses_count") }}:</b> {{ info.statuses_count }}</span><br>
        </div>
    </div>
</template>

<script>
    import axios from "axios";
    import Verified from "../icons/verified";
    import Locked from "../icons/locked";

    export default {
        name: "userInfo",
        components: {Locked, Verified},
        props: {
            screenName: String,
            debug: Boolean,
            userExist: Boolean,
            basePath: String,
            protect: Boolean,
            uid: String,
        },
        watch: {
            "screenName": function () {
                this.getUserInfo(this.screenName);
            }
        },
        data() {
            return {
                load: false,
                info: {},
            }
        },
        metaInfo () {
            return {
                title: `@` + this.screenName,
                //meta: []
            }
        },
        mounted() {
            this.getUserInfo(this.screenName);
        },
        methods: {
            notice: function (text, status) {
                this.$parent.notice(text, status);
            },
            getUserInfo: function (name) {
                this.load = true;
                this.$emit('update:userExist', true);
                axios.get(this.$root.basePath + '/api/v2/online/userinfo/?name=' + name).then(response => {
                    this.info = response.data.data;
                    if (this.info.errors) {
                        this.notice(this.info.errors[0].message + '#' + this.info.errors[0].code, "error");
                        this.$emit('update:user-exist', false);
                    } else {
                        this.notice( this.$t("userinfo.message.load_success", [this.info.name, this.info.screen_name]), "success");
                        this.$emit('update:protect', this.info.protected);
                        this.$emit('update:uid', this.info.id_str);
                    }
                    this.load = false;
                }).catch(error => {
                    this.notice(error, "error");
                    this.load = false;
                });
            },
        }
    }
</script>

<style scoped>

</style>

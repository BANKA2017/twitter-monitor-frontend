<template>
    <div class="col-md-4" id="leftCard">
        <el-skeleton v-if="load" animated/>
        <div class="card" v-else>
            <template>
                <el-image v-if="info.banner !== 0 && displayType !== 'search' && displayType !== 'tag'" :preview-src-list="[mediaPath+(mediaPath === basePath ? `/api/v2/media/userinfo/` : '')+`pbs.twimg.com/profile_banners/`+info.uid+`/`+info.banner+`.banner`]" :src="mediaPath+(mediaPath === basePath ? `/api/v2/media/userinfo/` : '')+`pbs.twimg.com/profile_banners/`+info.uid+`/`+info.banner+`.banner`" alt="Banner" class="card-img-top" ></el-image>
                <div class="card-body">
                    <h3 v-if="displayType === 'search'">搜索</h3>
                    <router-link :to="`/hashtag/`+tag.text" v-else-if="displayType === 'tag' && tag.type === 0"><h3>#{{ tag.text }}</h3></router-link>
                    <router-link :to="`/cashtag/`+tag.text" v-else-if="displayType === 'tag' && tag.type === 1"><h3>${{ tag.text }}</h3></router-link>
                    <div class="container" v-else>
                        <div class="row">
                            <div class="col-4" style="max-height: 100px; max-width: 100px">
                                <el-image v-if="info.header" :preview-src-list="[mediaPath+(mediaPath === basePath ? `/api/v2/media/userinfo/` : '')+info.header]" :src="mediaPath + (mediaPath === basePath ? `/api/v2/media/userinfo/` : '')+info.header" class="rounded-circle img-fluid" lazy>
                                    <div slot="error" class="image-slot">
                                        <i class="el-icon-user-solid"></i>
                                    </div>
                                </el-image>
                                <div class="my-4"></div>
                            </div>
                            <div class="col-8">
                                <h5 class="card-title mt-0">
                                    <b>{{ info.display_name }}</b>
                                    <verified status="text-primary" width="1em" height="1em"  v-if="info.verified" />
                                    <deleted status="text-primary" width="1em" height="1em"  v-if="info.deleted" />
                                    <locked status="text-primary" width="1em" height="1em" v-else-if="info.locked" />
                                </h5>
                                <p>
                                    <small>
                                        <a :href="`//twitter.com/`+info.name" target="_blank" class="text-dark">@{{ info.name }}</a>
                                    </small>
                                </p>
                            </div>
                        </div>
                        <div v-html="`<p class='card-text'>`+info.description+`</p>`"></div>
                        <translate :basePath="basePath" :type="1" :id="info.uid" :to="settings.data.language" />
                    </div>
                </div>
            </template>
        </div>
        <data-chart v-if="displayType === 'timeline'" :base-path="basePath" :uid="uid" :base-data="baseData" />
        <div class="my-4"></div>
    </div>
</template>

<script>
    import Verified from "../icons/verified";
    import Deleted from "../icons/deleted";
    import Locked from "../icons/locked";
    import Translate from "../modules/translate";
    import DataChart from "./dataChart";
    import axios from "axios";
    export default {
        name: "leftCard",
        components: {DataChart, Translate, Locked, Deleted, Verified},
        props: {
            basePath: String,
            name: String,
            //info: Object,
            displayType: String,
            userExist: Boolean,
            settings: Object,
            tag: Object,
            load: Boolean,
        },
        data() {
            return {
                info: {},
                baseData: {'关注者': '关注者', '正在关注': '正在关注', '总推文数': '总推文数'},
                //load: true,
                uid: '0',
            }
        },
        watch: {
            "name": function () {
                this.getUserInfo(this.name);
            },
            "info": function(){
                //バンドリ！ BanG Dream! 公式 (@bang_dream_info) / Twitter
                this.changeTitle(this.info.display_name ? this.info.display_name + ' (@' + this.info.name + ') / Twitter Monitor' : "Twitter Monitor");
                this.uid = this.info.uid;
                //this.display_name = this.info.display_name;
            },
        },
        mounted() {
            if (this.displayType === 'timeline') {
                this.getUserInfo(this.name);
            }
        },
        methods: {
            notice: function (text, status) {
                this.$parent.notice(text, status);
            },
            changeTitle: function (text) {
                this.$parent.changeTitle(text)
            },
            getUserInfo: function (name) {
                this.$emit('update:load', true);
                axios.get(this.$root.basePath + '/api/v2/data/userinfo/?name=' + name).then(response => {
                    this.info = response.data.data;
                    if (response.data.code === 200) {
                        this.baseData = {'关注者': '关注者 ' + this.info.followers, '正在关注': '正在关注 ' + this.info.following, '总推文数': '总推文数 ' + this.info.statuses_count};
                    } else {
                        this.notice(response.data.message, "error");
                        this.baseData = {'关注者': '关注者', '正在关注': '正在关注', '总推文数': '总推文数'};
                        this.$emit('update:userExist', false);
                    }
                    this.$emit('update:load', false);
                }).catch(error => {
                    this.notice(error, "error");
                    //this.load = false;
                });
            },
        }
    }
</script>

<style scoped>

</style>

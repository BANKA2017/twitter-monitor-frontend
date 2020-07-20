<template>
    <div id="userSelector">
        <div style="min-height: calc(100vh - 25px);">
            <div class="jumbotron jumbotron-fluid">
                <div class="container">
                    <h1 class="display-4">Twitter Monitor</h1>
                </div>
            </div>
            <div class="container">
                <div class="col-md-8 offset-md-2">
                    <search display-type="userSelector" name=""/>
                    <div class="list-group" v-if="$root.project && $root.names[$root.project] && !$root.home">
                        <router-link :key="s" :to="`/i/project/`+user.project+`/`+user.name+`/all`"
                                     class="list-group-item list-group-item-action"
                                     v-for="(user, s) in userWithProjectList"><b>{{ user.display_name }}</b> | <small>@{{
                            user.name }}</small> > <small>{{ $root.project + ' (' + user.tag + ')' }}</small>
                        </router-link>
                    </div>
                    <div class="my-4"></div>
                    <template v-for="(project, s) in $root.projects">
                        <router-link :to="`/i/project/`+project" :key="s">
                            <el-button size="mini" class="text-decoration-none" round>{{ project }}</el-button>
                        </router-link>
                    </template>
                    <div class="my-4"></div>
                </div>
            </div>
        </div>
        <div class="text-center" style="height: 30px">
            >_ KDNETWORK
        </div>
    </div>
</template>

<script>
    import Search from "../modules/search";
    import axios from "axios";
    export default {
        name: "userSelector",
        components: {Search},
        computed: {
            userList: function () {
                let users = [];
                Object.keys(this.$root.names).forEach(value1 => {
                    Object.keys(this.$root.names[value1]).forEach(value2 => {
                        Object.keys(this.$root.names[value1][value2]).forEach(value3 => {
                            users.push({
                                name: this.$root.names[value1][value2][value3]["name"],
                                display_name: this.$root.names[value1][value2][value3]["display_name"],
                                project: value1,
                                tag: value2
                            });
                        })
                    })
                });
                return users;
            },
            userWithProjectList: function () {
                let list = [];
                this.userList.forEach(values => {
                    if (values.project === this.$root.project && values.name) {
                        list.push(values);
                    }
                });
                return list;
            },
        },
        watch: {
            "$route.path": {
                handler: function () {
                    //this.tweetStatus.userExist = true;
                    this.scrollToTop();
                    //this.is_project = this.$route.path.substr(3, 7);//提前处理
                    this.routeCase();
                },
                deep: true,
            },
        },
        mounted: function () {
            this.routeCase();
            //check $route
            if (this.$root.names.length === 0) {
                let startTime = Date.now();
                axios.all([this.getAccountList(), this.getLanguageList()]).then(axios.spread((accountList, languageList) => {
                    this.$root.languageList = languageList.data;
                    this.$root.names = accountList.data.account_info;
                    this.$root.projects = accountList.data.projects;
                    this.$root.links = accountList.data.links;
                    //处理网速
                    if (Date.now() - startTime > 3000) {
                        this.$root.settings.data.displayPicture = true;
                        this.notice('当前网速较慢，已关闭图片显示', 'warning');
                    }
                })).catch(error => {
                    this.notice(error, 'error');
                });
            }

        },
        methods: {
            getAccountList: function () {
                return axios.get(this.basePath + (process.env.NODE_ENV !== "development" ? "/account_info_t.json" : "/proxy.php?filename=account_info_t"));
            },
            getLanguageList: function () {
                return axios.get(this.basePath + (process.env.NODE_ENV !== "development" ? "/language_target.json" : "/proxy.php?filename=language_target"));
            },
            routeCase: function () {
                //project
                if (this.$route.params.project) {
                    this.$root.home = false
                    this.$root.project = this.$route.params.project;
                    if (this.$route.params.name) {
                        this.lock = false;
                        this.$router.replace({path: '/' + this.$route.params.name + (this.$route.params.status ? ('/status/' + this.$route.params.status + '/') : (this.$route.params.display ? ('/' + this.$route.params.display + '/') : '/all/'))});
                    } else {
                        document.title = this.$root.project + ' / Twitter Monitor';
                        //this.tweetStatus.displayType = 'userSelector';
                        //this.lock = false;
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>

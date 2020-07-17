<template>
    <div id="online">
        <!--nav bar-->
        <nav class="navbar navbar-light bg-light">
            <span class="navbar-brand mb-0 h1">Twitter Monitor Online</span>
        </nav>
        <div class="container">
            <div class="row">
                <div v-if="screenName === ''" class="col-md-10">
                    <div class="my-4" />
                    <h3 class="display-1 text-center">TMOL</h3>
                    <div class="my-4" />
                    <el-input placeholder="用户名" v-model="input" @change="inputChange" clearable>
                        <template slot="prepend">@</template>
                    </el-input>
                </div>
                <div v-else-if="!userExist && screenName !== ''" class="col-md-10">
                    <div class="my-4" />
                    <h5 class="text-center">@{{ screenName }} 不存在</h5>
                    <div class="my-4" />
                    <el-input placeholder="用户名" v-model="input" @change="inputChange" clearable>
                        <template slot="prepend">@</template>
                    </el-input>
                </div>
                <template v-else>
                    <div class="col-md-4">
                        <user-info :debug="debug" :user-exist.sync="userExist" :screen-name="screenName" :base-path="basePath" :uid="uid" :protect="protect" @update:protect="updateProtect" @update:user-exist="updateUserExist"  @update:uid="updateUid" />
                    </div>
                    <div class="col-md-6">
                        <div class="my-4" />
                        <el-input placeholder="用户名" v-model="input" @change="inputChange" clearable>
                            <template slot="prepend">@</template>
                        </el-input>
                        <div class="my-4" />
                        <template v-if="protect">
                            <div class="card card-border border-info" id="alertMsg">
                                <div class='card-body'>
                                    <b>这些推文受到保护</b><br>
                                    只有经过批准的关注者才可查看 @{{ screenName }} 的推文。若要申请访问，请前往Twitter。
                                </div>
                            </div>
                            <hr class="my-4">
                        </template>
                        <el-skeleton active :title="false" :paragraph="{rows: 4}" v-else-if="uid === '0'" />
                        <time-line v-else :uid="uid" :base-path="basePath" :display-type="displayType" />
                    </div>
                </template>
                <div class="col-md-2">
                    <div class="my-4"></div>
                    >_ Twitter Monitor
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import UserInfo from "../modules/userInfo";
    import TimeLine from "../modules/timeLine";
    export default {
        name: "online",
        components: {TimeLine, UserInfo},
        data() {
            return {
                //独立运营
                basePath: process.env.NODE_ENV !== "development" ? "https://bangdream.fun/twitter" : "https://bangdream.fun/dev/tmv2",
                displayType: "no_reply",//with_reply
                screenName: "bang_dream_gbp",
                input: this.screenName,
                debug: false,
                userExist: true,
                firstLoad: false,
                protect: false,
                uid: '0',
            }
        },
        methods: {
            notice: function (text, status) {
                this.$parent.notice(text, status);
            },
            updateProtect: function (val) {
                this.protect = val;
            },
            updateUserExist: function (val) {
                this.userExist = val;
            },
            updateUid: function (val) {
                this.uid = val;
            },
            inputChange: function () {
                this.userExist = true;
                this.uid = '0';
                this.screenName = this.input;
            }
        }
    }
</script>

<style scoped>

</style>

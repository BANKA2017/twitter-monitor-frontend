<template>
    <div class="api">
        <div class="jumbotron jumbotron-fluid" style="background-color: #1da1f2">
            <div class="container">
                <h1 class="display-4" style="color: white">API</h1>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <h3>说在前面</h3>
                    <ul>
                        <li>API仅供参考，由于内部版本更新很快，有很多的功能不能及时更新，还请见谅</li>
                        <li>短时间需要大量请求请联系站长设置IP白名单，否则可能会遇到CloudFlare的 5秒盾/人机验证</li>
                        <li>如果只是为了爬本站的数据（尤其是要爬全部数据），请联系站长导出数据库而不是爬半天还得防反爬</li>
                        <li>以下所有api仅限于本站已开放的功能</li>
                    </ul>
                    <hr class="my-4">
                    <template v-for="(doc,index) in docs">
                        <div :key="index">
                            <h3>{{ doc.title }}</h3>
                            <p v-if="doc.description">{{ doc.description }}</p>
                            <b>Request</b>
                            <ul>
                                <li>Method: <b>{{ doc.method }}</b></li>
                                <li>Url: <a :href="doc.url" target="_blank">{{ doc.url }}</a></li>
                            </ul>
                            <div class="table-responsive">
                                <table class="table">
                                    <thead>
                                    <tr>
                                        <th scope="col">参数名</th>
                                        <th scope="col">是否必须</th>
                                        <th scope="col">默认值</th>
                                        <th scope="col">例子</th>
                                        <th scope="col">备注</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="table in doc.parameter.request" :key="table.name">
                                        <td>{{ table.name }}</td>
                                        <td>{{ table.required ? '是' : '否' }}</td>
                                        <td>{{ table.defaultValue }}</td>
                                        <td>{{ table.example }}</td>
                                        <td>{{ table.description }}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <hr class="my-4" :key="index">
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "api",
        data() {
            return {
            //docs: [{
            //    title: "帐号信息",
            //    description: "获得帐号的基本信息",
            //    url: this.basePath + '/data/userinfo/',
            //    method: "GET",
            //    format: "JSON",
            //    parameter: {
            //        request: [{
            //            name: "uid",
            //            required: true,
            //            defaultValue: "",
            //            example: "3009772568",
            //            description: "两者二选其一，uid优先于name"
            //        },{
            //            name: "name",
            //            required: true,
            //            defaultValue: "",
            //            example: "bang_dream_info",
            //            description: "两者二选其一，uid优先于name"
            //        }],
            //        response: [

            //        ]
            //    },
            //    example: {
            //        request: this.basePath + '/data/userinfo/?uid=3009772568',
            //        response: '{"code":200,"message":"OK","data":{"uid":"3009772568","name":"bang_dream_info","display_name":"バンドリ！ BanG Dream! 公式","header":"\\/pbs.twimg.com\\/profile_images\\/1253564760978681856\\/jzIKkJJS.jpg","banner":"1587708104","following":"94","followers":"614802","description":"キャラクター×リアルライブがリンクする次世代ガールズバンドプロジェクト「バンドリ！」公式ツイッターです。 #バンドリ ｜ミニアニメ「BanG Dream! ガルパ☆ピコ ～大盛り～」2020年5月7日(木)放送開始！","statuses_count":"12464","top":"1253331182344744961","locked":0,"deleted":0,"verified":1},"query":"mode=data&type=userinfo&name=bang_dream_info","version":"v2"}',
            //    }
            //}]
            }
        }
    }
</script>

<style scoped>

</style>

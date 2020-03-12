<template>
    <div id="translate">
        <!--translate-->
        <div v-if="status === 0" class='card-text'>
            <span style="cursor:pointer" class="text-decoration-none"><small style="color:#1DA1F2" @click="translate(id, type)">{{ whatToTranslate }}</small></span>
        </div>
        <div v-else-if="status === 1" class="spinner-grow spinner-grow-sm" role="status" style="color:#1DA1F2">
            <span class="sr-only">Loading...</span>
        </div>
        <div v-else>
            <hr class="my-4">
            <p class='card-text'><small class="text-muted">由 {{ translate_source }} 翻译</small></p>
            <p class='card-text' v-if="text" style="white-space: pre-line"> {{ text }}</p>
            <span style="cursor:pointer" class="text-decoration-none"><small style="color:#1DA1F2" @click="translate(id, type)">重新翻译</small></span>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "translate",
        props: {
            basePath: String,
            type: Number,
            id: String,//tweet_id or uid
            to: String,
        },
        data() {
            return {
                status: 0,
                text: "",
                translate_source: "",
            }
        },
        computed: {
            whatToTranslate: function () {
                switch (this.type) {
                    case 1:
                        return '翻译简介';
                    default:
                        return '翻译推文';
                }
            }
        },
        methods: {
            notice: function (text, status) {
                this.$parent.notice(text, status);
            },
            translate: function (id = 0, type = 0) {
                //type为0即推文, 为1即用户信息
                this.status = 1;
                if (type === 0) {
                    axios.get(this.basePath + '/api/v2/data/translate/?tr_type=tweets&tweet_id=' + id + '&to=' + this.to).then(response => {
                        this.text = response.data.data.translate;
                        this.translate_source = response.data.data.translate_source;
                        this.status = 2;
                    }).catch(error => {
                        this.notice(error, "error");
                        this.status = 0;
                    })
                } else if (type === 1) {
                    axios.get(this.basePath + '/api/v2/data/translate/?tr_type=profile&uid=' + id + '&to=' + this.to).then(response => {
                        this.text = response.data.data.translate;
                        this.translate_source = response.data.data.translate_source;
                        this.status = 2;
                    }).catch(error => {
                        this.notice(error, "error");
                        this.status = 0;
                    })
                } else {
                    this.notice("无输入", "error");
                }
            },
        }
    }
</script>

<style scoped>

</style>

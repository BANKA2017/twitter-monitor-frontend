<template>
    <div id="twPolls">
        <div class="my-4"></div>
        <div class="container text-decoration-none" :id="tweet_id+`_poll`">
            <div class="row no-gutters">
                <div class="card mx-auto" v-if="media.length">
                    <div class="row no-gutters">
                        <el-image class="col-12 card-img-top" :src="basePath+`/api/v2/media/tweets/`+media[0].url+''" lazy style="height: 300px" fit="cover" :preview-src-list="[basePath+`/api/v2/media/tweets/`+media[0].url+'']" :alt="pollImage"></el-image>
                    </div>
                </div>
                <div v-if="this.etaSeconds <= 0 && this.polls[0].checked === '1'" class="col-12">
                    <el-progress :percentage="Math.ceil((poll.count/pollCount)*100)" v-for="poll in polls" :format="() => poll.choice_label+' (' + Math.ceil((poll.count/pollCount)*100) + '%)'" :key="poll.poll_order"></el-progress>
                </div>
                <template v-else>
                    <el-button round class="btn-block mx-auto" v-for="poll in polls" :key="poll.poll_order">{{ poll.choice_label }}</el-button>
                </template>
                <div class="col-12"><small class="text-muted">{{ eta }}</small></div>
                <div class="my-4"></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "twPolls",
        props: {
            polls: Array,
            basePath: String,
            tweet_id: Number,
            language: String,
            media: Array,
        },
        computed: {
            pollCount: function () {
                let count = 0;
                this.polls.forEach(poll => {
                    count += parseInt(poll.count);
                });
                return count;
            },
            etaSeconds: function () {
                //对比当前时间
                return (parseInt(this.polls[0].end_datetime) * 1000 - new Date())/1000;
            },
            eta: function () {
                if (this.etaSeconds <= 0) {
                    return this.pollCount + ' 次投票 · 最终结果';
                } else if (this.etaSeconds < 60) {
                    return this.pollCount + ' 次投票 · 剩下' + Math.ceil(this.etaSeconds) + '秒';
                } else if (this.etaSeconds < 3600) {
                    return this.pollCount + ' 次投票 · 剩下' + Math.ceil(this.etaSeconds/60) + '分钟';
                } else if (this.etaSeconds < 86400) {
                    return this.pollCount + ' 次投票 · 剩下' + Math.ceil(this.etaSeconds/3600) + '小时';
                } else {
                    return this.pollCount + ' 次投票 · 剩下' + Math.ceil(this.etaSeconds/86400) + '天';
                }
            }
        }
    }
</script>

<style scoped>

</style>

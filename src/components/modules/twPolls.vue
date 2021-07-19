<template>
    <div id="twPolls">
        <div class="my-4"></div>
        <div class="container text-decoration-none" :id="tweet_id+`_poll`">
            <div class="row no-gutters">
                <div class="card mx-auto" v-if="media.length">
                    <div class="row no-gutters">
                        <el-image :alt="pollImage" :preview-src-list="[mediaPath+(mediaPath === basePath ? `/api/v2/media/tweets/` : '')+media[0].url+'']" :src="mediaPath+(mediaPath === basePath ? `/api/v2/media/tweets/` : '')+media[0].url+''" class="col-12 card-img-top" fit="cover" lazy style="height: 300px"></el-image>
                    </div>
                </div>
                <div v-if="etaSeconds <= 0 && polls[0].checked === 1" class="col-12">
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
            tweet_id: [String, Number],
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
                return (parseInt(this.polls[0].end_datetime) * 1000 - this.$root.now) / 1000;
            },
            eta: function () {
                if (this.etaSeconds <= 0 && this.polls[0].checked === 1) {
                    return this.$tc("polls.vote", this.pollCount > 1 ? 2 : 1, [this.pollCount]) + ' · ' + this.$t("polls.final_results");
                } else if (this.etaSeconds <= 0) {
                    return this.$tc("polls.vote", this.pollCount > 1 ? 2 : 1, [this.pollCount]) + ' · ' + this.$t("polls.wait_for_sync");
                }

                //TODO 能不能压缩一下?
                else if (this.etaSeconds < 60) {
                    return this.$tc("polls.vote", this.pollCount > 1 ? 2 : 1, [this.pollCount]) + ' · ' + this.$t("polls.eta", [this.$tc("public.time.second", Math.ceil(this.etaSeconds) === 1 ? 1 : 2)])
                } else if (this.etaSeconds < 3600) {
                    return this.$tc("polls.vote", this.pollCount > 1 ? 2 : 1, [this.pollCount]) + ' · ' + this.$t("polls.eta", [this.$tc("public.time.minute", Math.ceil(this.etaSeconds/60) === 1 ? 1 : 2)])
                } else if (this.etaSeconds < 86400) {
                    return this.$tc("polls.vote", this.pollCount > 1 ? 2 : 1, [this.pollCount]) + ' · ' + this.$t("polls.eta", [this.$tc("public.time.hour", Math.ceil(this.etaSeconds/3600) === 1 ? 1 : 2)])
                } else {
                    return this.$tc("polls.vote", this.pollCount > 1 ? 2 : 1, [this.pollCount]) + ' · ' + this.$t("polls.eta", [this.$tc("public.time.day", Math.ceil(this.etaSeconds/86400) === 1 ? 1 : 2)])
                }
            }
        }
    }
</script>

<style scoped>

</style>

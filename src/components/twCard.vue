<template>
    <div id="twCard">
        <a class="container text-decoration-none" :href="tweet.cardObject.url" target="_blank">
            <div class="card mb-3">
                <template v-if="tweet.card === 'summary'">
                    <div class="row no-gutters">
                        <div class="col-4">
                            <el-image v-if="tweet.cardObject.media === '1'" class="card-img" :src="`//`+tweet.mediaObject.cardMedia[0].cover" alt="cardImage" lazy ></el-image>
                        </div>
                        <div class="col-8">
                            <div class="card-body">
                                <p class="card-title" style="color: black">{{ tweet.cardObject.title }}</p>
                                <template v-if="tweet.cardObject.description !== ''"><small class="text-muted">{{ tweet.cardObject.description }}</small><br></template>
                                <small class="text-muted" v-if="tweet.cardObject.vanity_url !== ''"><i class="el-icon-link"></i>{{ tweet.cardObject.vanity_url }}</small>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <el-image v-if="tweet.cardObject.media === '1'" class="card-img-top" :src="`//`+tweet.mediaObject.cardMedia[0].cover" alt="cardImage" lazy></el-image>
                    <div class="card-body position-static">
                        <p class="card-title" style="color: black">{{ tweet.cardObject.title }}</p>
                        <template v-if="tweet.cardObject.description !== ''"><small class="text-muted">{{ tweet.cardObject.description }}</small><br></template>
                        <small class="text-muted" v-if="tweet.cardObject.vanity_url !== ''"><i class="el-icon-link"></i>{{ tweet.cardObject.vanity_url }}</small>
                    </div>
                </template>

            </div>
        </a>
    </div>
</template>

<script>
    export default {
        name: "twCard"
    }
</script>

<style scoped>

</style>

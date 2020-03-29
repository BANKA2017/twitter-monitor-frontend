<template>
    <div id="twCard">
        <div class="card mb-3" style="border-radius: 14px 14px 14px 14px">
            <a class="text-decoration-none" :href="object.url" target="_blank">
                <template v-if="object.type === 'summary' || object.type === 'audio' || object.type === 'app' || object.type === 'moment'">
                    <div class="row no-gutters">
                        <el-image v-if="object.media === '1' && mediaState" class="col-4 card-img" fit="cover" :src="basePath+`/api/v2/media/tweets/`+media[0].cover" alt="cardImage" lazy></el-image>
                        <div class="col-8">
                            <div class="card-body">
                                <div class="row no-gutters">
                                    <p class="col-12 text-truncate card-title" style="color: black">{{ object.title }}</p>
                                    <template v-if="object.description !== ''"><small class="text-muted text-truncate col-12">{{ object.description }}</small><br></template>
                                    <small class="text-muted col-12" v-if="object.vanity_url !== ''"><i class="el-icon-link"></i>{{ object.vanity_url }}</small>
                                </div>
                                </div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="row no-gutters">
                        <el-image v-if="object.media === '1' && mediaState" class="card-img-top col-12" style="height: 250px; border-radius: 14px 14px 0 0" fit="cover" :src="basePath+`/api/v2/media/tweets/`+media[0].cover" alt="cardImage" lazy></el-image>
                    </div>
                    <div class="card-body position-static">
                        <p class="card-title" style="color: black">{{ object.title }}</p>
                        <template v-if="object.description !== ''"><small class="text-muted">{{ object.description }}</small><br></template>
                        <small class="text-muted" v-if="object.vanity_url !== ''"><i class="el-icon-link"></i>{{ object.vanity_url }}</small>
                    </div>
                </template>
            </a>
        </div>
    </div>
</template>

<script>
    export default {
        name: "twCard",
        props: {
            object: Object,
            media: Array,
            mediaState: Boolean,
            basePath: String
        },
    }
</script>

<style scoped>

</style>

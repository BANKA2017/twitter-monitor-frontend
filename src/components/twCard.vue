<template>
    <div id="twCard">
        <div class="card mb-3">
            <a class="text-decoration-none" :href="object.url" target="_blank">
                <template v-if="object.type === 'summary' || object.type === 'audio' || object.type === 'app' || object.type === 'moment'">
                    <div class="container-fluid">
                        <div class="row no-gutters">
                            <div class="col-4">
                                <el-image v-if="object.media === '1' && mediaState" class="card-img" :src="basePath+`/api/v2/media/tweets/`+media[0].cover" alt="cardImage" lazy>
                                    <div slot="error" class="image-slot">
                                        <div style="height: 100px" v-loading="true" element-loading-background="rgba(0, 0, 0, 0)" />
                                    </div>
                                    <div slot="placeholder" class="image-slot" >
                                        <div style="height: 100px" v-loading="true" element-loading-background="rgba(0, 0, 0, 0)" />
                                    </div>
                                </el-image>
                            </div>
                            <div class="col-8">
                                <div class="card-body">
                                    <p class="card-title" style="color: black">{{ object.title }}</p>
                                    <template v-if="object.description !== ''"><small class="text-muted">{{ object.description }}</small><br></template>
                                    <small class="text-muted" v-if="object.vanity_url !== ''"><i class="el-icon-link"></i>{{ object.vanity_url }}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <el-image v-if="object.media === '1' && mediaState" class="card-img-top" :src="basePath+`/api/v2/media/tweets/`+media[0].cover" alt="cardImage" lazy>
                        <div slot="error" class="image-slot">
                            <div style="height: 300px" v-loading="true" element-loading-background="rgba(0, 0, 0, 0)" />
                        </div>
                        <div slot="placeholder" class="image-slot" >
                            <div style="height: 300px" v-loading="true" element-loading-background="rgba(0, 0, 0, 0)" />
                        </div>
                    </el-image>
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

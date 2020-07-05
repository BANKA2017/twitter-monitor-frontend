<template>
    <div id="twCard">
        <div class="card mb-3" style="border-radius: 14px 14px 14px 14px">
            <div>
                <a class="stretched-link text-decoration-none" v-if="object.url.length" :href="object.url" target="_blank"></a>
                <template v-if="object.type === 'summary' || object.type === 'audio' || object.type === 'app' || object.type === 'moment'">
                    <div class="row no-gutters">
                        <el-image v-if="object.media === '1' && mediaState" class="col-4 card-img border-right" style="border-radius: 14px 0 0 14px" fit="cover" :src="basePath+`/api/v2/media/tweets/`+media[0].cover" alt="cardImage" lazy :preview-src-list="[basePath+`/api/v2/media/tweets/`+media[0].cover]"></el-image>
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
                    <div class="border-bottom" v-if="object.media === '1' && mediaState">
                        <div class="no-gutters" :style="`width: 100%; padding-bottom: ` +  paddingBottom(media[0].origin_info_height, media[0].origin_info_width, media[0].cover) +  `%; height: 0; border-radius: 14px 14px 0 0`">
                            <el-image class="card-img-top" style="width: 100%; position: absolute; border-radius: 14px 14px 0 0" fit="cover" :src="basePath+`/api/v2/media/tweets/`+media[0].cover" alt="cardImage" lazy :preview-src-list="[basePath+`/api/v2/media/tweets/`+media[0].cover]"></el-image>
                        </div>
                    </div>
                    <div class="card-body position-static">
                        <p class="card-title" style="color: black">{{ object.title }}</p>
                        <template v-if="object.description !== ''"><small class="text-muted">{{ object.description }}</small><br></template>
                        <small class="text-muted" v-if="object.vanity_url.length"><i class="el-icon-link"></i>{{ object.vanity_url }}</small>
                    </div>
                </template>
            </div>
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
        },
        methods: {
            paddingBottom: function (height, width, link) {
                let getScale = /name=([0-9]+)x([0-9]+)/.exec(link);
                if (getScale) {
                    return (getScale[2] / getScale[1]) * 100;
                } else {
                    return (height / width) * 100;
                }
            }
        }
    }
</script>

<style scoped>

</style>

<template>
    <div id="twCard">
        <div class="card mb-3" style="border-radius: 14px 14px 14px 14px">
            <div>
                <a class="stretched-link text-decoration-none" v-if="object.url.length" :href="object.url" target="_blank"></a>
                <template v-if="object.type === 'summary' || object.type === 'audio' || object.type === 'app' || object.type === 'moment'">
                    <div class="row no-gutters">
                        <el-image v-if="object.media === '1' && mediaState" class="col-4 card-img border-right" style="border-radius: 14px 0 0 14px" fit="cover" :src="basePath+`/api/v2/media/tweets/`+latestMedia.cover" alt="cardImage" lazy :preview-src-list="[basePath+`/api/v2/media/tweets/`+latestMedia.cover]"></el-image>
                      <div class="col-8">
                        <div class="card-body">
                          <div class="row no-gutters">
                            <p class="col-12 text-truncate card-title" style="color: black">{{ object.title }}</p>
                            <template v-if="object.description !== ''"><small
                                class="text-muted text-truncate col-12">{{ object.description }}</small><br></template>
                            <small class="text-muted col-12" v-if="object.vanity_url !== ''"><i
                                class="el-icon-link"></i>{{ object.vanity_url }}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                </template>
              <template
                  v-else-if="object.type === 'unified_card' && object.secondly_type !== 'image_app' && object.secondly_type !== 'image_website' && object.secondly_type !== 'video_website'">
                <!-- 这是麻烦的类型 -->
                <!-- 我真是怕了你了 -->
                <span class="text-center">不支持的卡片类型</span>

              </template>
              <template v-else>
                <div class="border-bottom" v-if="object.media === '1' && mediaState">
                  <div
                      :style="`width: 100%; padding-bottom: ` +  paddingBottom( latestMedia.cover, latestMedia.origin_info_height, latestMedia.origin_info_width) +  `%; height: 0; border-radius: 14px 14px 0 0`"
                      class="no-gutters">
                    <el-image :preview-src-list="[basePath+`/api/v2/media/tweets/`+latestMedia.cover]"
                              :src="basePath+`/api/v2/media/tweets/`+latestMedia.cover" alt="cardImage"
                              class="card-img-top" fit="cover" lazy
                                  style="width: 100%; position: absolute; border-radius: 14px 14px 0 0"
                                  @load="load = true"></el-image>
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
      data() {
        return {
          load: false,
        }
      },
      computed: {
        latestMedia: function () {
          if (this.media.length) {
            return this.media[this.media.length - 1];
          } else {
            return []
          }

        }
      },
        methods: {
          paddingBottom: function (link, height, width) {
            if (this.load) {
              let img = new Image();
              img.src = this.basePath + `/api/v2/media/tweets/` + link;
              return (img.height / img.width) * 100
            } else {
              let getScale = /name=([0-9]+)x([0-9]+)/.exec(link);
              if (getScale) {
                return (getScale[2] / getScale[1]) * 100;
              } else {
                return (height / width) * 100;
              }
            }

          },
        }
    }
</script>

<style scoped>

</style>

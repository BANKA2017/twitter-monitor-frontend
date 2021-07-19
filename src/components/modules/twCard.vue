<template>
    <div id="twCard">
        <div class="card mb-3" style="border-radius: 14px 14px 14px 14px">
            <div>
                <a v-if="object.url.length && object.type !== 'unified_card'" :href="(object.type === 'audiospace' ? 'https://twitter.com/i/spaces/' : '') + object.url" class="stretched-link text-decoration-none" target="_blank"></a>
                <template v-if="object.type === 'summary' || object.type === 'audio' || object.type === 'app' || object.type === 'moment'">
                    <div class="row no-gutters">
                        <el-image v-if="object.media === 1 && mediaState" :preview-src-list="[mediaPath+(mediaPath === basePath ? `/api/v2/media/tweets/` : '')+latestMedia.cover]" :src="mediaPath+(mediaPath === basePath ? `/api/v2/media/tweets/` : '')+latestMedia.cover" alt="cardImage" class="col-4 card-img border-right" fit="cover" lazy style="border-radius: 14px 0 0 14px"></el-image>
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
              <template v-else-if="object.type === 'audiospace'">
                <div style="border-radius: 14px 14px 14px 14px; background-image: linear-gradient(61.63deg, rgb(45, 66, 255) -15.05%, rgb(156, 99, 250) 104.96%);">
                  <div class="card-body">
                    <p style="color: #ffffff">{{ userName }} · audiospace · <box-arrow-up-right height="1em" width="1em"/></p>
                    <span style="color: #ffffff; font-weight: 500; font-size: 1.2rem">{{ tweetText }}</span>
                  </div>
                </div>
              </template>
              <template v-else-if="object.type === 'unified_card'">
                <template v-if="object.secondly_type === 'image_website' || object.secondly_type === 'image_app'" >
                  <div v-if="mediaState"
                       :style="`width: 100%; padding-bottom: ` +  paddingBottom( latestMedia.cover, latestMedia.origin_info_height, latestMedia.origin_info_width) +  `%; height: 0; border-radius: 14px 14px 0 0`"
                       class="no-gutters">
                    <el-image :preview-src-list="[mediaPath+(mediaPath === basePath ? `/api/v2/media/tweets/` : '')+latestMedia.cover]"
                              :src="mediaPath+(mediaPath === basePath ? `/api/v2/media/tweets/` : '')+latestMedia.cover" alt="cardImage"
                              class="card-img-top" fit="cover" lazy
                              style="width: 100%; position: absolute; border-radius: 14px 14px 0 0"
                              @load="load = true"></el-image>

                  </div>
                </template>
                <template v-else-if="object.secondly_type === 'video_website' || object.secondly_type === 'video_app'" >
                  <div v-if="mediaState" :class="`no-gutters embed-responsive embed-responsive-` + (ratio < 16 / 9 ? (ratio < 4 / 3 ? '1by1' : '4by3') :ratio > 16 / 9 ? '21by9' : '16by9')">
                    <video id="videoPlayer"
                         :poster="mediaPath+(mediaPath === basePath ? `/api/v2/media/tweets/` : '') +media[0].cover"
                         :src="mediaPath+(mediaPath === basePath ? `/api/v2/media/tweets/` : '') +media[0].url" :type="media[0].content_type" class="border" controls loop playsinline
                         preload="none"
                         style="width: 100%; height: 100%; border-radius: 14px 14px 0 0; background-color: black"></video>
                  </div>
                </template>
                <div v-else-if="object.secondly_type === 'image_carousel_website' || object.secondly_type === 'image_carousel_app' || object.secondly_type === 'video_carousel_website'">
                  <el-carousel v-if="mediaState" :style="`border-radius: 14px 14px 0 0`" class="card-img-top"
                               indicator-position="outside" trigger="click">
                    <el-carousel-item v-for="(mediaInfo, key) in media" :key="key" :name="key.toString()">
                      <el-image :preview-src-list="[mediaPath+(mediaPath === basePath ? `/api/v2/media/tweets/` : '')+mediaInfo.cover]"
                                :src="mediaPath+(mediaPath === basePath ? `/api/v2/media/tweets/` : '')+mediaInfo.url" alt="cardImage"
                                class="card-img-top" fit="cover" lazy
                                @load="load = true"></el-image>
                    </el-carousel-item>
                  </el-carousel>
                </div>

                <span v-else class="text-center">{{ $t("tw_card.text.not_supported_type") }}</span>
                <div class="card-body position-relative">
                  <a v-if="object.url.length && !object.app" :href="object.url" class="stretched-link text-decoration-none" target="_blank"></a>
                  <p class="card-title" style="color: black">{{ object.title }}</p>
                  <template v-if="object.description !== ''"><small class="text-muted">{{ object.description }}</small><br></template>
                  <div v-if="object.app" class="mx-auto mt-2" >
                    <a v-for="app in object.app" :key="app.type" :href="app.type === 'android_app' ? 'https://play.google.com/store/apps/details?id=' + app.appid : 'https://apps.apple.com/' + app.country_code.toLowerCase() + '/app/id' + app.appid" class="text-decoration-none" target="_blank">
                      <el-button class="mx-1 mb-1" plain round size="small" type="primary">{{ device[app.type] }}</el-button>
                    </a>
                  </div>
                  <small v-else-if="object.vanity_url.length" class="text-muted"><i class="el-icon-link"></i>{{ object.vanity_url }}</small>
                </div>
              </template>
              <template v-else>
                <div v-if="object.media === 1 && mediaState" class="border-bottom">
                  <div
                      :style="`width: 100%; padding-bottom: ` +  paddingBottom( latestMedia.cover, latestMedia.origin_info_height, latestMedia.origin_info_width) +  `%; height: 0; border-radius: 14px 14px 0 0`"
                      class="no-gutters">
                    <el-image :preview-src-list="[mediaPath+(mediaPath === basePath ? `/api/v2/media/tweets/` : '')+latestMedia.cover]"
                              :src="mediaPath+(mediaPath === basePath ? `/api/v2/media/tweets/` : '')+latestMedia.cover" alt="cardImage"
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
    import BoxArrowUpRight from "@/components/icons/boxArrowUpRight";
    export default {
      name: "twCard",
      components: {BoxArrowUpRight},
      props: {
        object: Object,
        media: Array,
        mediaState: Boolean,
        //only for audiospace
        userName: {
          type: String,
          default: "",
        },
        tweetText: {
          type: String,
          default: "",
        },
      },
      data() {
        return {
          load: false,
          device: {
            android_app: "Android",
            iphone_app: "iPhone",
            ipad_app: "iPad",
          }
        }
      },
      computed: {
        latestMedia: function () {
          if (this.media.length) {
            return this.media[this.media.length - 1];
          } else {
            return []
          }
        },
        ratio: function () {
          return this.media[0].origin_info_width / this.media[0].origin_info_height;
        }
      },
        methods: {
          paddingBottom: function (link, height = 0, width = 0) {
            if (this.load) {
              let img = new Image();
              img.src = this.mediaPath + (this.mediaPath === this.basePath ? `/api/v2/media/tweets/` : '') + link;
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

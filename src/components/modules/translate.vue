<template>
    <div id="translate">
        <!--translate-->
        <div v-if="status === 0" class='card-text'>
            <span role="button" class="text-decoration-none"><small style="color:#1DA1F2" @click="translate(id, type)">{{ whatToTranslate }}</small></span>
        </div>
        <div v-else-if="status === 1" class="spinner-grow spinner-grow-sm" role="status" style="color:#1DA1F2">
            <span class="sr-only">{{ $t("public.loading") }}...</span>
        </div>
        <div v-else>
          <hr class="my-4">
          <p class='card-text'><small class="text-muted">{{ $t("translate.message.translate_by", [translate_source]) }}</small></p>
          <p class='card-text' style="white-space: pre-line"> {{ text }}</p>
          <span class="text-decoration-none" role="button"><small style="color:#1DA1F2"
                                                                  @click="status=0">{{ $t("translate.message.hide_translated") }}</small></span>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "translate",
        props: {
          type: Number,
          id: [String, Number],//tweet_id or uid
          to: String,
          order: {
            type: Number,
            default: -1,
          }
        },
      data() {
        return {
          status: 0,
          text: "",
          translate_source: "",
          whatToTranslate: this.type === 1 ? this.$t("translate.message.translate_profile") : this.$t("translate.message.translate_tweet")
        }
      },
      watch: {
        "$root.tweets": {
          handler: function () {
            if (this.type === 0 && this.order > -1) {
              if (this.$root.tweets[this.order].translate) {
                this.text = this.$root.tweets[this.order].translate.text
                this.translate_source = this.$root.tweets[this.order].translate.translate_source
                this.status = 2
              } else {
                this.text = ''
                this.translate_source = ''
                this.status = 0
              }
            }
          },
          deep: true
        },
      },
      computed: {
          toLanguage: function () {
            if (this.to === 'zh_hans') { return 'zh-cn'}
            if (this.to === 'zh_hant') { return 'zh-tw'}
            return this.to
          }
      },
      methods: {
        translate: function (id = 0, type = 0) {
          //type为0即推文, 为1即用户信息
          this.status = 1;
          if (type === 0) {
            if (!this.$root.tweets[this.order].translate) {
              axios.get(this.basePath + '/api/v2/data/translate/?tr_type=tweets&tweet_id=' + id + '&to=' + this.toLanguage).then(response => {
                if (this.order > -1) {
                  this.$root.tweets[this.order].translate = {
                    text: response.data.data.translate,
                    translate_source: response.data.data.translate_source
                  }
                }
                this.text = response.data.data.translate;
                this.translate_source = response.data.data.translate_source;
                this.status = 2;
              }).catch(error => {
                this.notice(error, "error");
                this.status = 0;
              })
            } else {
              this.text = this.$root.tweets[this.order].translate.text
              this.translate_source = this.$root.tweets[this.order].translate.translate_source
              this.status = 2
            }
                } else if (type === 1) {
                    axios.get(this.basePath + '/api/v2/data/translate/?tr_type=profile&uid=' + id + '&to=' + this.toLanguage).then(response => {
                        this.text = response.data.data.translate;
                        this.translate_source = response.data.data.translate_source;
                        this.status = 2;
                    }).catch(error => {
                        this.notice(error, "error");
                        this.status = 0;
                    })
                } else {
                    this.notice(this.$t("public.error"), "error");
                }
            },
        }
    }
</script>

<style scoped>

</style>

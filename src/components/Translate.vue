<template>
  <div id="translate">
    <!--translate-->
    <div v-if="state.status === 0" class='card-text'>
      <span role="button" class="text-decoration-none"><small style="color:#1DA1F2" @click="translate(props.id, props.type)">{{ type === '1' ? t("translate.message.translate_profile") : t("translate.message.translate_tweet") }}</small></span>
    </div>
    <div v-else-if="state.status === 1" class="spinner-grow spinner-grow-sm" role="status" style="color:#1DA1F2">
      <span class="sr-only">{{ t("public.loading") }}...</span>
    </div>
    <div v-else>
      <hr class="my-4">
      <p class='card-text'><small class="text-muted">{{ t("translate.message.translate_by", [state.translate_source]) }}</small></p>
      <p class='card-text' style="white-space: pre-line"> {{ state.text }}</p>
      <span class="text-decoration-none" role="button"><small style="color:#1DA1F2" @click="state.status = 0">{{ t("translate.message.hide_translated") }}</small></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useStore} from "@/store";
import {computed, reactive, watch} from "vue";
import {Notice} from "@/share/Tools";
import {controller, request} from "@/share/Fetch";
import {ApiTranslate} from "@/type/Api";
import {useI18n} from "vue-i18n";
const props = defineProps({
  type: {
    type: String,
    validator(value: string): boolean {
      return ['0', '1'].includes(value)
    }
  },
  id: [Number, String],//tweet_id or uid
  to: {
    type: String,
    validator(value: string): boolean {
      return ['zh-cn', 'zh-tw', 'zh-hans', 'zh-hant', 'en', 'ja', 'ko'].includes(value)
    }
  },
  order: {
    type: Number,
    default: -1
  }
})

const { t } = useI18n()

const store = useStore()
const settings = computed(() => store.state.settings)
const tweets = computed(() => store.state.tweets)
const toLanguage = (): string => {
  if (String(props.to) === 'zh_hans') { return 'zh-cn'}
  if (String(props.to) === 'zh_hant') { return 'zh-tw'}
  return String(props.to)
}

const state = reactive<{
  status: 0 | 1 | 2;
  text: string;
  translate_source: string
}>({
  status: 0,
  text: "",
  translate_source: "",
})

watch(tweets, () => {
  if (String(props.type) === '0' && props.order > -1) {
    if (tweets.value[props.order].translate !== undefined) {
      state.text = tweets.value[props.order].translate.text
      state.translate_source = tweets.value[props.order].translate.translate_source
      state.status = 2
    } else {
      state.text = ''
      state.translate_source = ''
      state.status = 0
    }
  }
}, {deep: true})

const translate = (id: 0, type: '0') => {
  //type为0即推文, 为1即用户信息
  state.status = 1;
  if (String(props.type) === '0') {
    if (!tweets.value[props.order].translate) {
      request<ApiTranslate>(settings.value.basePath + '/api/v2/data/translate/?tr_type=tweets&tweet_id=' + id + '&to=' + toLanguage, controller).then(response => {
        store.dispatch({type: "updateTweetsTranslate", order: props.order, translate: {text: response.data.translate, translate_source: response.data.translate_source}})
        state.text = response.data.translate
        state.translate_source = response.data.translate_source
        state.status = 2
      }).catch(e => {
        state.status = 0
        Notice(String(e), 'error')
      })
    } else {
      state.text = tweets.value[props.order].translate.text
      state.translate_source = tweets.value[props.order].translate.translate_source
      state.status = 2
    }
  } else if (String(props.type) === '1') {
    request<ApiTranslate>(settings.value.basePath + '/api/v2/data/translate/?tr_type=profile&uid=' + id + '&to=' + toLanguage, controller).then(response => {
      state.text = response.data.translate
      state.translate_source = response.data.translate_source
      state.status = 2
    }).catch(e => {
      state.status = 0
      Notice(String(e), 'error')
    })
  } else {
    Notice(t("public.error"), "error")
  }
}
</script>

<style scoped>

</style>

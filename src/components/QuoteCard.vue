<template>
  <div class="no-gutters card mb-2" id="quote" style="border-radius: 14px 14px 14px 14px">
    <div class='card-body'>
      <span class="card-text" v-if="!quoteObject.full_text">{{ t("quote_card.card.this_tweet_is_not_available") }}</span>
      <template v-else>
        <div>
          <span class="text-muted">{{ quoteObject.display_name }}</span>
          <el-divider direction="vertical"></el-divider>
          <small>@{{ quoteObject.name }}</small>
          <a :href="`//twitter.com/i/status/`+quoteObject.id_str" target="_blank">
            <box-arrow-up-right status="text-primary" width="2em" height="2em" />
          </a>
        </div>
        <div class="my-4"></div>
        <full-text :full_text_origin="quoteObject.full_text" :entities="quoteObject.entities" />
        <div id="quotefoot">
          <small class="text-muted">{{ timeGap(quoteObject.time, now, settings.language) }}</small>
        </div>
        <!--media-->
        <template v-if="quoteObject.media === 1&&!settings.displayPicture">
          <div class="my-4"></div>
          <image-list :basePath="store.getters.getBasePath" :bottom="true" :is_video="quoteObject.video" :list="quoteMedia"/>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import ImageList from "./TweetImages.vue";
  import BoxArrowUpRight from "@/icons/BoxArrowUpRight.vue";
  import {useStore} from "@/store";
  import {PropType, computed} from "vue";
  import {Media, Quote} from "@/type/Content";
  import {useI18n} from "vue-i18n";
  import FullText from "@/components/FullText.vue";

  defineProps({
    quoteObject: {
      type: Object as PropType<Quote | {}>,
      default: () => {}
    },
    quoteMedia: {
      type: Array as PropType<Media[]>,
      default: () => []
    }
  })
  const { t } = useI18n()
  const store = useStore()
  const now = computed(() => store.state.now)
  const settings = computed(() => store.state.settings)

  const timeGap = (timestamp: number, now: Date, language: string) => {
    let gap = (Number(now) - (timestamp * 1000))/1000;
    if (gap < 60) {
      return Math.floor(gap) + ' ' + t("public.time.second", Math.floor(gap) === 1 ? 1 : 2);
    } else if (gap < 3600) {
      return Math.floor(gap/60) + ' ' + t("public.time.minute", Math.floor(gap/60) === 1 ? 1 : 2);
    } else if (gap < 86400) {
      return Math.floor(gap/3600) + ' ' + t("public.time.hour", Math.floor(gap/3600) === 1 ? 1 : 2);
    } else {
      return (new Date(timestamp * 1000)).toLocaleString(language);
    }
  }
</script>

<style scoped>

</style>

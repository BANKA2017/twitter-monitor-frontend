<template>
  <div :class="{'text-break': true, 'd-inline-block': !inline, 'd-inline': inline}" id="full-text">
    <div class="mb-2" v-if="state.replyNameList.length > 0" style="font-size: 0.8em">
      {{ t("tweet.text.replying_to") }}
      <template v-for="(name, index) in state.replyNameList" :key="name">
        <span v-if="index > 0" class="text-primary"> {{ t("public.and") }} </span>
        <router-link :to="'/' + name.replace('@', '') +'/all'" class="text-primary">{{name}}</router-link>
      </template>
    </div>
    <template v-for="(obj, order) in textObject" :key="order">
      <template v-for="(text, ord) in obj.sub_content">
        <template v-for="(textData, textOrder) in text" :key="'template_'+ord+order+textOrder+text">
          <span v-if="textData.text" class="mb-1">{{ textData.text }}</span>
          <img v-if="textData.tag_text && textData.url" :src="textData.url" style="height: 1em; width: 1em;" :alt="textData.tag_text" class="margin-for-inner-text-svg">
        </template>
        <br v-if="ord !== obj.sub_content.length - 1">
      </template>
      <router-link @click="e => {e.stopPropagation()}" v-if="obj.content.type === 'hashtag' || obj.content.type === 'symbol'" :to="(obj.content.type === 'hashtag' ? `/hashtag/` : `/cashtag/`) + obj.content.tag_text">{{(obj.content.type === 'hashtag' ? '#' : '$') + obj.content.tag_text }}</router-link>
      <router-link @click="e => {e.stopPropagation()}"
        v-else-if="(obj.content.type === 'user_mention' && (settings.onlineMode || userList.map(x => x.name).includes(obj.content.tag_text.substring(1))))"
        :to="`/`+obj.content.tag_text.substring(1)+`/all`">{{ obj.content.tag_text }}
      </router-link>
      <a v-else @click="e => {e.stopPropagation()}" id="url" :href="obj.content.url" target="_blank">{{ obj.content.tag_text }}</a>
    </template>
  </div>
</template>

<script setup lang="ts">
import {EmojiEntity, parse} from 'twemoji-parser'
import type {Entity} from "@/type/Content"
import {useStore} from "@/store";
import {computed, PropType, reactive, ref, Ref} from "vue";
import {useI18n} from "vue-i18n";
const props = defineProps({
  full_text_origin: {
    type: String,
    default: ""
  },
  entities: {
    type: Array as PropType<Entity[]>,
    default: () => ([])
  },
  displayRange: {
    type: Array as PropType<number[]>,
    default: [0, 0]
  },
  inline: {
    type: Boolean,
    default: false
  }
})

const state = reactive<{
  replyNameList: Ref<string[]>
  breakCheckFlag: Ref<boolean>
}>({
  replyNameList: ref([]),
  breakCheckFlag: ref(false)
})

const { t } = useI18n()
const store = useStore()
const userList = computed(() => store.state.userList)
const twemojiBasePath = computed(() => store.state.twemojiBasePath)
const settings = computed(() => store.state.settings)
const buildUrl = (codepoints: string, assetType: string): string => twemojiBasePath.value + `72x72/${codepoints}.${assetType}`
const emojiObject = (text: string = ''): Entity[] => parse(text, {buildUrl: buildUrl, assetType: 'png'}).map((x: EmojiEntity): Entity => ({
  expanded_url: x.url,
  indices_end: x.indices[1],
  indices_start: x.indices[0],
  text: x.text,
  type: "emoji"
})).sort((a, b) => a.indices_start - b.indices_start)
const spreadText = (text: string): string[] => text.split("\n")
const removeHTMLEntities = (text: string): string => text.replaceAll('&gt;', '>').replaceAll('&lt;', '<').replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll('&apos;', "'")
const contentObjectBuilder = (text: string = "", entities: Entity[] = [], arrayMode: boolean = false) => {
  let lastEnd = 0;
  let tmpText: {text: string; type: Entity["type"]; tag_text: string; url: string}[] = [];
  if (arrayMode) {
    let full_text_origin_array = [...props.full_text_origin];
    entities.forEach((entity, key) => {
      if (!state.breakCheckFlag && ((lastEnd + 1 > props.displayRange[0]) || (key === 0 && entity.indices_start !== 0) || (entity.type !== 'user_mention'))) {
        state.breakCheckFlag = true
      }
      if (!state.breakCheckFlag && entity.type === 'user_mention') {
        if (!state.replyNameList.includes(entity.text)) {
          state.replyNameList.push(entity.text)
        }
      } else {
        tmpText.push({text: removeHTMLEntities(full_text_origin_array.slice(lastEnd, entity.indices_start).join('')), type: entity.type, tag_text: entity.text, url: entity.expanded_url,});
      }
      lastEnd = entity.indices_end;
    })
    //处理最后一段
    let tmpLastText = full_text_origin_array.slice(lastEnd).join('').replace(/ https:\/\/t.co\/[\w]+/, '');
    if (tmpLastText.length) {
      tmpText.push({text: tmpLastText, type: "", tag_text: "", url: "",});
    }
  } else {
    entities.forEach(entity => {
      tmpText.push({text: removeHTMLEntities(text.substring(lastEnd, entity.indices_start)), type: entity.type, tag_text: entity.text, url: entity.expanded_url,});
      lastEnd = entity.indices_end;
    })
    //处理最后一段
    let tmpLastText = removeHTMLEntities(text.substring(lastEnd))
    if (tmpLastText.length) {
      tmpText.push({text: tmpLastText, type: "", tag_text: "", url: "",});
    }
  }
  return tmpText;
}
const textObject = computed(() => contentObjectBuilder(props.full_text_origin, props.entities, true).map(content => {
    const tmpText = spreadText(content.text)
    return {
      content,
      sub_content: tmpText.map(text => contentObjectBuilder(text, emojiObject(text)))
    }
  })
)
</script>

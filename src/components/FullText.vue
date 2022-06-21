<template>
  <span class="text-break" id="full-text">
    <template v-for="(obj, order) in textObject(full_text_origin, entities, true)" :key="order">
      <template v-for="(text, ord) in x = spreadText(obj.text)">
        <template v-for="(textData, textOrder) in textObject(text, emojiObject(text))">
          <span v-if="textData.text" :key="'span'+ord+order+textOrder+text" class="mb-1">{{ textData.text.replaceAll("&amp;amp;", "&") }}</span>
          <img v-if="textData.tag_text" :src="textData.url" style="height: 1em; width: 1em;" :alt="textData.tag_text" :key="'img'+ord+order+textOrder+text" class="mx-1 mb-1">
        </template>
        <br v-if="ord !== x.length - 1">
      </template>
      <router-link v-if="obj.type === 'hashtag' || obj.type === 'symbol'" :to="(obj.type === 'hashtag' ? `/hashtag/` : `/cashtag/`) + obj.tag_text">#{{ obj.tag_text }}</router-link>
      <router-link
        v-else-if="(obj.type === 'user_mention' && (settings.onlineMode || userList.map(x => x.name).includes(obj.tag_text.substring(1))))"
        :to="`/`+obj.tag_text.substring(1)+`/all`">{{ obj.tag_text }}
      </router-link>
      <a v-else id="url" :href="obj.url" target="_blank">{{ obj.tag_text }}</a>
    </template>
  </span>
</template>

<script setup lang="ts">
import {EmojiEntity, parse} from 'twemoji-parser'
import type {Entity} from "@/type/Content"
import {useStore} from "@/store";
import {computed, PropType} from "vue";
const props = defineProps({
  full_text_origin: {
    type: String,
    default: ""
  },
  entities: {
    type: Array as PropType<Entity[]>,
    default: () => ([])
  }
})
const store = useStore()
const userList = computed(() => store.state.userList)
const twemojiBasePath = computed(() => store.state.twemojiBasePath)
const settings = computed(() => store.state.settings)
const buildUrl = (codepoints: string, assetType: string): string => twemojiBasePath.value + `svg/${codepoints}.${assetType}`
const emojiObject = (text: string = ''): Entity[] => parse(text, {buildUrl: buildUrl, assetType: 'svg'}).map((x: EmojiEntity): Entity => ({
  expanded_url: x.url,
  indices_end: x.indices[1],
  indices_start: x.indices[0],
  text: x.text,
  type: "emoji"
})).sort((a, b) => a.indices_start - b.indices_start)
const spreadText = (text: string): string[] => text.split("\n")
const textObject = (text: string = "", entities: Entity[] = [], arrayMode: boolean = false) => {
  let lastEnd = 0;
  let tmpText: {text: string; type: Entity["type"]; tag_text: string; url: string}[] = [];
  if (arrayMode) {
    let full_text_origin_array = [...props.full_text_origin];
    entities.map(entity => {
      tmpText.push({text: full_text_origin_array.slice(lastEnd, entity.indices_start).join(''), type: entity.type, tag_text: entity.text, url: entity.expanded_url,});
      lastEnd = entity.indices_end;
    })
    //处理最后一段
    let tmpLastText = full_text_origin_array.slice(lastEnd).join('').replace(/ https:\/\/t.co\/[\w]+/, '');
    if (tmpLastText.length) {
      tmpText.push({text: tmpLastText, type: "", tag_text: "", url: "",});
    }
  } else {
    entities.map(entity => {
      tmpText.push({text: text.substring(lastEnd, entity.indices_start), type: entity.type, tag_text: entity.text, url: entity.expanded_url,});
      lastEnd = entity.indices_end;
    })
    //处理最后一段
    let tmpLastText = text.substring(lastEnd);
    if (tmpLastText.length) {
      tmpText.push({text: tmpLastText, type: "", tag_text: "", url: "",});
    }
  }
  return tmpText;
}
</script>

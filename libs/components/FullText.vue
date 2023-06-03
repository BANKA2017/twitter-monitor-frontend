<template>
  <div :class="{'text-break': true, 'd-inline-block': !inline, 'd-inline': inline}" id="full-text">
    <div class="mb-2" v-if="state.replyNameList.length > 0" style="font-size: 0.8em">
      {{ t("tweet.text.replying_to") }}
      <template v-for="(name, index) in state.replyNameList" :key="name">
        <span v-if="index > 0" class="text-primary"> {{ t("public.and") }} </span>
        <router-link :to="'/' + name.replace('@', '') +'/all'" class="text-primary">{{name}}</router-link>
      </template>
    </div>
    <template v-for="(obj, order) in state.textObject" :key="order">
        <span :class="{'fw-bold': obj.richtext_types.includes('Bold'), 'fst-italic': obj.richtext_types.includes('Italic')}">
            <template v-for="content in obj.content" :key="content" >
                <template v-if="content.indices_start + 1 >= displayRange[0]">
                    <router-link @click="e => {e.stopPropagation()}" v-if="content.type === 'hashtag' || content.type === 'symbol'" :to="(content.type === 'hashtag' ? `/hashtag/` : `/cashtag/`) + content.text">
                        {{(content.type === 'hashtag' ? '#' : '$') + content.text }}
                    </router-link>
                    <router-link @click="e => {e.stopPropagation()}" v-else-if="(content.type === 'user_mention' && (settings.onlineMode || userList.map(x => x.name).includes(content.text.substring(1))))" :to="`/`+content.text.substring(1)+`/all`">
                        {{ content.text }}
                    </router-link>
                    <a v-else-if="content.type === 'url'" @click="e => {e.stopPropagation()}" id="url" :href="content.expanded_url" target="_blank">{{ content.text }}</a>
                    <img v-else-if="content.type === 'emoji' && content.expanded_url" :src="content.expanded_url" style="height: 1em; width: 1em;" :alt="content.text" class="margin-for-inner-text-svg">
                    <template v-else>
                        <template v-for="(text, textIndex) in content.text.split(`\n`)" :key="text">
                            <br v-if="content.text.includes(`\n`) && textIndex !== 0" />
                            <span v-if="text">
                                {{text}}
                            </span>
                        </template>
                    </template>
                </template>
            </template>
        </span>

    </template>
  </div>
</template>

<script setup lang="ts">
import {EmojiEntity, parse} from 'twemoji-parser'
import type {Entity, RichText} from "../types/Content"
import {useStore} from "../store";
import {computed, onMounted, PropType, reactive, ref, Ref} from "vue";
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
  rich_text_tags: {
    type: Array as PropType<RichText["richtext_tags"]>,
    default: []
  },
  displayRange: {
    type: Array as PropType<[number, number]>,
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
  textObject: any[]
}>({
  replyNameList: ref([]),
  breakCheckFlag: ref(false),
  textObject: []
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
const removeHTMLEntities = (text: string): string => text.replaceAll('&gt;', '>').replaceAll('&lt;', '<').replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll('&apos;', "'")//.replaceAll(' ', "&nbsp;")
const contentObjectBuilder = () => {
  const displayRange = props.displayRange?.length ? props.displayRange : [0, 0]

  let nextRichText = []
  const fe0f = String.fromCharCode(0xfe0f)
  let full_text_origin_array = [...props.full_text_origin]
  if (!props.rich_text_tags || props.rich_text_tags.length === 0) {
    nextRichText.push({from_index: 0, to_index: full_text_origin_array.length, richtext_types: [], content: [], text: full_text_origin_array.slice(0, full_text_origin_array.length).join('')})
  } else {
    props.rich_text_tags.forEach((tag, tag_index) => {
      //first content
      if (tag_index === 0 && tag.from_index > 0) {
        nextRichText.push({from_index: 0, to_index: tag.from_index - 1, richtext_types: [], content: [], text: full_text_origin_array.slice(0, tag.from_index).join('')})
      }
      tag.content = []
      tag.text = full_text_origin_array.slice(tag.from_index, tag.to_index).join('')
      nextRichText.push(tag)
      if (tag_index >= props.rich_text_tags?.length - 1) {
        if (tag.to_index < full_text_origin_array.length) {
          nextRichText.push({from_index: tag.to_index, to_index: full_text_origin_array.length, richtext_types: [], content: [], text: full_text_origin_array.slice(tag.to_index, full_text_origin_array.length).join('')})
        }
      } else {
        if (props.rich_text_tags?.[tag_index + 1].from_index >= tag.to_index + 1) {
          nextRichText.push({from_index: tag.to_index, to_index: props.rich_text_tags?.[tag_index + 1].from_index, richtext_types: [], content: [], text: full_text_origin_array.slice(tag.to_index, props.rich_text_tags?.[tag_index + 1].from_index).join('')})
        }
      }
    })
  }

  for (const richItem of nextRichText) {
    const filterEntities = props.entities?.filter(entity => (entity.indices_start >= richItem.from_index) && (entity.indices_end <= richItem.to_index))
    if (richItem.from_index < displayRange[0]) {
      state.replyNameList = filterEntities.filter(entity => entity.indices_start < displayRange[0] && entity.type === "user_mention").map(entity => entity.text)
    }
    let emojiOffset = 0
    const emojiEntities = emojiObject(richItem.text).map(emoji => {
        const tmpEmojiOffset = emojiOffset
        emojiOffset += emoji.indices_end - emoji.indices_start - 1
        if (full_text_origin_array[emoji.indices_start - tmpEmojiOffset+1] === fe0f){
          emojiOffset-=1
        }
        emoji.indices_start_backup = emoji.indices_start
        emoji.indices_end_backup = emoji.indices_end
        emoji.indices_start = emoji.indices_start + richItem.from_index - tmpEmojiOffset
        emoji.indices_end = emoji.indices_start + 1
        return emoji
    })


      const tmpEntities = [...emojiEntities, ...filterEntities].sort((a, b) => a.indices_start - b.indices_start)

      const tmpContent = []
    if (tmpEntities.length) {
      for (const entity_index in tmpEntities) {
        const entity = tmpEntities[entity_index]
        const isEmoji = entity.type === 'emoji'

        if (entity_index === '0' && entity.indices_start > richItem.from_index) {
          tmpContent.push({
            expanded_url: "",
            indices_end: entity.indices_start,
            indices_start: richItem.from_index,
            text: removeHTMLEntities(full_text_origin_array.slice(richItem.from_index, entity.indices_start).join('')),
            type: "text",
          })
        }

        tmpContent.push(entity)
        if (entity_index >= tmpEntities.length - 1) {
          if ((entity.indices_end_backup || entity.indices_end) < richItem.to_index) {
            tmpContent.push({
              expanded_url: "",
              indices_end: richItem.to_index,
              indices_start: entity.indices_end,
              text: removeHTMLEntities(full_text_origin_array.slice(entity.indices_end, richItem.to_index).join('').replace(/ https:\/\/t.co\/[\w]+/, '')),
              type: "text",
            })
          }
        } else {
          if (tmpEntities[Number(entity_index) + 1]?.indices_start > entity.indices_end) {
            tmpContent.push({
              expanded_url: "",
              indices_end: tmpEntities[Number(entity_index) + 1].indices_start,
              indices_start: entity.indices_end,
              text: removeHTMLEntities(full_text_origin_array.slice(entity.indices_end, tmpEntities[Number(entity_index) + 1].indices_start).join('')),
              type: "text",
            })
          }
        }
      }
    } else {
      tmpContent.push({
        expanded_url: "",
        indices_end: richItem.to_index,
        indices_start: richItem.from_index,
        text: removeHTMLEntities(full_text_origin_array.slice(richItem.from_index, richItem.to_index).join('').replace(/ https:\/\/t.co\/[\w]+/, '')),
        type: "text",
      })
    }
      richItem.content = tmpContent
  }
  return nextRichText;
}
onMounted(() => {
  state.textObject = contentObjectBuilder()
})
</script>

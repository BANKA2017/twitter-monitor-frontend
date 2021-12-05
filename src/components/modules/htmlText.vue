<template>
  <div id="htmlText" ref="html_text">
    <p class='card-text'>
      <template v-for="(obj, order) in textObject(full_text_origin, entities, true)" :key="order">
        <template v-for="(text, ord) in x = spreadText(obj.text)">
          <template v-for="(textData, textOrder) in textObject(text, emojiObject(text))">
            <span v-if="textData.text" :key="'span'+ord+order+textOrder+text">{{ textData.text }}</span>
            <img v-if="textData.tag_text" :src="textData.url" style="height: 1em;" :alt="textData.tag_text" :key="'img'+ord+order+textOrder+text">
          </template>
          <br v-if="ord !== x.length -1" :key="`ord_`+order+ord">
        </template>

        <router-link v-if="obj.type === 'hashtag' || obj.type === 'symbol'" :to="(obj.type === 'hashtag' ? `/hashtag/` : `/cashtag/`) + obj.tag_text">#{{ obj.tag_text }}</router-link>
        <router-link
            v-else-if="obj.type === 'user_mention' && userList.map(x => x.name).includes(obj.tag_text.substring(1))"
            :to="`/`+obj.tag_text.substring(1)+`/all`">{{ obj.tag_text }}
        </router-link>
        <a v-else id="url" :href="obj.url" target="_blank">{{ obj.tag_text }}</a>
      </template>
    </p>
</div>
</template>

<script>
import { parse } from 'twemoji-parser';
import { mapState } from "vuex";
export default {
  name: 'htmlText',
  props: {
    full_text_origin: String,
    entities: Array,
  },
  computed: mapState({
    userList: 'userList',
    twemojiBasePath: 'twemojiBasePath'
  }),
  methods: {
    buildUrl: function (codepoints, assetType) {
      return this.twemojiBasePath + `svg/${codepoints}.${assetType}`
    },
    emojiObject: function (text = '') {
      return parse(text, {buildUrl: this.buildUrl, assetType: 'svg'}).map(x => ({
        expanded_url: x.url,
        indices_end: x.indices[1],
        indices_start: x.indices[0],
        text: x.text,
        type: "emoji"
      })).sort((a, b) => a.indices_start - b.indices_start)
    },
    textObject: function (text = "", entities = [], arrayMode = false) {
      let lastEnd = 0;
      let tmpText = [];

      if (arrayMode) {
        let full_text_origin_array = [...this.full_text_origin];
        this.entities.map(entity => {
          tmpText.push({
            text: full_text_origin_array.slice(lastEnd, entity.indices_start).join(''),
            type: entity.type,
            tag_text: entity.text,
            url: entity.expanded_url,
          });
          lastEnd = entity.indices_end;
        })
        //处理最后一段
        let tmpLastText = full_text_origin_array.slice(lastEnd).join('').replace(/ https:\/\/t.co\/[\w]+/, '');
        if (tmpLastText.length) {
          tmpText.push({
            text: tmpLastText,
            type: "",
            tag_text: "",
            url: "",
          });
        }
      } else {
        entities.map(entity => {
          tmpText.push({
            text: text.substring(lastEnd, entity.indices_start),
            type: entity.type,
            tag_text: entity.text,
            url: entity.expanded_url,
          });
          lastEnd = entity.indices_end;
        })
        //处理最后一段
        let tmpLastText = text.substring(lastEnd);
        if (tmpLastText.length) {
          tmpText.push({
            text: tmpLastText,
            type: "",
            tag_text: "",
            url: "",
          });
        }
      }
      return tmpText;
    },
    spreadText: function (text) {
      return text.split("\n")
    },
  }
}
</script>

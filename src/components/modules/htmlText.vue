<template>
  <div id="htmlText">
    <p class='card-text'>
      <template v-for="(obj, order) in textObject">

        <template v-for="(text, ord) in spreadText(obj.text)">
          {{ text }}
          <br :key="`ord_`+order+ord+text" v-if="text === `\n`">
        </template>

        <router-link v-if="obj.type === 'hashtag' || obj.type === 'symbol'" :to="(obj.type === 'hashtag' ? `/hashtag/` : `/cashtag/`) + obj.tag_text" :key="order">#{{ obj.tag_text }}</router-link>
        <router-link
            v-else-if="obj.type === 'user_mention' && $root.userList.map(x => x.name).includes(obj.tag_text.substring(1))"
            :key="order" :to="`/`+obj.tag_text.substring(1)+`/all`">{{ obj.tag_text }}
        </router-link>
        <a v-else :href="obj.url" :key="order" target="_blank" id="url">{{ obj.tag_text }}</a>
      </template>
    </p>
</div>
</template>

<script>
export default {
  name: 'htmlText',
  props: {
    full_text_origin: String,
    entities: Array,
  },
  computed: {
    textObject: function () {
      let lastEnd = 0;
      let tmpText = [];
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
      return tmpText;
    }
  },
  methods: {
    spreadText: function (text) {
      let textArray = []
      let tmpText = ''
      let latestWord = ''
      text = [...text]
      
      text.map(x => {
        if (latestWord === "\n" && x === "\n") {
          return
        }
        if (x === "\n") {
          textArray.push(tmpText)
          textArray.push("\n")
          tmpText = ''
        } else {
          tmpText += x
        }
        latestWord = x
      })
      textArray.push(tmpText)
      return textArray
    } 
  }
}
</script>

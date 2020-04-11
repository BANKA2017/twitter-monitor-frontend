<template>
  <div id="htmlText">
    <p class='card-text'>
      <template v-for="(obj, order) in textObject">
        <span v-html='obj.text.replace(/\n\n|\n/g,"<br>").replace(/<script>/, "")' :key="order + '_tweetsText'"></span>
        <router-link v-if="obj.type === 'hashtag' || obj.type === 'symbol'" :to="(obj.type === 'hashtag' ? `/hashtag/` : `/cashtag/`) + obj.tag_text" :key="order">#{{ obj.tag_text }}</router-link>
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
  }
}
</script>

<template>
  <div id="htmlText">
    <p class='card-text'>
      <template v-for="(obj, order) in textObject">
        <span v-html='obj.text.replace(/\n\n|\n/g,"<br>")' :key="order + '_tweetsText'"></span>
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
    textObject: Array,
    tweet_id: String,
  },
}
</script>

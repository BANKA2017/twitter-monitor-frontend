<template>
    <div v-if="links && links.length" id="linkList">
      <template v-for="(link, s) in links" :key="link.url+s">
        <span v-if="s!==0"> · </span>
        <a :href="link.url" class="text-muted " target="_blank"><small>{{
            link.display
          }}</small></a>
      </template>
      <div class="my-4"></div>
    </div>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        name: "linkList",
        computed: mapState({
          links: 'links'
        })
    }
</script>

<style scoped>

</style>

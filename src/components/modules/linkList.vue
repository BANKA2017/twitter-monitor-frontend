<template>
    <div id="linkList">
        <template v-for="(link, s) in $root.links">
            <span :key="s" v-if="s!==0"> · </span>
            <a :key="link.url+s" :href="link.url" class="text-muted " target="_blank"><small>{{
                link.display
              }}</small></a>
        </template>
        <div class="my-4"></div>
    </div>
</template>

<script>
    export default {
        name: "linkList"
    }
</script>

<style scoped>

</style>

<template>
    <div id="linkList">
        <template v-for="(link, s) in $root.links">
            <span :key="s" v-if="s!==0"> · </span>
            <a :href="link.url" :key="link.url+s" class="text-muted" target="_blank"><small>{{ link.display
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

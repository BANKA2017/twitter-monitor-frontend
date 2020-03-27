<template>
    <div id="imageListSlot">
        <div slot="error" class="image-slot">
            <div :style="`height: ` + height + `px`" v-loading="true" element-loading-background="rgba(0, 0, 0, 0)" />
        </div>
        <div slot="placeholder" class="image-slot">
            <!--此处可写死-->
            <div :style="`height: ` + height + `px`" v-loading="true" element-loading-background="rgba(0, 0, 0, 0)" />
        </div>
    </div>
</template>

<script>
    export default {
        name: "imageListSlot",
        props: {
            height: Number
        }
    }
</script>

<style scoped>

</style>

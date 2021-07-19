<template>
  <div v-once id="not-found">
    <div class="jumbotron jumbotron-fluid" style="background-color: #1da1f2">
      <div class="container">
        <h1 class="display-1" style="color: white">404</h1>
        <p class="lead" style="color: white">{{ $t("notice.nothing_here") }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "notFound",
  metaInfo () {
    return {
      title: "404",
      meta: [{
        name: "theme-color",
        content: "#1da1f2"
      }]
    }
  },
}
</script>

<style scoped>

</style>

<template>
  <div id="admin">
    <nav class="navbar navbar-expand-lg navbar-light text-center bg-light">
      <span class="navbar-brand mb-0 h1">Twitter Monitor</span>
      <button aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" class="navbar-toggler"
              data-target="#navbarNav" data-toggle="collapse" type="button">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="navbarNav" class="collapse navbar-collapse">
        <ul class="navbar-nav">
          <li class="nav-item dropdown">
            <span class="nav-link" role="button" @click="mode='editor'">编辑</span>
          </li>
        </ul>
      </div>
    </nav>
    <span v-if="mode === 'saas'">sasa</span>
    <dev-config v-else></dev-config>
  </div>
</template>

<script>
import DevConfig from "@/components/pages/devConfig";

export default {
  name: "admin",
  components: {DevConfig},
  data() {
    return {
      mode: "saas",
    }
  },
  beforeRouteEnter(to, from, next) {
    //none
    next(vm => {
      if (!vm.$root.settings.adminStatus) {
        //vm.$router.go(-1)
      }
      next()
    })
  },
  metaInfo() {
    return {
      title: "管理",
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

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
          <li class="nav-item">
            <span class="nav-link" role="button" @click="mode='editor'">编辑</span>
          </li>
          <li class="nav-item">
            <span class="nav-link" role="button" @click="mode='shasum'">SHA256</span>
          </li>
        </ul>
      </div>
    </nav>
    <span v-if="mode === 'main'">嘿嘿</span>
    <dev-config v-else-if="mode === 'editor'"></dev-config>
    <template v-else-if="mode === 'shasum'">
      <container>
        <row>
          <div class="col-md-8 offset-md-2">
            <input class="form-control my-4" type="text" v-model="hash">
            {{ hashText }}
          </div>
        </row>
      </container>
    </template>
  </div>
</template>

<script>
import CryptoJS from "crypto-js";
import DevConfig from "@/components/pages/devConfig";
export default {
  name: "admin",
  components: {DevConfig},
  data() {
    return {
      mode: "main",
      hash: '',
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
  computed: {
    hashText: function () {
      return CryptoJS.enc.Base64.stringify(CryptoJS.SHA256(this.hash))
    }
  },
}
</script>

<style scoped>

</style>

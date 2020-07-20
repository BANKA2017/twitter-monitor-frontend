<template>
  <div id="app">
    <div style="position: absolute"></div>
    <el-backtop></el-backtop>
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    mounted: function () {
      this.localrun();
    },
    methods: {
      localrun: function () {
        //localStorage
        if (!localStorage.getItem('tm_settings')) {
          localStorage.setItem('tm_settings', JSON.stringify(this.$root.settings.data));//提前写入
        } else {
          this.$root.settings.data = JSON.parse(localStorage.getItem('tm_settings'));
        }
        //time
        this.updateNow();
      },
      updateNow: function () {
        this.$root.now = new Date();
        setTimeout(this.updateNow, 1000);
      },
    }
  }
</script>

<style>

</style>

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
    metaInfo () {
      return {
        title: "关于",
        meta: [{
          name: "description",
          content: "Twitter Monitor with bangdream.fun"
        },
        {
          name: "keywords",
            content: "bangdream, LoveLive!, 少女乐团派对twitter, Twitter Monitor, twitter监控"
        }]
      }
    },
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
        //updateHeightStatus
        //this.isUp();
      },
      updateNow: function () {
        this.$root.now = new Date();
        setTimeout(this.updateNow, 1000);
      },
      //isUp: function () {
      //  this.$root.altitudeDifference = this.$root.height - document.documentElement.scrollTop;
      //  this.$root.height = document.documentElement.scrollTop
      //  setTimeout(() => {
      //    this.isUp();
      //  }, 500);
      //},
    }
  }
</script>

<style>

</style>

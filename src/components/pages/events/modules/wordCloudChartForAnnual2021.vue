<template>
  <div id="word-cloud-chart-for-annual-2021">
    <el-skeleton :loading="!computedOptions.series[0].data.length" :rows="4" animated></el-skeleton>
    <v-chart v-if="computedOptions.series[0].data.length" :option="computedOptions" :style="{width: '100%', height: (typeof(height) === 'number' ? (height + 'px') : height)}" autoresize></v-chart>
  </div>
</template>

<script>
import * as echarts from 'echarts/core';
import { TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import 'echarts-wordcloud';
import VChart from "vue-echarts";

echarts.use([TitleComponent, CanvasRenderer]);
export default {
  name: "wordCloudChartForAnnual2021",
  components: {
    VChart
  },
  props: {
    data: {
      type: Array,
      default: () => ([])
    },
    title: {
      type: String,
      default: ""
    },
    subtitle: {
      type: String,
      default: ""
    },
    height: {
      type: [String, Number],
      default: "750px"
    },
  },
  data: () => ({
    option: {
      title: {text: '', subtext: '', subtextStyle: {align: 'center'},},
      tooltip: {},
      series: [{
        type: 'wordCloud',
        shape: 'square',
        keepAspect: false,
        left: 'center',
        top: 'center',
        width: '90%',
        height: '90%',
        right: null,
        bottom: null,
        sizeRange: [12, 60],
        rotationRange: [-90, 90],
        rotationStep: 45,
        gridSize: 8,
        drawOutOfBound: false,
        layoutAnimation: true,
        textStyle: {
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
          // Color can be a callback function or a color string
          color: function () {
            // Random color
            return 'rgb(' + [
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160)
            ].join(',') + ')';
          }
        },
        emphasis: {
          focus: 'self',

          textStyle: {
            textShadowBlur: 10,
            textShadowColor: '#333'
          }
        },
        data: []
      }],
    }
  }),
  computed: {
    computedOptions: function () {
      let tmpOption = this.option
      tmpOption.title.text = this.title
      tmpOption.title.subtext = this.subtitle
      tmpOption.series[0].data = this.data
      return tmpOption
    }
  }
}
</script>

<style scoped>

</style>

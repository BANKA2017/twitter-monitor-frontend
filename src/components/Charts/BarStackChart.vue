<template>
  <div id="bar-stack-chart-for-annual-2021">
    <el-skeleton :loading="!computedOptions.series[0].data.length" :rows="4" animated></el-skeleton>
    <v-chart v-if="computedOptions.series[0].data.length" :option="computedOptions" :style="{width: '100%', height: (typeof(height) === 'number' ? (height + 'px') : height)}" autoresize></v-chart>
  </div>
</template>

<script>
import * as echarts from 'echarts/core';
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent
} from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import VChart from "vue-echarts";

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  BarChart,
  CanvasRenderer
]);

export default {
  name: "barStackChartForAnnual2021",
  components: {
    VChart
  },
  props: {
    data: {
      type: Object,
      default: () => ({
        tweet: [],
        media: []
      })
    },
    title: {
      type: String,
      default: ""
    },
    height: {
      type: [String, Number],
      default: "300px"
    },
  },
  data: () => ({
    option: {
      title: {top: 10, left: 'left', text: ''},
      tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}},
      legend: {},
      grid: {left: '3%', right: '4%', bottom: '3%', containLabel: true},
      xAxis: [{type: 'category', data: (Object.keys(new Array(24).fill(null)).map(time => time+'时'))}],
      yAxis: [{type: 'value'}],
      series: [
        {
          name: '推文',
          type: 'bar',
          data: [],
          emphasis: {
            focus: 'series'
          },
        },
        {
          name: '带图推文',
          type: 'bar',
          emphasis: {
            focus: 'series'
          },
          data: []
        },
      ]
    }
  }),
  computed: {
    computedOptions: function () {
      let tmpOption = this.option
      tmpOption.title.text = this.title
      tmpOption.series[0].data = this.data.tweet
      tmpOption.series[1].data = this.data.media
      return tmpOption
    }
  }
}
</script>

<style scoped>

</style>

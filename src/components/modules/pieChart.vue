<template>
  <div id="pie-chart">
    <el-skeleton :loading="!computedOptions.series[0].data.length" :rows="4" animated></el-skeleton>
    <v-chart v-if="computedOptions.series[0].data.length" :option="computedOptions" :style="{width: '100%', height: (typeof(height) === 'number' ? (height + 'px') : height)}" autoresize></v-chart>
  </div>
</template>

<script>
import * as echarts from 'echarts/core';
import { ToolboxComponent, LegendComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import VChart from "vue-echarts";

echarts.use([
  ToolboxComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout
]);
export default {
  name: "pieChart",
  components: {
    VChart
  },
  props: {
    chartData: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ""
    },
    height: {
      type: [String, Number],
      default: "300px"
    },
    nameWrapper: {
      type: Function,
      default: (x) => x
    }
  },
  data: () => ({
    option: {
      title: {top: 10, left: 'left', text: ''},
      tooltip: {},
      series: [
        {name: '', type: 'pie', radius: [0, 120], center: ['50%', '50%'], data: [], label: {formatter: '{b} ({d}%)'}}
      ]
    }
  }),
  computed: {
    computedOptions: function () {
      let tmpOption = this.option
      tmpOption.title.text = this.title
      tmpOption.series[0].name = this.title
      tmpOption.series[0].data = Object.keys(this.chartData).map(time => ({name: this.nameWrapper(time), value: this.chartData[time]}))
      return tmpOption
    }
  }
}
</script>

<style scoped>

</style>

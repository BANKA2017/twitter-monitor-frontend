<template>
  <div id="tmv2-chart">
    <el-skeleton :loading="!computedOptions.series.length" :rows="5" animated></el-skeleton>
    <!--<span v-if="title !== '' && generateSeries.length" class="text-muted mb-1"><small>{{ title }}</small></span>-->
    <v-chart v-if="computedOptions.series.length" :option="computedOptions" :style="{width: '100%', height: (typeof(chartHeight) === 'number' ? (chartHeight + 'px') : chartHeight)}" :update-options="setOption" autoresize></v-chart>
  </div>
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import { BarChart } from "echarts/charts";
import {
  TooltipComponent,
  LegendComponent,
  GridComponent,
  TitleComponent,
  //ToolboxComponent,
  //DataZoomComponent,
  //DataZoomInsideComponent,
  //DataZoomSliderComponent,
} from "echarts/components";
import VChart from "vue-echarts";

use([
  CanvasRenderer,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  TitleComponent,
  LineChart,
  BarChart,
  //ToolboxComponent,
  //DataZoomComponent,
  //DataZoomInsideComponent,
  //DataZoomSliderComponent,
]);
//import { VeLineChart, VeBarChart } from 've-charts'  // 引入单个图表

//Vue.component('VeLineChart', VeLineChart)
//Vue.component('VeBarChart', VeBarChart)

export default {
  name: "tmv2Chart",
  components: {
    VChart
  },
  props: {
    chartRows: {
      type: Array,
      default: () => ([])
    },
    sortLimit: {
      type: [Number, String],
      default: 0,
    },
    sortKey: {
      type: String,
      default: ""
    },
    labelMap: {
      type: Object,
      default: () => ({})
    },
    //legendName: {
    //  type: Object,
    //  default: () => ({})
    //},
    legendNotSelected: {
      type: Array,
      default: () => ([])
    },
    colors: {
      type: Array,
      default: () => (['#19d4ae', '#5ab1ef', '#fa6e86', '#ffb980', '#c4b4e4', '#0067a6', '#5ab1ef', '#d87a80'])
    },
    xAxisRotate: {
      type: [Number, String],
      default: 0
    },
    chartHeight: {
      type: [Number, String],
      default: '280px',
    },
    chartType: {
      type: String,
      default: "bar"
    },
    chartArea: {
      type: Boolean,
      default: false
    },
    yAxis: {
      type: [Object, Array],
      default: () => ([{type: 'value', scale: true}])
    },
    title: {
      type: String,
      default: '',
    },
    yAxisIndex: {
      type: Array,
      default: () => ([])
    },
    grid: {
      type: Object,
      default: () => ({
        left: '15%',
        right: '15%',
        bottom: '15%',
      })
    },
    setOption: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    options: {
      title: {text: '', padding: [30, 5]},// subtext: '', subtextStyle: {align: 'center'},},
      tooltip: {
        trigger: 'axis',
        //十字准星定位
        //axisPointer: {
        //  type: 'cross'
        //}
      },
      legend: {
        type: 'scroll',
        data: [],
        selected: {},
      },
      //toolbox: {
      //  feature: {
      //    dataZoom: {
      //      yAxisIndex: false
      //    },
      //    brush: {
      //      type: ['lineX', 'clear']
      //    }
      //  }
      //},
      //dataZoom: [
      //  {
      //    type: 'slider',
      //    start: 80,
      //    end: 100,
      //    xAxisIndex: [0],
      //  },
      //],
      grid: {},
      color: [],
      xAxis: {
        type: 'category',
        data: [],
        scale: true,
        boundaryGap: false,
      },
      yAxis: [],
      series: []
    }
  }),
  computed: {
    axisKeys: function () {
      if (Object.keys(this.labelMap).length > 0) {
        let keys = Object.keys(this.labelMap)
        return [keys.shift(), keys]
      } else if (this.chartRows.length === 0) {
        return ['', []]
      }
      let keys = Object.keys(this.chartRows[0])
      return [keys.shift(), keys]
    },
    axisData: function () {
      if (this.chartRows.length === 0) {
        return [[], {}]
      }
      let rows = this.chartRows
      rows = (this.sortKey !== '') ? rows.sort((a, b) => b[this.sortKey] - a[this.sortKey]) : rows;
      if (this.sortLimit !== 0) {
        rows = rows.slice(0, this.sortLimit)
      }
      let xAxisData = []
      let series = {}
      this.axisKeys[1].map(x => series[x] = [])
      rows.map(x => {
        xAxisData.push(x[this.axisKeys[0]])
        this.axisKeys[1].map(y => {
          series[y].push(x[y])
        })
      })
      return [xAxisData, series]
    },
    generateSeries: function () {
      let series = []
      let maxYAxisIndex = 0
      this.axisKeys[1].map((x, order) => {
        series.push({
          name: this.legendName[order],
          data: this.axisData[1][x],
          smooth: true,
          type: this.chartType,
          yAxisIndex: (this.yAxisIndex[order] ? this.yAxisIndex[order] : maxYAxisIndex),
          emphasis: {
            focus: 'series'
          },
          //整屏浮点, 病情有点严重
          //label: {
          //  show: true,
          //  position: 'top',
          //  moveOverlap: true,
          //}
        })
      })
      return series
    },
    legendName: function () {
      let tmpList = Object.values(this.labelMap)
      tmpList.shift()
      return tmpList
    },
    legendSelected: function () {
      let tmpNotSelectList = {}
      this.legendNotSelected.map(x => {
        tmpNotSelectList[this.legendName[x]] = false
      })
      return tmpNotSelectList
    },
    computedOptions: function () {
      let tmpOptions = this.options
      if (this.title) {
        tmpOptions.title.text = this.title
      }
      tmpOptions.legend.data = this.legendName
      tmpOptions.legend.selected = this.legendSelected
      tmpOptions.xAxis.data = this.axisData[0]
      tmpOptions.yAxis = this.yAxis
      tmpOptions.series = this.generateSeries
      tmpOptions.color = this.colors
      tmpOptions.grid = this.grid
      //chart.setOption(this.options)
      return tmpOptions
    }
  },
}
</script>

<style scoped>

</style>

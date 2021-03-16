<template>
  <div id="tmv2Chart">
    <span v-if="title !== '' && chart.chartData.measures.length" class="text-muted mb-1"><small>{{ title }}</small></span>
    <el-skeleton :loading="!chart.chartData.measures.length" :paragraph="{rows: 5}" active>
      <div :is="chartType"
          :color="colors"
          :data="chart.chartData"
           :height="typeof(chartHeight) === 'number' ? chartHeight : Number(chartHeight.replace(/[^0-9]+/, ''))"
          :settings="chart.chartSettings"
          :y-axis="yAxis"
          renderer="svg"
      ></div>
    </el-skeleton>
  </div>
</template>

<script>
import Vue from 'vue'
import VeCharts from 've-charts'

Vue.use(VeCharts)
//import { VeLineChart, VeBarChart } from 've-charts'  // 引入单个图表

//Vue.component('VeLineChart', VeLineChart)
//Vue.component('VeBarChart', VeBarChart)

export default {
  name: "tmv2Chart",
  props: {
    chartRows: {
      type: Array,
      default: () => {
        return []
      }
    },
    sortLimit: {
      type: [Number, String],
      default: 0,
    },
    sortKey: {
      type: String,
      default: ""
    },
    labelMap: Object,
    legendName: {
      type: Object,
      default: () => {
        return {}
      }
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
      default: () => 280,
    },
    chartType: {
      type: String,
      default: "ve-bar-chart"
    },
    chartArea: {
      type: Boolean,
      default: false
    },
    yAxis: {
      type: Object,
      default: () => ({type: 'value', scale: true})
    },
    title: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      chart: {
        chartHeight: this.chartHeight,
        chartData: {
          dimensions: {},
          measures: []
        },
        chartSettings: {
          smooth: true,
          area: this.chartArea,
          grid: {
            left: '3%',
            right: '10%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            axisLabel: {
              rotate: this.xAxisRotate
            }
          },
        },
      },
    }
  },
  watch: {
    "chartRows": function () {
      this.updateRows()
    }
  },
  mounted() {
    this.updateRows()
  },
  methods: {
    updateRows: function () {
      let rows = this.sortLimit > 0 ? this.chartRows.sort((a, b) => b[this.sortKey] - a[this.sortKey]).slice(0, this.sortLimit) : this.chartRows;
      if (rows.length === 0) {
        this.chart.chartData.measures = []
        return
      }
      let tmpData = {}
      let keys = Object.keys(rows[0])
      keys.map(v => tmpData[v] = {name: Object.keys(this.labelMap).indexOf(v) !== -1 ? this.labelMap[v] : v, data: []})//初步处理数据
      rows.map(x => keys.map(key => tmpData[key].data.push(x[key])))//处理所有数据
      tmpData = Object.values(tmpData)
      this.chart.chartData = {
        dimensions: tmpData.shift(),
        measures: tmpData
      }
    }
  }
}
</script>

<style scoped>

</style>

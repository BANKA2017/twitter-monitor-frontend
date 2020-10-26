<template>
    <div id="tmv2Chart">
        <div :is="chartType"
             :data="chart.chartData"
             :settings="chart.chartSettings"
             :extend="chart.chartOptions"
             :init-options="{renderer: 'svg', color: '#FFF'}"
             :height="chart.chartHeight"
             :colors="colors"
             :loading="!chart.chartData.rows.length"
        ></div>
    </div>
</template>

<script>
import Vue from 'vue'
import VeLine from 'v-charts/lib/line.common'
import VeHistogram from 'v-charts/lib/histogram.common'
import 'v-charts/lib/style.css'

Vue.component(VeLine.name, VeLine);
Vue.component(VeHistogram.name, VeHistogram);

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
    colors: Array,
    xAxisRotate: {
      type: [Number, String],
      default: 0
    },
    chartHeight: {
      type: String,
      default: "280px",
    },
    chartType: {
      type: String,
      default: "ve-histogram"
    },
    chartArea: {
      type: Boolean,
      default: false
    }
  },
        data() {
            return {
                chart: {
                  chartHeight: this.chartHeight,
                  chartData: {
                    columns: Object.keys(this.labelMap),
                    rows: []
                  },
                  chartSettings: {
                    labelMap: this.labelMap,
                    legendName: this.legendName,
                    scale: [true, true],
                    area: this.chartArea,
                  },
                    chartOptions: {
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
      if (this.sortLimit > 0) {
        return this.chart.chartData.rows = this.chartRows.sort((a, b) => b[this.sortKey] - a[this.sortKey]).slice(0, this.sortLimit);
      }
      this.chart.chartData.rows = this.chartRows;
    }
  }
}
</script>

<style scoped>

</style>

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
//import { Line } from '@antv/g2plot';

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
    },
    yAxis: {
      type: Object,
      default: () => ({type: 'value'})
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
                      yAxis: this.yAxis
                    },
                },
            }
        },
  watch: {
    "chartRows": function () {
      this.updateRows()
    }
  },
  //computed: {
  //  rows: function () {
  //    let tmpRows = []
  //    this.chartRows.map(x => {
  //      let keys = Object.keys(x)
  //      keys.slice(1).map(y => {
  //        tmpRows.push({
  //          xField: x[y],
  //          yField: x[keys[1]],
  //          seriesField: this.labelMap[y]
  //        })
  //      })
  //    })
  //    console.log(tmpRows)
  //    return tmpRows
  //  }
  //},
  mounted() {
    this.updateRows()
    //现在只想把饿了么扬了
    //fetch('https://gw.alipayobjects.com/os/bmw-prod/55424a73-7cb8-4f79-b60d-3ab627ac5698.json')
    //    .then((res) => res.json())
    //    .then((data) => {
    //      const line = new Line('g2test', {
    //        data,
    //        xField: 'year',
    //        yField: 'value',
    //        seriesField: 'category',
    //        xAxis: {
    //          type: 'time',
    //        },
    //        yAxis: {
    //          label: {
    //            // 数值格式化为千分位
    //            formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
    //          },
    //        },
    //      });
    //      line.render();
    //    });

    //const chart = new Line("g2test", {
    //  data: [],
    //  xField: 'xField',
    //  yField: 'yField',
    //  seriesField: 'seriesField',
    //  //yAxis: {
    //  //  label: {
    //  //    // 数值格式化为千分位
    //  //    formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
    //  //  },
    //  //},
    //  color: this.colors,
    //})
    //chart.render()
  },
  methods: {
    updateRows: function () {
      if (this.sortLimit > 0) {
        return this.chart.chartData.rows = this.chartRows.sort((a, b) => b[this.sortKey] - a[this.sortKey]).slice(0, this.sortLimit);
      }
      this.chart.chartData.rows = this.chartRows;
      //chart.changeData()
    }
  }
}
</script>

<style scoped>

</style>

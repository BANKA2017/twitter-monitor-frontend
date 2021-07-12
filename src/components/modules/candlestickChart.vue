<template>
  <div id="candlestick-chart">
    <el-skeleton :loading="!options.series[0].data.length" :rows="5" animated></el-skeleton>
    <span v-if="title !== '' && options.series[0].data.length" class="text-muted mb-1"><small>{{ title }}</small></span>
    <v-chart v-if="options.series[0].data.length" :option="options" :update-options="setOption" :style="{width: '100%', height: (typeof(height) === 'number' ? (height + 'px') : height)}" autoresize></v-chart>
  </div>
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { CandlestickChart } from "echarts/charts";
import {
  TooltipComponent,
  LegendComponent,
  GridComponent,
  MarkPointComponent,
  MarkLineComponent,
} from "echarts/components";
import VChart from "vue-echarts";

use([
  CanvasRenderer,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  CandlestickChart,
  MarkPointComponent,
  MarkLineComponent,
]);
export default {
  name: "candlestickChart",
  components: {
    VChart
  },
  props: {
    height: {
      type: [String, Number],
      default: "280px"
    },
    title: {
      type: String,
      default: ""
    },
    dataArray: {
      type: Array,
      default: () => ([])
    },
    xAxisData: {
      type: Array,
      default: () => ([])
    },
    setOption: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    options: {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['日K']
      },
      grid: {
        left: '16%',
        right: '15%',
        bottom: '17%'
      },
      xAxis: {
        type: 'category',
        data: [],
        scale: true,
        boundaryGap: false,
        axisLine: {onZero: false},
        splitLine: {show: false},
        splitNumber: 20,
        min: 'dataMin',
        max: 'dataMax'
      },
      yAxis: {
        scale: true,
        splitArea: {
          show: true
        }
      },
      series: [
        {
          name: '日K',
          type: 'candlestick',
          data: [],
          itemStyle: {
            color: '#ec0000',
            color0: '#00da3c',
            borderColor: '#ec0000',//'#8a0000',
            borderColor0: '#00da3c',//'#008f28'
          },
          markPoint: {
            label: {
              normal: {
                formatter: function (param) {
                  return param != null ? Math.round(param.value) : '';
                }
              }
            },
            data: [
              {
                name: 'highest value',
                type: 'max',
                valueDim: 'highest'
              },
              {
                name: 'lowest value',
                type: 'min',
                valueDim: 'lowest'
              },
              {
                name: 'average value on close',
                type: 'average',
                valueDim: 'close'
              }
            ],
            tooltip: {
              formatter: function (param) {
                return param.name + '<br>' + (param.data.coord || '');
              }
            }
          },
          markLine: {
            symbol: ['none', 'none'],
            data: [
              [
                {
                  name: 'from lowest to highest',
                  type: 'min',
                  valueDim: 'lowest',
                  symbol: 'circle',
                  symbolSize: 10,
                  label: {
                    show: false
                  },
                  emphasis: {
                    label: {
                      show: false
                    }
                  }
                },
                {
                  type: 'max',
                  valueDim: 'highest',
                  symbol: 'circle',
                  symbolSize: 10,
                  label: {
                    show: false
                  },
                  emphasis: {
                    label: {
                      show: false
                    }
                  }
                }
              ],
              {
                name: 'min line on close',
                type: 'min',
                valueDim: 'close'
              },
              {
                name: 'max line on close',
                type: 'max',
                valueDim: 'close'
              }
            ]
          }
        },

      ]
    }
  }),
  watch: {
    "dataArray": function() {
        this.draw()
    },
  },
  mounted: function () {
    this.draw();
  },
  methods: {
    draw: function () {
      if (this.dataArray.length > 0) {
        let tmpOptions = this.options
        tmpOptions.xAxis.data = this.xAxisData
        tmpOptions.series[0].data = this.dataArray
        this.options = tmpOptions
      }
    }
  }
}
</script>

<style scoped>

</style>

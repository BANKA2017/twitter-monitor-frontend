<template>
  <div id="candlestick-chart">
    <el-skeleton :loading="!computedOptions.series[0].data.length" :rows="5" animated></el-skeleton>
    <span v-if="title !== '' && computedOptions.series[0].data.length" class="text-muted mb-1"><small>{{ title }}</small></span>
    <v-chart v-if="computedOptions.series[0].data.length" :option="computedOptions" :style="{width: '100%', height: (typeof(height) === 'number' ? (height + 'px') : height)}" :update-options="setOption" autoresize></v-chart>
  </div>
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { CandlestickChart, LineChart, } from "echarts/charts";
import {
  TooltipComponent,
  LegendComponent,
  GridComponent,
  MarkPointComponent,
  MarkLineComponent,
  ToolboxComponent,
  DataZoomComponent,
  DataZoomInsideComponent,
  DataZoomSliderComponent,
} from "echarts/components";
import VChart from "vue-echarts";

use([
  CanvasRenderer,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  CandlestickChart,
  LineChart,
  MarkPointComponent,
  MarkLineComponent,
  ToolboxComponent,
  DataZoomComponent,
  DataZoomInsideComponent,
  DataZoomSliderComponent,
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
    },
    zoom: {
      type: Boolean,
      default: false
    },
    ma_line: {
      type: Boolean,
      default: false
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
  computed: {
    computedOptions: function () {
      let tmpOptions = this.options
      tmpOptions.legend.data[0] = this.$t("candlestick_chart.chart.candle_sticks")
      tmpOptions.series[0].name = this.$t("candlestick_chart.chart.candle_sticks")
      tmpOptions.xAxis.data = this.xAxisData
      tmpOptions.series[0].data = this.dataArray
      if (this.zoom) {
        tmpOptions.toolbox = {
          feature: {
            dataZoom: {
              yAxisIndex: false
            },
            brush: {
              type: ['lineX', 'clear']
            }
          }
        }
        tmpOptions.dataZoom = [
          {
            type: 'slider',
            start: 80,
            end: 100,
            xAxisIndex: [0],
          },
        ]
      }
      if (this.ma_line) {
        //ma
        [5, 10, 20, 30].forEach((x, order) => {
              if (tmpOptions.series[order + 1] ) {
                tmpOptions.series[order + 1].data = this.calculateMA(x, this.dataArray)
              } else {
                tmpOptions.legend.data.push('MA' + x)
                tmpOptions.series.push({
                  name: 'MA' + x,
                  type: 'line',
                  data: this.calculateMA(x, this.dataArray),
                  smooth: true,
                  lineStyle: {
                    opacity: 0.5
                  }}
                )}
            }
        )
      }
      return tmpOptions
    }
  },
  methods: {
    calculateMA: function (dayCount, data) {
      let result = [];
      for (let i = 0, len = data.length; i < len; i++) {
        if (i < dayCount) {
          result.push('-');
          continue;
        }
        let sum = 0;
        for (let j = 0; j < dayCount; j++) {
          sum += data[i - j][1];
        }
        result.push(+(sum / dayCount).toFixed(3));
      }
      return result;
    }
  }
}
</script>

<style scoped>

</style>

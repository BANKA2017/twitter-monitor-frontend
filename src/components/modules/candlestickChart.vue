<template>
  <div id="candlestick-chart">
    <span v-if="title !== '' && dataArray.length" class="text-muted mb-1"><small>{{ title }}</small></span>
    <div ref="candlestick" :style="{width: '100%',height: height}"></div>
  </div>
</template>

<script>
let candle
export default {
  name: "candlestickChart",
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
            borderColor: '#8a0000',
            borderColor0: '#008f28'
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
    this.initChart();
  },
  methods: {
    initChart: function () {
      let echarts = require('echarts')
      //require('echarts/lib/component/toolbox')
      //require('echarts/lib/component/grid')
      //require('echarts/lib/component/markLine')
      //require('echarts/lib/export/candlestick')
      candle = echarts.init(this.$refs.candlestick)
      this.draw()
      window.addEventListener("resize",function(){
        candle.resize();
      });
    },
    draw: function () {
      if (this.dataArray.length > 0) {
        this.options.xAxis.data = this.xAxisData
        this.options.series[0].data = this.dataArray
        candle.setOption(this.options)
      }
    }
  }
}
</script>

<style scoped>

</style>

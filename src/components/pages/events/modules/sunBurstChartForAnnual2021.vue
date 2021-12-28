<template>
  <div id="sun-burst-chart-for-annual-2021">
    <el-skeleton :loading="!computedOptions.series.data.length" :rows="4" animated></el-skeleton>
    <v-chart v-if="computedOptions.series.data.length" :option="computedOptions" :style="{width: '100%', height: (typeof(height) === 'number' ? (height + 'px') : height)}" autoresize></v-chart>
  </div>
</template>

<script>
import * as echarts from 'echarts/core';
import { TitleComponent } from 'echarts/components';
import { SunburstChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import VChart from "vue-echarts";

echarts.use([TitleComponent, SunburstChart, CanvasRenderer]);
export default {
  name: "sunBurstChartForAnnual2021",
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
      default: "820px"
    },
  },
  data: () => ({
    option: {
      title: {text: '', subtext: '', subtextStyle: {align: 'center'},},
      tooltip: {},
      series: {
        type: 'sunburst',
        data: [],
        radius: [0, '95%'],
        sort: undefined,
        emphasis: {
          focus: 'ancestor'
        },
        levels: [
          {},
          {
            r0: '10%',
            r: '27%',
            itemStyle: {
              borderWidth: 2
            },
            label: {
              align: 'right',
              //color: '#FFFFFF'
              //rotate: 'tangential'
            }
          },
          {
            r0: '27%',
            r: '52%',
            label: {
              align: 'right'
            }
          },
          {
            r0: '52%',
            r: '54%',
            label: {
              position: 'outside',
              padding: 3,
              silent: false
            },
            itemStyle: {
              borderWidth: 3
            }
          }
        ]
      }
    }
  }),
  computed: {
    computedOptions: function () {
      let tmpOption = this.option
      tmpOption.title.text = this.title
      tmpOption.title.subtext = this.subtitle
      tmpOption.series.data = this.data
      return tmpOption
    }
  }
}
</script>

<style scoped>

</style>

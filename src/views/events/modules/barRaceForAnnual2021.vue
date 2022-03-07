<template>
  <div id="bar-race-for-annual2021">
    <el-skeleton :loading="!computedOptions.options.length" :rows="4" animated></el-skeleton>
    <v-chart v-if="computedOptions.options.length" :option="computedOptions" :style="{width: '100%', height: (typeof(height) === 'number' ? (height + 'px') : height)}" autoresize></v-chart>
  </div>
</template>

<script>
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  //TooltipComponent,
  TimelineComponent,
  GraphicComponent,
  GridComponent
} from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  //TooltipComponent,
  TimelineComponent,
  GraphicComponent,
  GridComponent,
  BarChart,
  CanvasRenderer
]);
import VChart from "vue-echarts";
export default {
  name: "barRaceForAnnual2021",
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
    colors: {
      type: Object,
      default: () => ({})
    },
    labelMap: {
      type: Object,
      default: () => ({})
    },
    height: {
      type: [String, Number],
      default: "700px"
    },
  },
  data: () => ({
    dateList: [],
    updateFrequency: 500,
    option: {
      baseOption: {
        title: {top: 0, left: 'left', text: '', subtext: 'Twitter Monitor 出品'},
        timeline: {
          axisType: 'category',
          autoPlay: false,
          playInterval: 500,
          loop: false,
          data: [],
          label: {
            formatter: function (s) {
              return s
            }
          }
        },
        tooltip: {},
        grid: {
          top: 50,
          bottom: 70,
          left: 110,
          right: 80
        },
        //toolbox: {
        //  show: true,
        //  feature: {
        //    restore: {},
        //  }
        //},
        xAxis: {
          min: 0,
          max: 'dataMax',
          type: 'value',
          name: '关注增量'
        },
        yAxis: [{
          max: 25,
          type: 'category',
          inverse: true,
          axisLabel: {
            show: true,
            fontSize: 14,
            interval: 0
          },
        }],
        series: [
          {
            name: '关注增量',
            realtimeSort: true,
            seriesLayoutBy: 'column',
            type: 'bar',
            label: {
              show: true,
              position: 'right',
              valueAnimation: true
            }
          }
        ],
      },
      options: []
    }
  }),
  computed: {
    computedOptions: function () {
      let tmpOption = this.option
      let tmpSeries = []
      //let that = this
      this.data.map(dateData => {
        this.dateList.push(dateData.date)
        let tmpSeriesItem = {series: [{data: []},], graphic: {elements: [{type: 'text', right: 130, bottom: 70, style: {text: dateData.date, font: 'bolder 50px monospace', fill: 'rgba(100, 100, 100, 0.25)'}, z: 100}]}}
        Object.keys(dateData).map(name => {
          if (name !== 'date') {
            tmpSeriesItem.series[0].data.push({value: dateData[name], name: this.labelMap[name], itemStyle: { color: this.colors[name] },})
          }
        })
        tmpSeries.push(tmpSeriesItem)
      })
      tmpOption.baseOption.title.text = this.title
      tmpOption.baseOption.timeline.data = this.dateList
      tmpOption.baseOption.yAxis[0].data = Object.keys(this.data[0]).map(name => this.labelMap[name])
      tmpOption.baseOption.yAxis[0].data.shift()//去除 date
      tmpOption.options = tmpSeries
      //tmpOption.series.data = this.data
      return tmpOption
    }
  },
}
</script>

<style scoped>

</style>

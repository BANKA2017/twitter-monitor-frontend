<template>
  <div id="bar-race-for-annual2021">
    <el-skeleton :loading="!option.dataset.source.length" :rows="4" animated></el-skeleton>
    <v-chart v-if="option.dataset.source.length" :option="option" :style="{width: '100%', height: (typeof(height) === 'number' ? (height + 'px') : height)}" autoresize></v-chart>
  </div>
</template>

<script>
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  //TooltipComponent,
  DatasetComponent,
  GraphicComponent,
  GridComponent
} from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  //TooltipComponent,
  DatasetComponent,
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
    dataSet: [],
    dateList: [],
    updateFrequency: 500,
    option: {
      title: {top: 0, left: 'left', text: ''},
      grid: {
        top: 25,
        bottom: 30,
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
        axisLabel: {
          formatter: function (n) {
            return Math.round(n) + '';
          }
        }
      },
      dataset: {
        source: []
      },
      yAxis: {
        max: 30,
        type: 'category',
        inverse: true,
        axisLabel: {
          show: true,
          fontSize: 14,
          //formatter: function (value) {
          //  return value + '{flag|' + getFlag(value) + '}';
          //},
          rich: {
            flag: {
              fontSize: 25,
              padding: 5
            }
          }
        },
        animationDuration: 300,
        animationDurationUpdate: 300
      },
      series: [
        {
          realtimeSort: true,
          seriesLayoutBy: 'column',
          type: 'bar',
          itemStyle: {
            //color: ''
          },
          encode: {
            x: 0,
            y: 1
          },
          label: {
            show: true,
            precision: 1,
            position: 'right',
            valueAnimation: true,
            fontFamily: 'monospace'
          }
        }
      ],
      // Disable init animation.
      animationDuration: 0,
      animationDurationUpdate: 500,
      animationEasing: 'linear',
      animationEasingUpdate: 'linear',
      graphic: {
        elements: [
          {
            type: 'text',
            right: 130,
            bottom: 60,
            style: {
              text: '2021-01-01',
              font: 'bolder 40px monospace',
              fill: 'rgba(100, 100, 100, 0.25)'
            },
            z: 100
          }
        ]
      }
    }
  }),
  computed: {
    //computedOptions: function () {
    //  let tmpOption = this.option
    //  let tmpDataSet = []
    //  this.data.map(dateData => {
    //    Object.keys(dateData).map(name => {
    //      if (name !== 'date') {
    //        tmpDataSet.push([dateData[name], this.labelMap[name], name, dateData.date])
    //      }
    //    })
    //  })
    //  tmpOption.title.text = this.title
    //  //tmpOption.series.data = this.data
    //  return {tmpOption, tmpDataSet}
    //}
  },
  mounted: function () {
    let tmpOption = this.option
    let tmpDataSet = []
    let that = this
    this.data.map(dateData => {
      this.dateList.push(dateData.date)
      Object.keys(dateData).map(name => {
        if (name !== 'date') {
          tmpDataSet.push([dateData[name], this.labelMap[name], name, dateData.date])
        }
      })
    })
    tmpOption.title.text = this.title

    this.dataSet = tmpDataSet
    tmpOption.dataset.source = this.dataSet.filter(function (d) {
      return d[3] === that.dateList[0];
    })
    tmpOption.series[0].itemStyle.color = function (param) {
      return that.colors[param.value[2]];
    }

    this.option = tmpOption

    for (let i = 0; i < this.dateList.length - 1; ++i) {
      setTimeout(() => this.updateDate(this.dateList[i]), i * this.updateFrequency)
    }
  },
  methods: {
    updateDate: function (date) {
      let tmpOption = this.option
      tmpOption.series[0].data = this.dataSet.filter(function (d) {
        return d[3] === date
      })
      tmpOption.graphic.elements[0].style.text = date
      this.option = tmpOption
    }
  }
}
</script>

<style scoped>

</style>

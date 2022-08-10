<template>
  <div id="bar-race-chart">
    <el-skeleton :loading="!computedOptions.options.length" :rows="4" animated></el-skeleton>
    <v-chart v-if="computedOptions.options.length" :option="computedOptions" :style="{width: '100%', height: (typeof(height) === 'number' ? (height + 'px') : height)}" autoresize></v-chart>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  //TooltipComponent,
  TimelineComponent,
  GraphicComponent,
  GridComponent, TitleComponentOption, GridComponentOption
} from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import _ from 'lodash'

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
import {computed, PropType, reactive} from "vue";
import {TimelineComponentOption, XAXisComponentOption, YAXisComponentOption} from "echarts";

const props = defineProps({
  data: {
    type: Array as PropType<{[index: string]: number | string; date: string; }[]>,
    default: () => ([])
  },
  title: {
    type: String,
    default: ""
  },
  colors: {
    type: Object as PropType<{ [p in string]: string }>,
    default: () => ({})
  },
  labelMap: {
    type: Object as PropType<{[p in string]: string}>,
    default: () => ({})
  },
  height: {
    type: [String, Number],
    default: "800px"
  },
})

interface BarRaceOptions {
  series: {data: {value: number | string; name: string; itemStyle: { color: string }}[]}[];
  graphic: { elements: {type: string; right: number; bottom: number; style: {text: string; font: string; fill: string}; z: number}[] }
}

const state = reactive<{
  dateList: string[]
  updateFrequency: number
  option: {
    baseOption: {
      title: TitleComponentOption
      timeline: TimelineComponentOption
      tooltip: {}
      grid: GridComponentOption
      xAxis: XAXisComponentOption
      yAxis: { max: number | string; type: string; inverse: boolean; data: string[]; axisLabel: { show: boolean; fontSize: number; interval: number; } }[]
      series: {
        name: string
        realtimeSort: boolean
        seriesLayoutBy: string
        type: string
        label: {
          show: boolean
          position: string
          valueAnimation: boolean
        }
      }[]
    },
    options: BarRaceOptions[]
  }
}>({
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
          formatter: (s: any) => s
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
        max: 'dataMax',
        type: 'category',
        inverse: true,
        data: [],
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
})

const computedOptions = computed(() => {
  let tmpOption = _.cloneDeep(state.option)
  let tmpSeries: BarRaceOptions[] = []
  state.dateList = []
  //let that = this
  props.data.map(dateData => {
    state.dateList.push(dateData.date)
    tmpSeries.push({series: [{
      data: [...Object.keys(dateData).filter(name => name !== 'date').map((name: string) => ({value: dateData[name], name: props.labelMap[name], itemStyle: {color: props.colors[name]},}))]}],
      graphic: {elements: [{type: 'text', right: 130, bottom: 70, style: {text: dateData.date, font: 'bolder 50px monospace', fill: 'rgba(100, 100, 100, 0.25)'}, z: 100}]}
    })})
  tmpOption.baseOption.title.text = props.title
  tmpOption.baseOption.timeline.data = state.dateList
  //console.log(Object.keys(props.data[0]).filter(x => x !== 'date'))
  tmpOption.baseOption.yAxis[0].data = Object.keys(props.data[0]).filter(x => x !== 'date').map(name => props.labelMap[name] ? props.labelMap[name] : '')//去除 date
  tmpOption.options = tmpSeries
  //tmpOption.series.data = this.data
  state.option = tmpOption
  return tmpOption
})

</script>

<style scoped>

</style>

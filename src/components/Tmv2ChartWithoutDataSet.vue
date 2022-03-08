<template>
  <div id="tmv2-chart">
    <el-skeleton :loading="!computedOptions.series.length" :rows="5" animated>
      <v-chart v-if="computedOptions.series.length" :option="computedOptions" :style="{width: '100%', height: (typeof(chartHeight) === 'number' ? (chartHeight + 'px') : chartHeight)}" :update-options="setOption" autoresize></v-chart>
    </el-skeleton>
  </div>
</template>

<script setup lang="ts">
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import { BarChart } from "echarts/charts";
import {
  TooltipComponent,
  LegendComponent,
  GridComponent,
  TitleComponent,
  //ToolboxComponent,
  //DataZoomComponent,
  //DataZoomInsideComponent,
  //DataZoomSliderComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import {computed, PropType, reactive} from "vue";
//import {
//  GridOption,
//  LegendOption, SeriesOption,
//  TitleOption,
//  TooltipOption,
//  XAXisOption,
//  YAXisOption
//} from "echarts/types/dist/shared";

use([
  CanvasRenderer,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  TitleComponent,
  LineChart,
  BarChart,
  //ToolboxComponent,
  //DataZoomComponent,
  //DataZoomInsideComponent,
  //DataZoomSliderComponent,
]);
//import { VeLineChart, VeBarChart } from 've-charts'  // 引入单个图表

//Vue.component('VeLineChart', VeLineChart)
//Vue.component('VeBarChart', VeBarChart)

const props = defineProps({
  chartRows: {
    type: Array as PropType<{ [p: string]: any }[]>,//TODO fix type
    default: () => ([])
  },
  sortLimit: {
    type: [Number, String],
    default: 0,
  },
  sortKey: {
    type: String,
    default: ""
  },
  labelMap: {
    type: Object as PropType<{[p: string]: string}>,
    default: () => ({})
  },
  //legendName: {
  //  type: Object,
  //  default: () => ({})
  //},
  legendNotSelected: {
    type: Array as PropType<number[]>,
    default: () => ([])
  },
  colors: {
    type: Array as PropType<string[]>,
    default: () => (['#19d4ae', '#5ab1ef', '#fa6e86', '#ffb980', '#c4b4e4', '#0067a6', '#5ab1ef', '#d87a80'])
  },
  xAxisRotate: {
    type: [Number, String],
    default: 0
  },
  chartHeight: {
    type: [Number, String],
    default: '280px',
  },
  chartType: {
    type: String,// as PropType<SeriesOption["type"]>,
    default: "bar"
  },
  chartArea: {
    type: Boolean,
    default: false
  },
  yAxis: {
    type: [Object, Array],
    default: () => ([{type: 'value', scale: true}])
  },
  title: {
    type: String,
    default: '',
  },
  yAxisIndex: {
    type: Array as PropType<number[]>,
    default: () => ([])
  },
  grid: {
    type: Object as PropType<{ [p: string]: string }>,
    default: () => ({
      left: '15%',
      right: '15%',
      bottom: '15%',
    })
  },
  setOption: {
    type: Object,
    default: () => ({})
  }
})

const state = reactive<{
  options: {
    title: any//TitleOption
    tooltip: any//TooltipOption
    legend: any//LegendOption
    grid: any//GridOption
    color: string[]//TODO fix
    xAxis: any//TODO fix
    yAxis: any//TODO fix
    series: any//TODO fix
  }
}>({
  options: {
    title: {text: '', padding: [30, 5]},// subtext: '', subtextStyle: {align: 'center'},},
    tooltip: {
      trigger: 'axis',
      //十字准星定位
      //axisPointer: {
      //  type: 'cross'
      //}
    },
    legend: {
      type: 'scroll',
      data: [],
      selected: {},
    },
    //toolbox: {
    //  feature: {
    //    dataZoom: {
    //      yAxisIndex: false
    //    },
    //    brush: {
    //      type: ['lineX', 'clear']
    //    }
    //  }
    //},
    //dataZoom: [
    //  {
    //    type: 'slider',
    //    start: 80,
    //    end: 100,
    //    xAxisIndex: [0],
    //  },
    //],
    grid: {},
    color: [],
    xAxis: {
      type: 'category',
      data: [],
      scale: true,
      boundaryGap: false,
    },
    yAxis: [],
    series: []
  }
})

const axisKeys = computed((): [string, string[]] => {
  if (Object.keys(props.labelMap).length > 0) {
    let keys = Object.keys(props.labelMap)
    return [String(keys.shift()), keys]
  } else if (props.chartRows.length === 0) {
    return ['', []]
  }
  let keys = Object.keys(props.chartRows[0])
  return [String(keys.shift()), keys]
})

const axisData = computed((): [string[], {[p: string]: string[]}] => {
  if (props.chartRows.length === 0) {
    return [[], {}]
  }
  let rows = props.chartRows.slice()
  rows = (props.sortKey !== '') ? rows.sort((a, b) => b[props.sortKey] - a[props.sortKey]) : rows;
  if (props.sortLimit !== 0) {
    rows = rows.slice(0, Number(props.sortLimit))
  }
  let xAxisData: string[] = []
  let series: {[p: string]: string[]} = {}
  axisKeys.value[1].map(x => {
    series[x] = []
  })
  rows.map(x => {
    xAxisData.push(x[axisKeys.value[0]])
    axisKeys.value[1].map(y => {
      series[y].push(x[y])
    })
  })
  return [xAxisData, series]
})

const legendName = computed((): string[] => {
  let tmpList = Object.values(props.labelMap)
  tmpList.shift()
  return tmpList
})

const generateSeries = computed(() => {
  let series: { [p: string]: any }[] = []//TODO fix type
  let maxYAxisIndex = 0
  axisKeys.value[1].map((x, order) => {
    series.push({
      name: legendName.value[order],
      data: axisData.value[1][x],
      smooth: true,
      type: props.chartType,
      yAxisIndex: (props.yAxisIndex[order] ? props.yAxisIndex[order] : maxYAxisIndex),
      emphasis: {
        focus: 'series'
      },
      //整屏浮点, 病情有点严重
      //label: {
      //  show: true,
      //  position: 'top',
      //  moveOverlap: true,
      //}
    })
  })
  return series
})

const legendSelected = computed(() => {
  let tmpNotSelectList: {[p: string]: boolean} = {}
  props.legendNotSelected.map(x => {
    tmpNotSelectList[legendName.value[x]] = false
  })
  return tmpNotSelectList
})
const computedOptions = computed(() => {
  let tmpOptions = state.options
  if (props.title) {
    tmpOptions.title.text = props.title
  }
  tmpOptions.legend.data = legendName.value
  tmpOptions.legend.selected = legendSelected.value
  tmpOptions.xAxis.data = axisData.value[0]
  tmpOptions.yAxis = props.yAxis
  tmpOptions.series = generateSeries.value
  tmpOptions.color = props.colors
  tmpOptions.grid = props.grid
  //chart.setOption(this.options)
  return tmpOptions
})
</script>

<style scoped>

</style>

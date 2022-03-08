<template>
  <div id="tmv2-chart">
    {{computedOptions}}
    <!--<el-skeleton :loading="!computedOptions.series.length" :rows="5" animated>
      <v-chart v-if="computedOptions.series.length" :option="computedOptions" :style="{width: '100%', height: (typeof(chartHeight) === 'number' ? (chartHeight + 'px') : chartHeight)}" :update-options="setOption" autoresize></v-chart>
    </el-skeleton>-->
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
  DatasetComponent
} from "echarts/components";
import VChart from "vue-echarts";
import {computed, Prop, PropType, reactive} from "vue";
import {LegacyChart} from "@/type/Content";
import {
  DatasetOption,
  GridOption,
  LegendOption, SeriesOption,
  TitleOption,
  TooltipOption,
  XAXisOption,
  YAXisOption
} from "echarts/types/dist/shared";
use([
  CanvasRenderer,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  TitleComponent,
  LineChart,
  BarChart,
]);

const props = defineProps({
  dataset: {
    type: Array as PropType<(string | number)[][]>,
    default: () => []
  },
  chartHeight: {
    type: [Number, String],
    default: '280px',
  },
  title: {
    type: String,
    default: '',
  },
  labelMap: {
    type: Object as PropType<{[p: string]: string}>,
    default: () => ({})
  },
  legendNotSelected: {
    type: Array as PropType<number[]>,
    default: () => ([])
  },
  colors: {
    type: Array as PropType<string[]>,
    default: () => (['#19d4ae', '#5ab1ef', '#fa6e86', '#ffb980', '#c4b4e4', '#0067a6', '#5ab1ef', '#d87a80'])
  },
  grid: {
    type: Object as PropType<{ [p: string]: string }>,
    default: () => ({
      left: '15%',
      right: '15%',
      bottom: '15%',
    })
  },
  yAxis: {
    type: Object as PropType<YAXisOption>,
    default: () => ([{type: 'value', scale: true}])
  },
  yAxisIndex: {
    type: Array as PropType<number[]>,
    default: () => ([])
  },
  setOption: {
    type: Object,
    default: () => ({})
  },
  chartType: {
    type: String as PropType<SeriesOption["type"]>,
    default: "bar"
  },
})

const state = reactive<{
  options: {
    title: TitleOption
    tooltip: TooltipOption
    legend: LegendOption
    grid: GridOption
    color: string[]
    xAxis: XAXisOption
    yAxis: YAXisOption
    dataset: DatasetOption
    series: { type: SeriesOption["type"] }[]
  }
}>({
  options: {
    title: {text: '', padding: [30, 5]},
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      type: 'scroll',
      data: [],
      selected: {},
    },
    grid: {},
    color: [],
    xAxis: {
      type: 'category',
      scale: true,
    },
    dataset :{
      source: []
    },
    yAxis: {},
    series: []
  }
})
const legendName = computed((): string[] => {
  let tmpList = Object.values(props.labelMap)
  tmpList.shift()
  return tmpList
})
const generateSeries = computed(() => {
  let tmpSeries: { type: SeriesOption["type"] }[] = []
  legendName.value.map(() => {
    tmpSeries.push({type: props.chartType})
  })
  return tmpSeries
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
  //tmpOptions.xAxis = axisData.value[0]
  tmpOptions.yAxis = props.yAxis
  tmpOptions.dataset.source = props.dataset
  tmpOptions.color = props.colors
  tmpOptions.grid = props.grid
  tmpOptions.series = generateSeries.value
  //chart.setOption(this.options)
  return tmpOptions
})

</script>

<style scoped>

</style>
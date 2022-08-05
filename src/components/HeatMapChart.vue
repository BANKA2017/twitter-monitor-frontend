<template>
  <div id="heat-map-chart">
    <el-skeleton :loading="!computedOptions.series.data.length" :rows="4" animated></el-skeleton>
    <v-chart v-if="computedOptions.series.data.length" :option="computedOptions" :style="{width: '100%', height: (typeof(height) === 'number' ? (height + 'px') : height)}" autoresize></v-chart>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  CalendarComponent,
  TooltipComponent,
  VisualMapComponent, TitleComponentOption, VisualMapComponentOption
} from 'echarts/components';
import { HeatmapChart } from 'echarts/charts';

echarts.use([
  TitleComponent,
  CalendarComponent,
  TooltipComponent,
  VisualMapComponent,
  HeatmapChart,
]);
import VChart from "vue-echarts";
import {computed, PropType, reactive} from "vue";
import {CalendarComponentOption} from "echarts";

const props = defineProps({
  data: {
    type: Array as PropType<[string, number][]>,
    default: () => ([])
  },
  title: {
    type: String,
    default: ""
  },
  year: {
    type: [Number, String],
    default: (new Date()).getFullYear()
  },
  height: {
    type: [String, Number],
    default: "220px"
  },
})

const state = reactive<{
  option: {
    title: TitleComponentOption
    tooltip: {}
    visualMap: VisualMapComponentOption
    calendar: CalendarComponentOption
    series: {
      type: string
      coordinateSystem: string
      data: [string, number][]
    }
  }
}>({
  option: {
    title: {top: 30, left: 'center', text: ''},
    tooltip: {},
    visualMap: {min: 0, max: 10, calculable: true, orient: 'horizontal', left: 'center', top: 65, type: 'continuous'},
    calendar: {top: 120, left: 30, right: 30, cellSize: ['auto', 13], range: '0', itemStyle: {borderWidth: 0.5}, yearLabel: { show: false }},
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: []
    }
  }
})

const computedOptions = computed(() => {
  let tmpOption = state.option
  let tmpMax = 0, tmpMin = 10000
  props.data.map(singleData => {
    tmpMax = singleData[1] > tmpMax ? singleData[1] : tmpMax
    tmpMin = singleData[1] < tmpMin ? singleData[1] : tmpMin
  })
  tmpOption.visualMap.max = tmpMax + 10 - tmpMax % 10
  tmpOption.visualMap.min = tmpMin - tmpMin % 10
  tmpOption.calendar.range = props.year.toString()
  tmpOption.title.text = props.title
  tmpOption.series.data = props.data
  return tmpOption
})
</script>

<style scoped>

</style>

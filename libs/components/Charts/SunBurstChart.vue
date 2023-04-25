<template>
  <div id="sun-burst-chart">
    <el-skeleton :loading="!computedOptions.series.data.length" :rows="4" animated></el-skeleton>
    <v-chart v-if="computedOptions.series.data.length" :option="computedOptions" :style="{width: '100%', height: (typeof(height) === 'number' ? (height + 'px') : height)}" autoresize></v-chart>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts/core';
import {TitleComponent, TitleComponentOption, TooltipComponentOption} from 'echarts/components';
import { SunburstChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import VChart from "vue-echarts";
import {computed, PropType, reactive} from "vue";
import {sunBurstType} from "../../types/Content";
import {SunburstSeriesOption} from "echarts";

echarts.use([TitleComponent, SunburstChart, CanvasRenderer]);

const props = defineProps({
  data: {
    type: Array as PropType<sunBurstType[]>,
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
    default: "900px"
  },
  levels: {
    type: Array as PropType<SunburstSeriesOption["levels"]>,
    default: []
  }
})
const state = reactive<{
  option: {
    title: TitleComponentOption
    tooltip: TooltipComponentOption
    series: SunburstSeriesOption
  }
}>({
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
})

const computedOptions = computed(() => {
  let tmpOption = state.option
  tmpOption.title.text = props.title
  tmpOption.title.subtext = props.subtitle
  tmpOption.series.data = props.data
  if (props.levels?.length) {
    tmpOption.series.levels = props.levels
  }
  return tmpOption
})

</script>

<style scoped>

</style>

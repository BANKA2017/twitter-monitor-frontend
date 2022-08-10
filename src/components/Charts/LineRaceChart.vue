<template>
  <div id="line-race-chart">
    <el-skeleton :loading="!computedOptions.dataset[0].source.length" :rows="4" animated></el-skeleton>
    <v-chart v-if="computedOptions.dataset[0].source.length" :option="computedOptions" :style="{width: '100%', height: (typeof(height) === 'number' ? (height + 'px') : height)}" autoresize></v-chart>
  </div>
</template>

<script>
import * as echarts from 'echarts/core';
import {
  DatasetComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  TransformComponent
} from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import VChart from "vue-echarts";

echarts.use([
  DatasetComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  TransformComponent,
  LineChart,
  CanvasRenderer,
  LabelLayout,
  UniversalTransition
]);
export default {
  name: "lineRaceChart",
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
    height: {
      type: [String, Number],
      default: "700px"
    },
  },
  data: () => ({
    option: {
      animationDuration: 10000,
      dataset: [
        {
          id: 'dataset_raw',
          source: []
        },
      ],
      title: {text: '', subtext: '', textStyle: {fontSize: 14, align: 'center'}, subtextStyle: {align: 'center'},},
      tooltip: {
        order: 'valueDesc',
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        nameLocation: 'middle'
      },
      yAxis: {
        name: 'followers'
      },
      grid: {
        right: 140
      },
      series: []
    }
  }),
  computed: {
    computedOptions: function () {
      let tmpOption = this.option
      tmpOption.title.text = this.title
      //others set
      let tmpData = {
        dataset: [],
        series: []
      }
      let tmpUserList = []
      //dataset
      tmpOption.dataset[0].source = this.data
      tmpOption.dataset[0].source.map(rawDataSetData => {
        if (!(tmpUserList.indexOf(rawDataSetData[3]) + 1) && rawDataSetData[3] !== 'name') {
          //数据集
          tmpData.dataset.push({
            fromDatasetId: 'dataset_raw',
            id: 'dataset_' + rawDataSetData[3],
            transform: {config: {and: [{dimension: 'name', '=': rawDataSetData[3]},]}, type: 'filter'}
          })
          //行
          tmpData.series.push({
            type: "line",
            datasetId: 'dataset_' + rawDataSetData[3],
            showSymbol: false,
            name: rawDataSetData[4],
            endLabel: {"show": true},
            labelLayout: {moveOverlap: "shiftY"},
            emphasis: {focus: "series"},
            encode: {
              x: "date",
              y: "followers",
              label: [
                "display_name",
              ],
              itemName: "date",
              tooltip: []
            }
          })
          tmpUserList.push(rawDataSetData[3])
        }
      })

      tmpOption.dataset = [...tmpOption.dataset, ...tmpData.dataset]
      tmpOption.series = tmpData.series
      return tmpOption
    }
  }
}
</script>

<style scoped>

</style>

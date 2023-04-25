<template>
  <div id="tmv2Table">
    <el-table v-loading="!tableData.length" ref="accountData" :data="tableData" style="width: 100%" :default-sort = "{prop: 'followers', order: 'descending'}">
      <el-table-column :label="t('public.username')" prop="name"></el-table-column>
      <el-table-column show-overflow-tooltip sortable prop="followers" :label="t('public.followers')"></el-table-column>
      <el-table-column show-overflow-tooltip sortable prop="following" :label="t('public.following')"></el-table-column>
      <el-table-column sortable prop="statuses_count" :label="t('public.statuses_count')"></el-table-column>
      <el-table-column prop="group" :label="t('public.group')" :filters="filters" :filter-method="filterTag" header-align="center" filter-placement="bottom-end">
        <template #default="scope">
          <el-tag :type="colorForGroup[group]" disable-transitions v-for="group in scope.row.group" :key="group" class="mb-1">{{ group }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {useStore} from "../store";
import {useI18n} from "vue-i18n";

defineProps({
  tableData: Array
})
//color: ['#19d4ae', '#5ab1ef', '#fa6e86', '#ffb980', '#0067a6', '#c4b4e4', '#d87a80', '#9cbbff', '#d9d0c7', '#87a997',],
const types = ['', 'success', 'warning', 'danger', 'info']
const { t } = useI18n()
const store = useStore()
const projects = computed(() => store.state.projects)
const filters = computed(() => projects.value.map(x => ({text: x, value: x})))
const colorForGroup = computed(() => {
  let tmpList: { [p:string]: string } = {}
  projects.value.map((project, order) => tmpList[project] = types[(order > 5 ? order % 5 : order)])
  return tmpList;
})
const filterTag = (value: string | number | boolean, row: { [p: string]: any }) => {
  let r = false
  //TODO fix type
  row.group.map((x: { toString: () => string; }) => {
    if (!r) {
      r = x.toString() === value.toString();
    }
  });
  return r;
}
</script>

<style scoped>

</style>

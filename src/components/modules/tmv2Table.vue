<template>
    <div id="tmv2Table">
        <el-table v-loading="!tableData.length" ref="accountData" :data="tableData" style="width: 100%" :default-sort = "{prop: 'followers', order: 'descending'}">
            <el-table-column :label="$t('public.username')" prop="name"></el-table-column>
            <el-table-column show-overflow-tooltip sortable prop="followers" :label="$t('public.followers')"></el-table-column>
            <el-table-column show-overflow-tooltip sortable prop="following" :label="$t('public.following')"></el-table-column>
            <el-table-column sortable prop="statuses_count" :label="$t('public.statuses_count')"></el-table-column>
            <el-table-column prop="group" :label="$t('public.group')" :filters="filters" :filter-method="filterTag" header-align="center" filter-placement="bottom-end">
                <template #scope>
                    <el-tag :type="colorForGroup[group]" disable-transitions v-for="group in scope.row.group" :key="group">{{ group }}</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        name: "tmv2Table",
        props: {
            tableData: Array,
        },
        data() {
            return {
                //color: ['#19d4ae', '#5ab1ef', '#fa6e86', '#ffb980', '#0067a6', '#c4b4e4', '#d87a80', '#9cbbff', '#d9d0c7', '#87a997',],
                types: ['', 'success', 'warning', 'danger', 'info'],
            }
        },
        computed: mapState({
            projects: 'projects',
            filters: function () {
                return this.projects.map(x => ({text: x, value: x}))
            },
            colorForGroup: function () {
                let tmpList = [];
                Object.keys(this.projects).map(order => tmpList[this.projects[order]] = this.types[order > 5 ? order % 5 : order])
                return tmpList;
            }
        }),
        methods: {
            filterTag(value, row) {
                let r = false
                row.group.map(x => {
                    if (!r) {
                        r = x === value;
                    }
                });
                return r;
            },
        }
    }
</script>

<style scoped>

</style>

<template>
    <div id="tmv2Table">
        <el-table v-loading="!tableData.length" ref="accountData" :data="tableData" style="width: 100%" :default-sort = "{prop: 'followers', order: 'descending'}">
            <el-table-column prop="name" label="用户名">
            </el-table-column>
            <el-table-column show-overflow-tooltip sortable prop="followers" label="关注者"></el-table-column>
            <el-table-column show-overflow-tooltip sortable prop="following" label="正在关注"></el-table-column>
            <el-table-column sortable prop="statuses_count" label="总推文数"></el-table-column>
            <el-table-column prop="group" label="组" :filters="filters" :filter-method="filterTag" header-align="center" filter-placement="bottom-end">
                <template slot-scope="scope">
                    <el-tag :type="colorForGroup[group]" disable-transitions v-for="group in scope.row.group" :key="group">{{ group }}</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: "tmv2Table",
        props: {
            tableData: Array,
        },
        data() {
            return {
                //color: ['#19d4ae', '#5ab1ef', '#fa6e86', '#ffb980', '#0067a6', '#c4b4e4', '#d87a80', '#9cbbff', '#d9d0c7', '#87a997',],
                types: ['primary', 'success', 'warning', 'danger', 'info', 'text'],
            }
        },
        computed: {
            filters: function () {
                return this.$root.projects.map(x => {
                    return {text: x, value: x}
                })
            },
            colorForGroup: function () {
                let tmpList = [];
                this.$root.projects.map((x, order) => tmpList[x] = this.types[order > 5 ? order % 5 : order])
                return tmpList;
            }
        },
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

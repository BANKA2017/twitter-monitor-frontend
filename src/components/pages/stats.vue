<template>
    <div id="stats">
        <div class="jumbotron jumbotron-fluid" style="background-color: #1da1f2">
            <div class="container">
                <h1 class="display-3" style="color: white">统计</h1>
                <p class="lead" style="color: white">咕咕咕</p>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <tmv2-chart :account-data="chartData('followers')" :label-map="['followers', '关注者']" :colors="['#19d4ae']"/>
                    <div class="my-4"></div>
                    <tmv2-chart :account-data="chartData('following')" :label-map="['following', '正在关注']" :colors="['#5ab1ef']"/>
                    <div class="my-4"></div>
                    <tmv2-chart :account-data="chartData('statuses_count')" :label-map="['statuses_count', '总推文数']" :colors="['#fa6e86']" />
                </div>
                <div class="col-md-6">
                    <tmv2-table :table-data="tableData" />
                </div>
            </div>
        </div>
        <div class="my-4"></div>
        <div class="text-center"><el-button icon="el-icon-back" circle @click="$router.go(-1)"></el-button></div>
        <div class="my-4"></div>
    </div>
</template>

<script>
    import axios from 'axios';
    import Tmv2Table from "../modules/tmv2Table";
    import Tmv2Chart from "../modules/tmv2Chart";
    export default {
        name: "stats",
        components: {Tmv2Chart, Tmv2Table},
        data() {
            return {
                rawData: [],
            }
        },
        computed: {
            tableData: function () {
                return this.rawData.map(x => {
                    return {
                        name: x.display_name,
                        following: x.following,
                        followers: x.followers,
                        statuses_count: x.statuses_count,
                        group: x.group
                    }})
            },
        },
        mounted: function () {
            document.title = 'Stats/统计';
            axios.get(this.basePath + '/api/v2/data/stats').then(response => {
                this.rawData = response.data.data;
            }).catch(error => {
                this.$message({
                    message: error,
                    type: 'error'
                });
            })
        },
        methods: {
            chartData: function (type) {
                return this.rawData.map(x => {
                    return {
                        name: x.display_name,
                        [type]: x[type],
                    }})
            },
        }
    }
</script>

<style scoped>

</style>

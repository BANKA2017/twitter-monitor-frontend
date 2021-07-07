<template>
    <div id="dataChart">
        <!--Load data-->
        <div class="my-4"></div>
        <template v-if="chart.chartData">
            <el-skeleton v-if="uid === 0 || !chart.chartData.rows.length" animated/>
            <ve-line v-else :data="chart.chartData" :settings="chart.chartSettings" :extend="chart.chartOptions" :init-options="{renderer: 'svg'}" :height="chart.chartHeight"></ve-line>
        </template>
    </div>
</template>

<script>
    import axios from "axios";
    export default {
        name: "dataChart",
        props: {
            basePath: String,
            uid: [String, Number],
            baseData: Object,
        },
        data() {
            return {
                chart: {
                    chartHeight: "250px",
                    chartData: {
                        columns: ['timestamp', 'followers', 'following', 'statuses_count'],
                        rows: []
                    },
                    chartSettings: {
                        labelMap: {
                            'timestamp': '日期',
                            'followers': '关注者',
                            'following': '正在关注',
                            'statuses_count': '总推文数',
                        },
                        legendName: this.baseData,
                        scale: [true, true],
                    },
                    chartOptions: {
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                    },
                },
            }
        },
        watch: {
            "uid": function () {
                this.createChart();
            }
        },
        methods: {
            notice: function (text, status) {
                this.$parent.notice(text, status);
            },
            createChart: function(){
                axios.get(this.basePath + '/api/v2/data/chart/?uid=' + this.uid).then(response => {
                    this.chart.chartData.rows = response.data.data;
                    if (!this.chart.chartData.rows.length) {
                        this.notice("chart: " + response.data.message, "warning");
                    }
                }).catch(error => {
                    if (this.displayType === "timeline") {
                        this.notice('加载失败，5s后重试重试 #' + error, 'error');
                        setTimeout(() => {this.createChart()}, 5000);
                    }
                });
            },
        }
    }
</script>

<style scoped>

</style>

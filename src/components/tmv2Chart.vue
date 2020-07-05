<template>
    <div id="tmv2Chart">
        <ve-histogram
            :data="chart.chartData"
            :settings="chart.chartSettings"
            :extend="chart.chartOptions"
            :init-options="{renderer: 'svg', color: '#FFF'}"
            :height="chart.chartHeight"
            :colors="colors"
            :loading="!chart.chartData.rows.length"
        ></ve-histogram>
    </div>
</template>

<script>
    export default {
        name: "tmv2Chart",
        props: {
            accountData: Array,
            labelMap: Array,
            colors: Array,
        },
        data() {
            return {
                chart: {
                    chartHeight: "280px",
                    chartData: {
                        columns: ['name', this.labelMap[0]],
                        rows: []
                    },
                    chartSettings: {
                        labelMap: {[this.labelMap[0]]: this.labelMap[1]},
                        scale: [true, true],
                    },
                    chartOptions: {
                        grid: {
                            left: '3%',
                            right: '10%',
                            bottom: '3%',
                            containLabel: true
                        },
                        series: {
                            label: { show: true, position: "top"}
                        },
                        xAxis: {
                            axisLabel: {
                                rotate: 45
                            }
                        },
                    },
                },
            }
        },
        watch: {
            "accountData": function () {
                this.chart.chartData.rows = this.accountData.sort((a, b) => b[this.labelMap[0]] - a[this.labelMap[0]]).slice(0, 15);
            }
        }
    }
</script>

<style scoped>

</style>

<template>
    <div id="stats">
        <div class="jumbotron jumbotron-fluid" style="background-color: #1da1f2">
            <div class="container">
                <h1 class="display-3" style="color: white">统计</h1>
                <p class="lead" style="color: white">你想知道的一切</p>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-md-8 offset-2">
                    没有你想要的东西，请回吧
                    <div class="my-4"></div>
                    <div class="text-center"><el-button icon="el-icon-back" circle @click="$router.go(-1)"></el-button></div>
                    <div class="my-4"></div>
                    <div class="text-center"> >_ Twitter Monitor </div>
                    <div class="my-4"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "stats"
    }
</script>

<style scoped>

</style>

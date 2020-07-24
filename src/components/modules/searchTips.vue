<template>
    <div id="searchTips" v-once>
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">帮助</h5>
                <h6 class="card-subtitle mb-2 text-muted">搜索快速入门</h6>
                <ul class="card-body">
                    <li>首字符为<code>@</code>可以快速定位到全站任何用户，支持twitter用户名及本地别名，支持正则表达式，此功能适用于全站</li>
                    <li>首字符为<code>#</code>可定位hashtag，此功能适用于全站</li>
                    <li>首字符为<code>$</code>可定位cashtag，此功能适用于全站</li>
                    <li>在输入框输入任何内容可进行对推文的搜索，此功能适用于全站</li>
                    <li>用户页中输入数字可查找对应用户的推文</li>
                    <li>任何时候在输入框输入<code>help</code>、<code>帮助</code>可弹出此教程</li>
                </ul>
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        name: "searchTips"
    }
</script>

<style scoped>

</style>

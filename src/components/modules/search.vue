<template>
    <div id="search">
        <div @keyup.enter="() => {if (search.keywords.length) {$router.push(`/search/`+encodeURIComponent(search.keywords))}}"
             id="searchTweets">
            <el-input :clearable="search.mode === 0"
                      :type="(search.mode && displayType === 'timeline') ? 'date' : 'text'" class="input-with-select"
                      placeholder="请输入内容"
                      v-model.trim="search.keywords">
                <el-select v-model="search.mode" slot="prepend" placeholder="请选择" v-if="displayType === 'timeline'">
                    <el-option label="文字搜索" :value="0"></el-option>
                    <el-option label="日期搜索" :value="1"></el-option>
                </el-select>
            </el-input>
            <div class="my-4"></div>
            <template v-if="search.keywords === 'help' || search.keywords === '帮助'">
                <search-tips/>
                <div class="my-4"></div>
            </template>
        </div>
        <div class="list-group" v-if="search.keywords && search.mode === 0 && search.keywords.slice(0, 1) !== '!'">
            <template v-if="search.keywords && search.keywords.slice(0, 1) !== '!' && search.mode === 0">
                <template v-if="search.keywords.slice(0, 1) === '@'">
                    <router-link :key="s" :to="`/i/project/`+user.project+`/`+user.name+`/all`"
                                 class="list-group-item list-group-item-action" v-for="(user, s) in correctUserList"><b>{{
                        user.display_name }}</b> | <small>@{{ user.name }}</small> > <small>{{ $root.project + ' (' +
                        user.tag + ')' }}</small></router-link>
                    <div class="my-3" v-if="search.keywords.slice(1).length > 0"></div>
                </template>
                <router-link :to="`/hashtag/`+search.keywords.slice(1)" class="list-group-item list-group-item-action"
                             v-if="search.keywords.slice(0, 1) === '#'">查找标签 {{ search.keywords }}
                </router-link>
                <router-link :to="`/cashtag/`+search.keywords.slice(1)" class="list-group-item list-group-item-action"
                             v-if="search.keywords.slice(0, 1) === '$'">查找标签 {{ search.keywords }}
                </router-link>
                <router-link :to="`/`+name+`/status/`+search.keywords" class="list-group-item list-group-item-action"
                             v-if="name.length && search.keywords > 0 && search.keywords.match(/[0-9]+/g)[0] === search.keywords">
                    查找推文 {{ search.keywords }}
                </router-link>
                <router-link :to="`/search/`+encodeURIComponent(search.keywords)"
                             class="list-group-item list-group-item-action" v-if="search.mode === 0"><span
                        class="d-inline-block text-truncate" style="max-width: 250px;">搜索 {{ search.keywords }}</span>
                </router-link>
                <div class="my-3"></div>
            </template>
        </div>
    </div>
</template>

<script>
    import SearchTips from "./searchTips";
    export default {
        name: "search",
        components: {SearchTips},
        props: {
            search: {
                type: Object,
                default: function () {
                    return {keywords: '', mode: 0,}
                }//0->keywords, 1->date
            },
            displayType: String,
            name: String,
        },

        computed: {
            correctUserList: function () {
                let tmpList = [];
                this.$root.userList.map(x => {
                    if (this.search.keywords.slice(1).length > 0 && (RegExp(this.search.keywords.slice(1), 'i').test(x.name) || RegExp(this.search.keywords.slice(1)).test(x.display_name))) {
                        tmpList.push(x)
                    }
                })
                return tmpList
            }
        }
    }
</script>

<style scoped>

</style>

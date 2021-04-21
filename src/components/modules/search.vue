<template>
    <div id="search" @keyup.enter="$router.push({path: '/search/', query: queryObject})">
        <div class="my-2" v-if="!(displayType === 'search' && search.mode === 2)" id="searchTweets">
            <el-input :clearable="search.mode === 0"
                      :type="(search.mode === 1 && displayType === 'timeline') ? 'date' : 'text'" class="input-with-select"
                      placeholder="请输入内容" v-model="search.keywords" :max="$root.now.getFullYear() + '-' + ($root.now.getMonth() < 9 ? '0' : '') + ($root.now.getMonth() + 1) + '-' + ($root.now.getDate() < 10 ? '0' : '') + $root.now.getDate()">
                <el-select v-model="search.mode" slot="prepend" placeholder="请选择" v-if="displayType === 'timeline'">
                    <el-option label="文字搜索" :value="0"></el-option>
                    <el-option label="日期搜索" :value="1"></el-option>
                    <el-option label="高级搜索" :value="2"></el-option>
                </el-select>
            </el-input>
            <template v-if="search.keywords === 'help' || search.keywords === '帮助'">
                <search-tips/>
                <div class="my-4"></div>
            </template>
        </div>
        <button v-if="displayType === 'search'"
                :class="{'btn': true, 'btn-sm': true, 'btn-block': true, 'btn-outline-primary': true, 'mb-4': search.mode === 2, 'my-4': search.mode !== 2, 'active': search.mode === 2,}"
                @click="search.mode = ((search.mode === 2) ? 0 : 2)"
                role="button">高级搜索
        </button>
        <template v-if="displayType === 'search' && search.mode === 2">
          <!-- advancedSearch -->
          <!--text-->
          <div class="input-group mb-1" id="searchInclude">
            <div class="input-group-prepend">
              <div class="input-group-text">
                <div class="custom-control custom-checkbox">
                  <input type="checkbox" class="custom-control-input" id="searchTextOrMode" v-model="search.advancedSearch.keywords.orMode">
                  <label class="custom-control-label" for="searchTextOrMode">OR</label>
                </div>
              </div>
            </div>
            <div class="input-group-prepend">
              <div class="input-group-text">
                <div class="custom-control custom-checkbox">
                  <input type="checkbox" class="custom-control-input" id="searchTextNotMode" v-model="search.advancedSearch.keywords.notMode">
                  <label class="custom-control-label" for="searchTextNotMode">NOT</label>
                </div>
              </div>
            </div>
            <input type="text" class="form-control" aria-label="Text input with checkbox" placeholder="所有这些词语" v-model="search.advancedSearch.keywords.text">
          </div>
          <label for="searchInclude" class="text-muted my-2 mb-4">例如：什么 新鲜事 · 既包含“什么”，也包含“新鲜事”</label>
          <!--user include-->
          <div class="input-group mb-1" id="searchUserInclude">
            <div class="input-group-prepend">
              <div class="input-group-text">
                <div class="custom-control custom-checkbox">
                  <input type="checkbox" class="custom-control-input" id="searchUserOrMode" v-model="search.advancedSearch.user.andMode">
                  <label class="custom-control-label" for="searchUserOrMode">AND</label>
                </div>
              </div>
            </div>
            <div class="input-group-prepend">
              <div class="input-group-text">
                <div class="custom-control custom-checkbox">
                  <input type="checkbox" class="custom-control-input" id="searchUserNotMode" v-model="search.advancedSearch.user.notMode">
                  <label class="custom-control-label" for="searchUserNotMode">NOT</label>
                </div>
              </div>
            </div>
            <input type="text" class="form-control" aria-label="Text input with checkbox" placeholder="来自这些用户" v-model="search.advancedSearch.user.text">
          </div>
          <label for="searchUserInclude" class="text-muted my-2 mb-4">例如：@Twitter · 来自 @Twitter</label>
          <!-- time -->
          <div class="input-group" id="searchTime">
            <input class="form-control" placeholder="from" type="date" :max="$root.now.getFullYear() + '-' + ($root.now.getMonth() < 9 ? '0' : '') + ($root.now.getMonth() + 1) + '-' + ($root.now.getDate() < 10 ? '0' : '') + $root.now.getDate()" v-model="search.advancedSearch.start">
            <div id="searchTimeTo" class="input-group-append"><span class="input-group-text">-></span></div>
            <input class="form-control input-group-append" :min="search.advancedSearch.start" :max="$root.now.getFullYear() + '-' + ($root.now.getMonth() < 9 ? '0' : '') + ($root.now.getMonth() + 1) + '-' + ($root.now.getDate() < 10 ? '0' : '') + $root.now.getDate()" placeholder="to" type="date" v-model="search.advancedSearch.end">
            <div id="searchTimeDel" class="input-group-append">
              <button class="btn btn-outline-danger" type="button" @click="() => {search.advancedSearch.start = ''; search.advancedSearch.end = ''}">
                清空
              </button>
            </div>
          </div>
          <label for="searchTime" class="text-muted my-2">例如：2021-01-01 -> 2021-01-02</label>

          <div class="btn-group btn-block" role="group">
            <button type="button" :class="{'btn': true, 'btn-outline-primary': true, 'btn-sm': true, 'active': search.advancedSearch.tweetType.type === 0}" @click="search.advancedSearch.tweetType.type = 0">全部</button>
            <button type="button" :class="{'btn': true, 'btn-outline-primary': true, 'btn-sm': true, 'active': search.advancedSearch.tweetType.type === 1}" @click="search.advancedSearch.tweetType.type = 1">原创</button>
            <button type="button" :class="{'btn': true, 'btn-outline-primary': true, 'btn-sm': true, 'active': search.advancedSearch.tweetType.type === 2}" @click="search.advancedSearch.tweetType.type = 2">转推</button>
            <button type="button" :class="{'btn': true, 'btn-outline-primary': true, 'btn-sm': true, 'active': search.advancedSearch.tweetType.media !== 0}" @click="search.advancedSearch.tweetType.media = ((search.advancedSearch.tweetType.media === 0) ? 1 : 0)">媒体</button>
            <button role="button" :class="{'btn': true, 'btn-outline-primary': true, 'btn-sm': true, 'active': search.advancedSearch.order === 1}" @click="search.advancedSearch.order = ((search.advancedSearch.order === 0) ? 1 : 0)" >反序</button>
          </div>
          <!--<div class="btn-group btn-block" role="group">
            <button type="button" :class="{'btn': true, 'btn-outline-primary': true, 'btn-sm': true, 'active': search.advancedSearch.tweetType.media !== 0}" @click="search.advancedSearch.tweetType.media = ((search.advancedSearch.tweetType.media === 0) ? 1 : 0)">视频</button>
            <button type="button" :class="{'btn': true, 'btn-outline-primary': true, 'btn-sm': true, 'active': search.advancedSearch.tweetType.media !== 0}" @click="search.advancedSearch.tweetType.media = ((search.advancedSearch.tweetType.media === 0) ? 1 : 0)">投票</button>
            <button type="button" :class="{'btn': true, 'btn-outline-primary': true, 'btn-sm': true, 'active': search.advancedSearch.tweetType.media !== 0}" @click="search.advancedSearch.tweetType.media = ((search.advancedSearch.tweetType.media === 0) ? 1 : 0)">含有链接</button>
            <button type="button" :class="{'btn': true, 'btn-outline-primary': true, 'btn-sm': true, 'active': search.advancedSearch.tweetType.media !== 0}" @click="search.advancedSearch.tweetType.media = ((search.advancedSearch.tweetType.media === 0) ? 1 : 0)">含有引用</button>
          </div>-->
          <button role="button" :class="{'btn': true, 'btn-outline-dark': true, 'btn-sm': true, 'btn-block': true, 'active': search.advancedSearch.hidden}" @click="search.advancedSearch.hidden = ((search.advancedSearch.hidden === 0) ? 1 : 0)" v-if="$root.settings.adminStatus">显示隐藏</button>
          <div class="my-1"></div>
          <label class="text-muted">* <code>OR模式</code>为“或”，<code>AND模式</code>为“且”，<code>NOT模式</code>会根据前者出现“或非”或“且非”</label>
          <label class="text-muted">* 输入框使用空格分隔词语</label>
          <div class="my-1"></div>
          <router-link :to="{path: '/search/', query: queryObject}" type="button" class="btn btn-primary text-right">搜索</router-link>
        </template>
        <div class="list-group my-2" v-if="search.keywords && (!search.mode === 2 || displayType !== 'search') && search.mode === 0 && search.keywords.slice(0, 1) !== '!'">
            <template v-if="search.keywords && search.keywords.slice(0, 1) !== '!' && search.mode === 0">
              <!--user-->
                <template v-if="search.keywords.slice(0, 1) === '@'">
                    <router-link :key="s" :to="`/i/project/`+user.project+`/`+user.name+`/all`"
                                 class="list-group-item list-group-item-action" v-for="(user, s) in correctUserList"><b>{{
                        user.display_name }}</b> | <small>@{{ user.name }}</small> > <small>{{ $root.project + ' (' +
                        user.tag + ')' }}</small></router-link>
                    <!--<div class="my-3" v-if="search.keywords.slice(1).length > 0"></div>-->
                </template>
              <!--hashtag && cashtag-->
                <router-link :to="`/hashtag/`+search.keywords.slice(1)" class="list-group-item list-group-item-action"
                             v-if="search.keywords.slice(0, 1) === '#'">查找标签 {{ search.keywords }}
                </router-link>
                <router-link :to="`/cashtag/`+search.keywords.slice(1)" class="list-group-item list-group-item-action"
                             v-if="search.keywords.slice(0, 1) === '$'">查找标签 {{ search.keywords }}
                </router-link>
              <!--status (user only)-->
                <router-link :to="`/`+name+`/status/`+search.keywords" class="list-group-item list-group-item-action"
                             v-if="name.length && search.keywords > 0 && search.keywords.match(/[0-9]+/g)[0] === search.keywords">
                    查找推文 {{ search.keywords }}
                </router-link>
                <router-link :to="{path: '/search/', query: queryObject}"
                             class="list-group-item list-group-item-action" v-if="search.mode === 0"><span
                        class="d-inline-block text-truncate" style="max-width: 250px;">搜索 {{ search.keywords }}</span>
                </router-link>
            </template>
        </div>
    </div>
</template>

<script>
    import CryptoJS from "crypto-js";

    import SearchTips from "./searchTips";
    export default {
        name: "search",
        components: {SearchTips},
        props: {
            search: {
                type: Object,
                default: () => ({
                  keywords: '',
                  mode: 0,//0->keywords, 1->date, 2->advanced
                  advancedSearch: {
                    user: {
                      "text": "",
                      "andMode": 0,
                      "notMode": 0,
                    },
                    keywords: {
                      "text": "",
                      "orMode": 0,
                      "notMode": 0,
                    },
                    tweetType: {
                      type: 0,//0-> all, 1-> origin, 2-> retweet
                      media: 1,//media
                    },
                    start: "",
                    end: "",
                    order: 0,//正序0, 倒序1
                    hidden: 0,
                  }
                })
            },
            displayType: String,
            name: {
              type: String,
              default: ''
            },
        },
        watch: {
          "search.mode": {
            handler: function () {
              if (this.search.mode === 2) {//时间搜索
                if (this.name && this.displayType === 'timeline') {
                  this.search.advancedSearch.user.text = '@' + this.name
                }
                if (!RegExp('^/search').test(this.$route.path)){
                  this.$router.push({path: '/search/'})
                }

              }
            },
            deep: true
          },
          "search.keywords": {
            handler: function () {
              if (!this.$root.settings.adminStatus && CryptoJS.enc.Base64.stringify(CryptoJS.SHA256(this.search.keywords)) === this.adminModePassword) {
                this.$root.settings.adminStatus = true
              }
            },
            deep: true
          }
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
            },
            queryObject: function () {
                if (this.search.mode === 2) {
                  let returnObject = {
                    q: this.search.advancedSearch.keywords.text.trim(),
                    text_or_mode: this.search.advancedSearch.keywords.orMode ? 1 : 0,
                    text_not_mode: this.search.advancedSearch.keywords.notMode ? 1 : 0,
                    user: this.search.advancedSearch.user.text,
                    user_and_mode: this.search.advancedSearch.user.andMode ? 1 : 0,
                    user_not_mode: this.search.advancedSearch.user.notMode ? 1 : 0,
                    tweet_type: this.search.advancedSearch.tweetType.type,
                    tweet_media: this.search.advancedSearch.tweetType.media ? 1 : 0,
                    start: this.search.advancedSearch.start,
                    end: this.search.advancedSearch.end,
                    order: this.search.advancedSearch.order,
                    advanced: 1,
                  }
                  if (this.$root.settings.adminStatus) {
                    returnObject['hidden'] = this.search.advancedSearch.hidden ? 1 : 0
                  }
                  return returnObject
                } else {
                  return {q: this.search.keywords.trim()}// + ((this.name.length && !RegExp('@' + this.name).test(this.search.keywords)) ? ' @' + this.name : '')
                }
            }
        },
    }
</script>

<style scoped>

</style>

<template>
  <div id="app">
    <template v-if="tweetStatus.displayType === 'userSelector'">
      <div class="jumbotron">
        <h1 class="display-4">Twitter Monitor</h1>
      </div>
      <div class="container">
        <div class="col-md-8 offset-md-2">
          <div id="searchCard">
            <div class="input-group mb-3 input-group-lg">
              <input type="text" class="form-control" placeholder="搜索..." aria-describedby="search" v-model.trim="search.keywords" focus>
            </div>
            <searchTips v-if="search.keywords && (search.keywords.toLowerCase() === 'help' || search.keywords === '帮助')" />
          </div>
          <div class="list-group" v-if="search.keywords && search.mode === 0 && search.keywords.slice(0, 1) !== '!' || project">
            <template v-if="search.keywords && search.keywords.slice(0, 1) !== '!' && search.mode === 0">
              <!--<a :href="`#/project/`+search_user.project+`/`+search_user.name+`/all`" class="list-group-item list-group-item-action" v-for="search_user in findUser(search.toString().slice(1).toLowerCase(), names)"><b>{{ search_user.display_name }}</b> | <small>@{{ search_user.name }}</small> > <small>{{ search_user.project }}</small></a>-->
              <router-link :to="`/hashtag/`+search.keywords.slice(1)" class="list-group-item list-group-item-action" v-if="search.keywords.slice(0, 1) === '#'">查找标签 {{ search.keywords }}</router-link>
              <router-link :to="`/cashtag/`+search.keywords.slice(1)" class="list-group-item list-group-item-action" v-if="search.keywords.slice(0, 1) === '$'">查找标签 {{ search.keywords }}</router-link>
              <router-link :to="`/`+name+`/status/`+search.keywords" class="list-group-item list-group-item-action" v-if="search.keywords > 0 && search.keywords.match(/[0-9]+/g)[0] === search.keywords">查找推文 {{ search.keywords }}</router-link>
              <router-link :to="`/search/`+search.keywords" class="list-group-item list-group-item-action" v-if="search.mode === 0"><span class="d-inline-block text-truncate" style="max-width: 250px;">搜索项目 {{ search.keywords }}</span></router-link>
            </template>
            <template v-if="project && names[project] && !home">
              <router-link :to="`/i/project/`+user.project+`/`+user.name+`/all`" class="list-group-item list-group-item-action" v-for="(user, s) in userWithProjectList" :key="s"><b>{{ user.display_name }}</b> | <small>@{{ user.name }}</small> > <small>{{ $route.params.project + ' (' + user.tag + ')' }}</small></router-link>
              <div class="my-4"></div>
            </template>
          </div>
          <el-row>
            <template v-for="(project, s) in projects">
              <router-link :to="`/i/project/`+project" :key="s">
                <el-button size="mini" class="text-decoration-none" round>{{ project }}</el-button>
              </router-link>
            </template>
          </el-row>
          <div class="my-4"></div>
        </div>
      </div>
    </template>
    <template v-else>
      <nav class="navbar navbar-expand-lg navbar-light text-center bg-light">
        <span class="navbar-brand mb-0 h1 d-inline-block text-truncate" style="max-width: 250px;">
          {{ displayName }}
        </span>
        <div class="btn-group" role="group">
          <button class="navbar-toggler" type="button" @click="$router.go(-1)">
            <span>
              <chevronLeft status="text-success" width="30" height="30" />
            </span>
          </button>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" v-if="project && projects.length && tweetStatus.displayType === 'timeline'">
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>
        <div class="collapse navbar-collapse" id="navbarNav" v-if="tweetStatus.displayType === 'timeline'">
          <ul class="navbar-nav" v-if="project">
            <li class="nav-item dropdown" v-for="(values, key) in names[project]" :key="key">
              <a class="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" :href="$route.path" v-if="names[project][key].length > 1">
                {{ key }}
              </a>
              <router-link class="nav-link" :to="`/`+(values[0].projects.length <= 1 ? '' : 'project/'+project+'/')+values[0].name+`/all`" v-else>{{ values[0].display_name }}</router-link>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown" v-if="names[project][key].length > 1" z-index="9999">
                <div v-for="value in values" :key="value.display_name">
                  <router-link :to="`/`+value.name+`/all`" :class="`dropdown-item `+(value.name ? '' : 'disabled')">{{ value.display_name }}</router-link>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </nav>
      <div class="my-4"></div>
      <main role="main" class="container">
        <div class="row">
          <div class="col-md-4" v-if="tweetStatus.displayType !== 'status' && tweetStatus.userExist">
            <el-skeleton avatar active :paragraph="{rows: 5}" v-if="load.leftCard"/>
            <div class="card" v-else>
              <template>
                <el-image v-if="info.banner !== '0' && tweetStatus.displayType !== 'search' && tweetStatus.displayType !== 'tag'" class="card-img-top" :src="basePath+`/api/v2/media/userinfo/pbs.twimg.com/profile_banners/`+info.uid+`/`+info.banner+`.banner`" alt="Banner" :preview-src-list="[basePath+`/api/v2/media/userinfo/pbs.twimg.com/profile_banners/`+info.uid+`/`+info.banner+`.banner`]" ></el-image>
                <div class="card-body">
                  <h3 v-if="tweetStatus.displayType === 'search'">搜索</h3>
                  <router-link :to="`/hashtag/`+tag.text" v-else-if="tweetStatus.displayType === 'tag' && tag.type === 0"><h3>#{{ tag.text }}</h3></router-link>
                  <router-link :to="`/cashtag/`+tag.text" v-else-if="tweetStatus.displayType === 'tag' && tag.type === 1"><h3>${{ tag.text }}</h3></router-link>
                  <div class="container" v-else>
                    <div class="row">
                      <div class="col-4" style="max-height: 100px; max-width: 100px">
                        <el-image class="rounded-circle img-fluid" :src="basePath+`/api/v2/media/userinfo/`+info.header" v-if="info.header" lazy :preview-src-list="[basePath+`/api/v2/media/userinfo/`+info.header]">
                          <div slot="error" class="image-slot">
                            <i class="el-icon-user-solid"></i>
                          </div>
                        </el-image>
                        <div class="my-4"></div>
                      </div>
                      <div class="col-8">
                        <h5 class="card-title mt-0">
                          <b>{{ info.display_name }}</b>
                          <verified status="text-primary" width="1em" height="1em"  v-if="info.verified" />
                          <deleted status="text-primary" width="1em" height="1em"  v-if="info.deleted" />
                          <locked status="text-primary" width="1em" height="1em" v-else-if="info.locked" />
                        </h5>
                        <p>
                          <small>
                            <a :href="`//twitter.com/`+info.name" target="_blank" class="text-dark">@{{ info.name }}</a>
                          </small>
                        </p>
                      </div>
                    </div>
                    <div v-html="`<p class='card-text'>`+info.description+`</p>`"></div>
                    <translate :basePath="basePath" :type="1" :id="info.uid" :to="settings.data.language" />
                  </div>
                </div>
              </template>
            </div>
            <template v-if="tweetStatus.displayType === 'timeline'">
              <!--Load data-->
              <div class="my-4"></div>
              <template v-if="chart.chartData">
                <el-skeleton active :title="false" :paragraph="{rows: 4}" v-if="!chart.chartData.rows.length"/>
                <ve-line v-else :data="chart.chartData" :settings="chart.chartSettings" :extend="chart.chartOptions" :init-options="{renderer: 'svg'}" :height="chart.chartHeight"></ve-line>
              </template>
            </template>
            <div class="my-4"></div>
          </div>
          <div :class="`col-md-` + ((tweetStatus.displayType === 'status' || !tweetStatus.userExist) ? '10' : '6')">
            <div v-if="!tweetStatus.userExist">
              <h5 class="text-center">@{{ name }} 不存在</h5>
              <div class="my-4"></div>
            </div>
            <template v-else>
              <div id="searchTweets">
                <el-input placeholder="请输入内容" v-model.trim="search.keywords" class="input-with-select" :type="(search.mode && tweetStatus.displayType === 'timeline') ? 'date' : 'text'" :clearable="search.mode === 0">
                  <el-select v-model="search.mode" slot="prepend" placeholder="请选择" v-if="tweetStatus.displayType === 'timeline'">
                    <el-option label="文字搜索" :value="0"></el-option>
                    <el-option label="日期搜索" :value="1"></el-option>
                  </el-select>
                </el-input>
                <!--
                <div class="input-group mb-3">
                  <input type="text" class="form-control" placeholder="搜索..." aria-describedby="search" v-model.trim="search.keywords" v-if="search.mode === 0">
                  <input type="date" class="form-control" aria-describedby="search" v-model="search.keywords" v-if="search.mode === 1">
                  <div class="input-group-append" v-if="tweetStatus.displayType === 'timeline' || tweetStatus.displayType === 'search'">
                    <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">搜索模式</button>
                    <div class="dropdown-menu dropdown-menu-right">
                      <button class="dropdown-item" @click="()=>{search.mode = searchType[1];search.keywords = ''}" type="button" v-for="searchType in [['文字搜索', 0], ['日期搜索', 1]]" :key="searchType">{{ searchType[0] }}</button>
                    </div>
                  </div>
                </div>
                -->
                <div class="my-4"></div>
                <search-tips v-if="search.keywords === 'help' || search.keywords === '帮助'" />
              </div>
              <div class="list-group" v-if="search.keywords && search.mode === 0 && search.keywords.slice(0, 1) !== '!' || $route.params.project">
                <template v-if="search.keywords && search.keywords.slice(0, 1) !== '!' && search.mode === 0">
                  <!--<a :href="`#/project/`+search_user.project+`/`+search_user.name+`/all`" class="list-group-item list-group-item-action" v-for="search_user in findUser(search.toString().slice(1).toLowerCase(), names)"><b>{{ search_user.display_name }}</b> | <small>@{{ search_user.name }}</small> > <small>{{ search_user.project }}</small></a>-->
                  <router-link :to="`/hashtag/`+search.keywords.slice(1)" class="list-group-item list-group-item-action" v-if="search.keywords.slice(0, 1) === '#'">查找标签 {{ search.keywords }}</router-link>
                  <router-link :to="`/cashtag/`+search.keywords.slice(1)" class="list-group-item list-group-item-action" v-if="search.keywords.slice(0, 1) === '$'">查找标签 {{ search.keywords }}</router-link>
                  <router-link :to="`/`+name+`/status/`+search.keywords" class="list-group-item list-group-item-action" v-if="search.keywords > 0 && search.keywords.match(/[0-9]+/g)[0] === search.keywords">查找推文 {{ search.keywords }}</router-link>
                  <router-link :to="`/search/`+search.keywords" class="list-group-item list-group-item-action" v-if="search.mode === 0"><span class="d-inline-block text-truncate" style="max-width: 250px;">搜索项目 {{ search.keywords }}</span></router-link>
                </template>
              </div>
              <div class="my-4"></div>
              <nav class="nav nav-pills nav-fill">
                <template  v-if="tweetStatus.displayType === 'timeline' && !load.leftCard">
                  <li class="nav-item" v-for="(value, s) in displayMode" :key="s">
                    <div class="nav-link active" @click="loading( 0)" style="cursor:pointer" v-if="value[1] === tweetStatus.display">{{ value[0] }}</div>
                    <router-link :to="`/`+info.name+`/`+value[1]" class="nav-link" v-else>{{ value[0] }}</router-link>
                  </li>
                </template>
                <li class="nav-item">
                  <div :class="`nav-link `+(settings.data.displayPicture ? 'active' : 'text-primary')" @click="settings.data.displayPicture=!settings.data.displayPicture" style="cursor:pointer">无图</div>
                </li>
              </nav>
              <hr class="my-4">
              <!--user tweets-->
              <el-skeleton :paragraph="{rows: 5}" v-if="load.timeline" active/>
              <div v-else>
                <template v-if="tweetStatus.displayType === 'timeline' && (info.deleted || info.locked)">
                  <div class="card card-border border-info" id="alertMsg">
                    <div class='card-body'>
                      {{ '此账户已'+(info.deleted ? '删除' : '被保护')+'，我们将不再监控此账户' }}
                    </div>
                  </div>
                  <hr class="my-4">
                </template>
                <div v-if="tweetStatus.reload" class="text-center">
                  <el-button round icon="el-icon-refresh-left" @click="() => {load.timeline=true;update()}">重试</el-button>
                </div>
                <div v-if="load.top" class="text-center" v-loading="load.top" style="height: 50px"></div>
                <div v-if="!tweetStatus.reload && tweets.length">
                  <div v-for="(tweet, order) in tweets" :key="order">
                    <div v-if="tweet.type === 'msg'" class="text-center">
                      {{ tweet.full_text }}
                    </div>
                    <div v-else>
                      <div :class="`card card-border`+((tweetStatus.displayType === 'timeline' && tweet.tweet_id === info.top) ? ' border-primary' : '')" :id="tweet.tweet_id">
                        <div class='card-body'>
                          <p v-if="tweetStatus.displayType === 'timeline' && tweet.tweet_id === info.top"><small class="text-muted">置顶推文</small></p>
                          <div>
                            <small v-if="tweet.retweet_from" class="text-muted">
                              <retweet status="" width="1em" height="1em"/>
                              <router-link :to="`/`+tweet.name+(tweetStatus.displayType === 'status' ? `/` + tweetStatus.display : `/status/`+tweet.tweet_id)" class="text-muted">
                                {{ tweet.display_name }}
                              </router-link>
                            </small>
                          </div>
                          <template>
                            <router-link :to="`/`+tweet.name+(tweetStatus.displayType === 'status' ? `/all` : `/status/`+tweet.tweet_id)" class="card-title text-dark">
                              {{ tweet.retweet_from ? tweet.retweet_from : tweet.display_name }}
                            </router-link>
                            | <small>@{{ tweet.retweet_from ? tweet.retweet_from_name : tweet.name }}</small>
                          </template>
                          <!--media-->
                          <span v-if="tweet.media === '1'" @click="settings.data.displayPicture=!settings.data.displayPicture" style="cursor:pointer">
                            <image-icon status="text-success" width="2em" height="2em" />
                          </span>
                          <camera-video-icon status="text-danger" width="2em" height="2em"  v-if="tweet.video === '1'"/>
                          <a :href="`//twitter.com/i/status/`+tweet.tweet_id" target="_blank">
                            <box-arrow-up-right status="text-primary" width="2em" height="2em" />
                          </a>
                          <div class="my-4"></div>
                          <div v-html="`<p class='card-text'>`+tweet.full_text+`</p>`"></div>
                          <!--excited!-->
                          <!--<htmlText :origin="tweet.full_text_origin" :replaceList="tweet.entities" v-if="tweet.entities.length" />
                          <template v-else>
                            <p class='card-text'>
                              {{ tweet.full_text_origin }}
                            </p>
                          </template>-->
                          <translate :basePath="basePath" :type="0" :id="tweet.tweet_id" :to="settings.data.language" />
                          <!--media-->
                          <template v-if="tweet.media === '1'&&!settings.data.displayPicture">
                            <div class="my-4"></div>
                            <image-list :list="tweet.mediaObject.tweetsMedia" :is_video="tweet.video" :basePath="basePath"/>
                          </template>
                          <!--quote-->
                          <template v-if="tweet.quote_status !== '0'">
                            <div class="my-4"></div>
                            <quote-card :quote-object="tweet.quoteObject" :quote-media="tweet.mediaObject.quoteMedia" :base-path="basePath" :display-picture="settings.data.displayPicture" :language="settings.data.language" />
                          </template>
                          <!--polls-->
                          <template v-if="tweet.poll === '1'">
                            <tw-polls :polls="tweet.pollObject" :tweet_id="tweet.tweet_id" :language="settings.data.language" :media="tweet.mediaObject.cardMedia" :basePath="basePath" />
                          </template>
                          <!--card-->
                          <template v-else-if="tweet.card !== ''">
                            <tw-card :object="tweet.cardObject" :media="tweet.mediaObject.cardMedia" :mediaState="!settings.data.displayPicture" :basePath="basePath"></tw-card>
                          </template>
                          <!--time && source-->
                          <div id="foot">
                            <small class="text-muted">{{ (new Date(tweet.time * 1000)).toLocaleString(settings.data.language) }} · <span style="color: #1DA1F2">{{ tweet.source }}</span></small>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr class="my-4">
                  </div>
                  <template>
                    <button type="button" class="btn btn-primary btn-lg btn-block" @click="loading(1)" v-if="tweetStatus.moreTweets && !load.bottom">
                      <span>加载更多</span>
                    </button>
                    <el-skeleton :paragraph="{rows: 1}" v-else-if="tweetStatus.moreTweets && load.bottom" active/>
                    <div v-else-if="!tweetStatus.displayType === 'status'">
                      <h5 class="text-center">已经没有更多内容</h5>
                    </div>
                  </template>
                </div>
                <div v-else-if="!tweetStatus.reload">
                  <h5 class="text-center">已经没有更多内容</h5>
                </div>
              </div>
              <div class="my-4"></div>
            </template>
          </div>
          <div class="col-md-2">
            <!--有确定的project-->
            <template v-if="project">
              <button type="button" class="btn btn-outline-primary btn-block btn-sm" @click="projectS = !projectS">{{ project }}</button>
              <div class="my-4"></div>
            </template>
            <!--未确定project-->
            <template v-else>
              <router-link type="button" class="btn btn-outline-primary btn-block btn-sm" to="/">选择企划</router-link>
              <div class="my-4"></div>
            </template>
            <template v-if="projectS">
              <div class="list-group">
                <router-link type="button" :to="`/i/project/`+project_" :class="`list-group-item list-group-item-action`+(project_.toLowerCase() === project.toLowerCase() ? ' active' : '')" v-for="project_ in projects" :key="project_" @click="projectS = !projectS">{{ project_ }}</router-link>
              </div>
              <div class="my-4"></div>
            </template>
            <span style="cursor:pointer" class="text-decoration-none badge badge-pill badge-primary" @click="settings.panel = true">设置</span>
            <hr class="my-4">
            <template v-for="(link, s) in links">
              <span :key="s" v-if="s!==0"> · </span>
              <a :href="link.url" target="_blank" :key="link.url+s" class="text-muted"><small>{{ link.display }}</small></a>
            </template>
            <div class="my-4"></div>
          </div>
        </div>
        <!--setting-->
        <el-drawer title="设置" :visible.sync="settings.panel" direction="btt">
          <div class="modal-body">
            <label for="selectLaguage">语言</label>
            <select id="selectLaguage" v-model="settings.data.language" class="form-control">
              <option :value="language.code" :selected="settings.data.language === language.code" v-for="language in languageList" :key="language.code">{{ language.local_name }}</option>
            </select>
          </div>
        </el-drawer>
      </main>
    </template>
    <el-backtop target="#app"></el-backtop>
  </div>
</template>

<script>
  import Vue from 'vue'
  import VueRouter from 'vue-router'
  import searchTips from './components/searchTips.vue'
  //import htmlText from './components/htmlText.vue'
  import imageList from './components/imageList.vue'
  import twPolls from './components/twPolls.vue'
  import axios from 'axios'
  import twCard from "./components/twCard";
  import translate from "./components/translate";
  //import icons
  import chevronLeft from "./components/icons/chevronLeft";
  import Verified from "./components/icons/verified";
  import Deleted from "./components/icons/deleted";
  import Locked from "./components/icons/locked";
  import Retweet from "./components/icons/retweet";
  import BoxArrowUpRight from "./components/icons/boxArrowUpRight";
  import CameraVideoIcon from "./components/icons/cameraVideoIcon";
  import ImageIcon from "./components/icons/imageIcon";
  import QuoteCard from "./components/quoteCard";
  Vue.use(VueRouter);
  export default {
    name: 'App',
    components: {
      QuoteCard,
      ImageIcon,
      CameraVideoIcon,
      BoxArrowUpRight,
      Retweet,
      Locked,
      Deleted,
      Verified,
      twCard,
      searchTips,
      //htmlText,
      imageList,
      twPolls,
      translate,
      chevronLeft,
    },
    data() {
      return {
        basePath: process.env.NODE_ENV !== "development" ? "https://bangdream.fun/twitter" : "https://bangdream.fun/dev/tmv2",
        displayName: "Twitter",
        tag: {
          text: '',
          type: 0
        },
        load: {
          leftCard: true,
          timeline: true,
          top: false,
          bottom: false,
        },
        search: {
          keywords: '',
          mode: 0,//0->keywords, 1->date
        },
        project: "",
        projectS: false,
        projects: [],
        names: [],
        //nsfwList: [],
        links: [],
        info: [],
        tweets: [],
        name: "",
        home: true,
        tweetStatus: {
          displayType: "userSelector",//timeline, tag, search, status, userSelector
          display: 'all',
          moreTweets: true,
          topTweetId: 0,
          bottomTweetId: 0,
          reload: false,
          userExist: true,
          //statusMode: false,
        },
        displayMode: [['全部', 'all', 0], ['原创', 'self', 0], ['转推', 'retweet', 0], ['媒体', 'media', 0]],
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
            legendName: [],
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
        languageList: [],
        settings: {
          data: {
            language: /zh/.test(window.navigator.language.toLowerCase()) ? window.navigator.language.toLowerCase() : 'en',
            cookie_accept: false,
            displayPicture: false,
          },
          panel: false,
        },
      };
    },
    metaInfo () {
      return {
        title: this.displayType,
        htmlAttrs: {
          lang: 'zh',
        }
      }
    },
    computed: {
      userList: function() {
        let users = [];
        Object.keys(this.names).forEach(value1 => {
          Object.keys(this.names[value1]).forEach(value2 => {
            Object.keys(this.names[value1][value2]).forEach(value3 => {
              users.push({name: this.names[value1][value2][value3]["name"], display_name: this.names[value1][value2][value3]["display_name"], project: value1, tag: value2});
            })
          })
        });
        return users;
      },
      userWithProjectList: function() {
        let list = [];
        this.userList.forEach(values => {
          if (values.project === this.project && values.name) {
            list.push(values);
          }
        });
        return list;
      },
      userTimeZone: function() {
        let timeValue = (new Date().getTimezoneOffset()/60)*(-1);
        return timeValue >= 0 ? '+'+timeValue.toString() : timeValue.toString();
      },
    },
    router: new VueRouter({
      base: '/',
      routes: [
        {
          path: '/i',
          children: [
            {
              path: 'project/:project',
              children: [
                {path: ':name'},
                {path: ':name/:display'},
                {path: ':name/status/:status'}
              ]
            },
          ]
        },{
          path: '/hashtag/:hashtag',
        },{
          path: '/cashtag/:cashtag',
        },{
          path: '/search/:search',
        },{
          path: '/:name',
          children: [
            {path: ''},
            {path: ':display'},
            {path: 'status/:status'}
          ]
        }
      ]
    }),
    watch: {
      "$route.path":  {
        handler: function () {
          //console.log(this.$route.path);
          //this.scrollToTop();

          //处理未加载完成的
          window.stop();
          this.tweetStatus.userExist = true;
          let is_project = this.$route.path.substr(3, 7);//提前处理
          this.routeCase();
          if (this.tweetStatus.displayType !== 'userSelector' && is_project !== 'project') {
            this.load.timeline = true;
            this.update();
          }
        },
        deep: true,
      },
      "name": function () {
        //clean
        this.chart.chartData.rows = [];
        this.getUserInfo(this.name);
      },
      "info": function(){
        //バンドリ！ BanG Dream! 公式 (@bang_dream_info) / Twitter
        this.changeTitle(this.info.display_name ? this.info.display_name + ' (@' + this.info.name + ') / Twitter Monitor' : "Twitter Monitor");
        //this.display_name = this.info.display_name;
      },
      "search.keywords": {
        handler: function () {
          if (this.search.mode === 1 && this.tweetStatus.displayType !== 'userSelector') {
            this.load.timeline = true;
            this.update();
          }
        },
        deep: true,
      },
      "search.mode": {
        handler: function() {
          this.search.keywords = '';
        },
        deep: true,
      }
    },
    mounted: function () {
      let is_project = this.$route.path.substr(3, 7);//提前处理
      this.localrun();
      //处理路由
      this.routeCase();
      let startTime = Date.now();
      axios.all([this.getAccountList(), this.getLanguageList()]).then(axios.spread((accountList, languageList) => {
        this.languageList = languageList.data;
        this.names = accountList.data.account_info;
        this.projects = accountList.data.projects;
        this.links = accountList.data.links;
        //处理网速
        if(Date.now() - startTime > 3000){
          this.settings.data.displayPicture = true;
          this.notice('当前网速较慢，已关闭图片显示', 'warning');
        }
        //check $route
        if (this.tweetStatus.displayType !== 'userSelector' && is_project !== 'project') {
          this.update();
        }
      })).catch(error => {
        this.notice(error, 'error');
      });
    },
    methods: {
      getAccountList: function () {
        return axios.get(this.basePath + (process.env.NODE_ENV !== "development" ? "/account_info_t.json" : "/proxy.php?filename=account_info_t"));
      },
      getLanguageList: function () {
        return axios.get(this.basePath + (process.env.NODE_ENV !== "development" ? "/language_target.json" : "/proxy.php?filename=language_target"));
      },
      changeTitle: function (text = "") {
        document.title = text;
      },
      loading: function (type = 0) {
        if (this.tweetStatus.bottomTweetId && this.tweetStatus.topTweetId) {
          //0 -> top, 1 -> bottom
          this.load[(type === 0 ? 'top' : 'bottom')] = true;
          axios.get(this.mergeUrl()+(type === 0 ? '&refresh=1&tweet_id=' + this.tweetStatus.topTweetId.toString() : '&refresh=0&tweet_id=' + this.tweetStatus.bottomTweetId.toString())).then(response => {
            if (type === 0) {
              this.notice("已更新"+response.data.data.tweets.length+"条推文", "success");
              //this.getUserInfo();
              if (response.data.data.top_tweet_id) {
                this.tweetStatus.topTweetId = response.data.data.top_tweet_id;
              }
              this.tweets = response.data.data.tweets.concat(this.tweets);
              this.load.top = false;
            } else {
              this.tweetStatus.moreTweets = response.data.data.hasmore;
              if (response.data.data.bottom_tweet_id) {
                this.tweetStatus.bottomTweetId = response.data.data.bottom_tweet_id;
              }
              this.tweets = this.tweets.concat(response.data.data.tweets);
              this.load.bottom = false;
            }
          }).catch(error => {
            this.notice(error, 'error');
            this.load[(type === 0 ? 'top' : 'bottom')] = false;
          });
        } else {
          this.notice("缺少参数", "error");
        }
      },
      getUserInfo: function (name) {
        this.load.leftCard = true;
        axios.get(this.basePath + '/api/v2/data/userinfo/?name=' + name).then(response => {
          this.info = response.data.data;
          if (response.data.code === 200) {
            this.chart.chartSettings.legendName = {'关注者': '关注者 ' + this.info.followers, '正在关注': '正在关注 ' + this.info.following, '总推文数': '总推文数 ' + this.info.statuses_count};
            this.createChart();
          } else {
            this.notice(response.data.message, "error");
            this.chart.chartSettings.legendName = {'关注者': '关注者', '正在关注': '正在关注', '总推文数': '总推文数'};
            this.tweetStatus.userExist = false;
          }
          this.load.leftCard = false;
        }).catch(error => {
          this.notice(error, "error");
          //this.load.leftCard = false;
        });
      },
      createChart: function(){
        axios.get(this.basePath + '/api/v2/data/chart/?uid=' + this.info.uid).then(response => {
          this.chart.chartData.rows = response.data.data;
          if (!this.chart.chartData.rows.length) {
            this.notice("chart: " + response.data.message, "warning");
          }
        }).catch(error => {
          this.notice('加载失败，请稍后再试 #' + error, 'error');
        });
      },
      update: function () {
        axios.get(this.mergeUrl()).then(response => {
          this.tweets = response.data.data.tweets;
          this.tweetStatus.moreTweets = response.data.data.hasmore;
          this.tweetStatus.topTweetId = response.data.data.top_tweet_id;
          this.tweetStatus.bottomTweetId = response.data.data.bottom_tweet_id;
          this.load.timeline = false;
          this.tweetStatus.reload = response.data.code !== 200;
        }).catch(error => {
          this.notice(error, 'error');
          this.load.timeline = false;
          this.tweetStatus.reload = true;
        })
      },
      mergeUrl: function () {
        //拼装url
        let url = this.basePath + '/api/v2/data/';
        //一层
        switch (this.tweetStatus.displayType) {
          case "timeline":
          case "status":
            url += 'tweets/';
            break;
          case "tag":
            this.search.keywords = '';
            url += (this.tag.type ? 'symbol/' : 'hashtag/') + '?hash=' + this.tag.text;
            break;
          case "search":
            url += 'search/';
            break;
        }
        //date
        if (this.search.mode === 1 && this.search.keywords) {
          url += '?name=' + this.name + '&date=' + Date.parse(this.search.keywords+' GMT'+this.userTimeZone)/1000;
        }
        else if (this.search.keywords && this.tweetStatus.displayType === 'search') {
          url += '?q=' + this.search.keywords;
        }
        //二层
        else if(this.tweetStatus.displayType === 'timeline') {
          url += '?name=' + this.name + '&display=' + this.tweetStatus.display;
        }
        //status
        else if (this.tweetStatus.displayType === 'status') {
          url += '?name=' + this.name + '&is_status=1&tweet_id=' + this.$route.params.status;
        }
        return url;
      },
      routeCase: function () {
        //none
        if (this.$route.path === '/') {
          this.home = true;
          this.changeTitle('Twitter Monitor');
          this.search.keywords = '';
          this.tweetStatus.displayType = 'userSelector';
          this.search.mode = 0;
          return;
        }
        this.home = false;
        //project
        if (this.$route.params.project) {
          this.project = this.$route.params.project;
          this.search.keywords = '';
          if (this.$route.params.name) {
            this.$router.replace({path: '/'+this.$route.params.name+(this.$route.params.status ? ('/status/' + this.$route.params.status + '/') : (this.$route.params.display ? ('/' + this.$route.params.display + '/') : '/all/'))});
          } else {
            this.changeTitle(this.project + ' / Twitter Monitor');
            this.tweetStatus.displayType = 'userSelector';
          }
        }
        //name
        if (this.$route.params.name) {
          this.name = this.$route.params.name;
          this.tweetStatus.displayType = 'timeline';
          //display
          if (this.$route.params.display) {
            switch (this.$route.params.display.toLowerCase()) {
              case "self":
                this.tweetStatus.display = 'self';
                break;
              case "retweet":
                this.tweetStatus.display = 'retweet';
                break;
              case "media":
                this.tweetStatus.display = 'media';
                break;
              default:
                //all
                this.tweetStatus.display = 'all';
            }
            return;
          } else if (this.$route.params.status) {
            //status
            this.tweetStatus.displayType = 'status';
            return;
          } else {
            this.$router.replace({path: '/'+this.name+'/all/'});
          }
        }
        //hashtag & cashtag
        if (this.$route.params.hashtag || this.$route.params.cashtag) {
          this.tag.text = this.$route.params.hashtag ? this.$route.params.hashtag : this.$route.params.cashtag;
          this.tag.type = this.$route.params.hashtag ? 0 : 1;
          this.tweetStatus.displayType = 'tag';
          this.load.leftCard = false;
          return;
        }
        //search
        if (this.$route.params.search) {
          this.search.keywords = this.$route.params.search;
          this.load.leftCard = false;
          this.tweetStatus.displayType = 'search';
        }
      },
      localrun: function() {
        //localStorage
        if (!localStorage.getItem('tm_settings')) {
          localStorage.setItem('tm_settings', JSON.stringify(this.settings.data));//提前写入
        } else {
          this.settings.data = JSON.parse(localStorage.getItem('tm_settings'));
        }
      },
      notice: function(text, status = 'success') {
        this.$message({
          message: text,
          type: status
        });
      },
      //nsfwSearcher: function (name){
      //  this.nsfwList.forEach(function(nsfwname) {
      //    if(name.toLowerCase() === nsfwname){
      //      return true;
      //    }
      //  });
      //  return false;
      //},
    },
  }
</script>

<style>
  #app {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: scroll;
  }
  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>

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
              <svg class="bi bi-chevron-left text-success" width="30" height="30" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M13.354 3.646a.5.5 0 010 .708L7.707 10l5.647 5.646a.5.5 0 01-.708.708l-6-6a.5.5 0 010-.708l6-6a.5.5 0 01.708 0z" clip-rule="evenodd"/>
              </svg>
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
                          <svg v-if="info.verified" class="text-primary" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"></path>
                          </svg>
                          <svg v-if="info.deleted" class="bi bi-trash text-danger" width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M6 6v8.5c0 .47.124.874.297 1.144.177.275.361.356.489.356h6.428c.127 0 .312-.08.489-.356.173-.27.297-.673.297-1.144V6h1v8.5c0 .634-.164 1.23-.456 1.685-.288.448-.747.815-1.33.815H6.786c-.583 0-1.042-.367-1.33-.815C5.164 15.73 5 15.134 5 14.5V6h1z" clip-rule="evenodd"/>
                            <path fill-rule="evenodd" d="M7.5 7.5A.5.5 0 018 8v6a.5.5 0 01-1 0V8a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V8a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V8a.5.5 0 01.5-.5zm3-3.5h-11v1h11V4zm-11-1a1 1 0 00-1 1v1a1 1 0 001 1h11a1 1 0 001-1V4a1 1 0 00-1-1h-11z" clip-rule="evenodd"/>
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 011 1v1H8V3z"/>
                          </svg>
                          <svg v-else-if="info.locked" class="bi bi-lock text-danger" width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M13.655 9H6.333c-.264 0-.398.068-.471.121a.73.73 0 00-.224.296 1.626 1.626 0 00-.138.59V15c0 .342.076.531.14.635.064.106.151.18.256.237a1.122 1.122 0 00.436.127l.013.001h7.322c.264 0 .398-.068.471-.121a.73.73 0 00.224-.296 1.627 1.627 0 00.138-.59V10c0-.342-.076-.531-.14-.635a.658.658 0 00-.255-.237 1.123 1.123 0 00-.45-.128zm.012-1H6.333C4.5 8 4.5 10 4.5 10v5c0 2 1.833 2 1.833 2h7.334c1.833 0 1.833-2 1.833-2v-5c0-2-1.833-2-1.833-2zM6.5 5a3.5 3.5 0 117 0v3h-1V5a2.5 2.5 0 00-5 0v3h-1V5z" clip-rule="evenodd"/>
                          </svg>
                        </h5>
                        <p>
                          <small>
                            <a :href="`//twitter.com/`+info.name" target="_blank" class="text-dark">@{{ info.name }}</a>
                          </small>
                        </p>
                      </div>
                    </div>
                    <div v-html="`<p class='card-text'>`+info.description+`</p>`"></div>
                    <div v-if="info.translate_source === ''" class='card-text'>
                      <span style="cursor:pointer"><small style="color:#1DA1F2" @click="translate(-1, info.uid)">翻译简介</small></span>
                    </div>
                    <div v-else-if="info.translate_source === 'pending'" class="spinner-grow spinner-grow-sm" style="color: #1DA1F2" role="status">
                      <span class="sr-only">Loading...</span>
                    </div>
                    <div v-else>
                      <hr class="my-4">
                      <p class='card-text'><small class="text-muted">由 {{ info.translate_source }} 翻译</small></p>
                      <p v-if="info.translate" v-html="`<p class='card-text'>`+info.translate+`</p>`"></p>
                      <span style="cursor:pointer"><small style="color: #1DA1F2" @click="translate(-1, info.uid)">重新翻译</small></span>
                    </div>
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
                              <svg class="bi" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"></path>
                              </svg>
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
                          <svg class="bi bi-image text-success" width="2em" height="2em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M16.002 4h-12a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 00-1-1zm-12-1a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2h-12z" clip-rule="evenodd" />
                            <path d="M12.648 9.646a.5.5 0 01.577-.093l3.777 1.947V16h-14v-2l2.646-2.354a.5.5 0 01.63-.062l2.66 1.773 3.71-3.71z" />
                            <path fill-rule="evenodd" d="M6.502 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clip-rule="evenodd" />
                          </svg>
                        </span>
                          <svg v-if="tweet.video === '1'" class="bi bi-camera-video text-danger" width="2em" height="2em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M4.667 5.5c-.645 0-1.167.522-1.167 1.167v6.666c0 .645.522 1.167 1.167 1.167h6.666c.645 0 1.167-.522 1.167-1.167V6.667c0-.645-.522-1.167-1.167-1.167H4.667zM2.5 6.667C2.5 5.47 3.47 4.5 4.667 4.5h6.666c1.197 0 2.167.97 2.167 2.167v6.666c0 1.197-.97 2.167-2.167 2.167H4.667A2.167 2.167 0 012.5 13.333V6.667z" clip-rule="evenodd"/>
                            <path fill-rule="evenodd" d="M13.25 7.65l2.768-1.605a.318.318 0 01.482.263v7.384c0 .228-.26.393-.482.264l-2.767-1.605-.502.865 2.767 1.605c.859.498 1.984-.095 1.984-1.129V6.308c0-1.033-1.125-1.626-1.984-1.128L12.75 6.785l.502.865z" clip-rule="evenodd"/>
                          </svg>
                          <a :href="`//twitter.com/i/status/`+tweet.tweet_id" target="_blank">
                            <svg class="bi bi-box-arrow-up-right text-primary" width="2em" height="2em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd" d="M3.5 15A1.5 1.5 0 005 16.5h8a1.5 1.5 0 001.5-1.5v-4a.5.5 0 00-1 0v4a.5.5 0 01-.5.5H5a.5.5 0 01-.5-.5V7a.5.5 0 01.5-.5h4a.5.5 0 000-1H5A1.5 1.5 0 003.5 7v8zm7-11a.5.5 0 01.5-.5h5a.5.5 0 01.5.5v5a.5.5 0 01-1 0V4.5H11a.5.5 0 01-.5-.5z" clip-rule="evenodd"/>
                              <path fill-rule="evenodd" d="M16.354 3.646a.5.5 0 010 .708l-8 8a.5.5 0 01-.708-.708l8-8a.5.5 0 01.708 0z" clip-rule="evenodd"/>
                            </svg>
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
                          <!--translate-->
                          <div v-if="tweet.translate_source === ''" class='card-text'>
                            <span style="cursor:pointer" class="text-decoration-none"><small style="color:#1DA1F2" @click="translate(order)">翻译推文</small></span>
                          </div>
                          <div v-else-if="tweet.translate_source === 'pending'" class="spinner-grow spinner-grow-sm" role="status" style="color:#1DA1F2">
                            <span class="sr-only">Loading...</span>
                          </div>
                          <div v-else>
                            <hr class="my-4">
                            <p class='card-text'><small class="text-muted">由 {{ tweet.translate_source }} 翻译</small></p>
                            <p v-if="tweet.translate" v-html="`<p class='card-text'>`+tweet.translate+`</p>`"></p>
                            <span style="cursor:pointer" class="text-decoration-none"><small style="color:#1DA1F2" @click="translate(order)">重新翻译</small></span>
                          </div>
                          <!--media-->
                          <template v-if="tweet.media === '1'&&!settings.data.displayPicture">
                            <div class="my-4"></div>
                            <image-list :list="tweet.mediaObject.tweetsMedia" :is_video="tweet.video" :basePath="basePath"/>
                          </template>
                          <!--quote-->
                          <template v-if="tweet.quote_status !== '0'">
                            <div class="my-4"></div>
                            <div class="container">
                              <div class="card mb-3">
                                <div class='card-body'>
                                  <span class="card-text" v-if="!tweet.quoteObject.full_text">这条推文不可用。</span>
                                  <template v-else>
                                    <div>
                                      <span class="text-muted">{{ tweet.quoteObject.display_name }}</span>
                                      <el-divider direction="vertical"></el-divider>
                                      <small>@{{ tweet.quoteObject.name }}</small>
                                      <a :href="`//twitter.com/i/status/`+tweet.quoteObject.tweet_id" target="_blank">
                                        <svg class="bi bi-box-arrow-up-right text-primary" width="2em" height="2em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                          <path fill-rule="evenodd" d="M3.5 15A1.5 1.5 0 005 16.5h8a1.5 1.5 0 001.5-1.5v-4a.5.5 0 00-1 0v4a.5.5 0 01-.5.5H5a.5.5 0 01-.5-.5V7a.5.5 0 01.5-.5h4a.5.5 0 000-1H5A1.5 1.5 0 003.5 7v8zm7-11a.5.5 0 01.5-.5h5a.5.5 0 01.5.5v5a.5.5 0 01-1 0V4.5H11a.5.5 0 01-.5-.5z" clip-rule="evenodd"/>
                                          <path fill-rule="evenodd" d="M16.354 3.646a.5.5 0 010 .708l-8 8a.5.5 0 01-.708-.708l8-8a.5.5 0 01.708 0z" clip-rule="evenodd"/>
                                        </svg>
                                      </a>
                                    </div>
                                    <div class="my-4"></div>
                                    <div v-html="`<p class='card-text'>`+tweet.quoteObject.full_text+`</p>`"></div>
                                    <!--media-->
                                    <template v-if="tweet.quoteObject.media === '1'&&!settings.data.displayPicture">
                                      <div class="my-4"></div>
                                      <image-list :list="tweet.mediaObject.quoteMedia" :is_video="tweet.quoteObject.video" :basePath="basePath"/>
                                    </template>
                                    <div id="quotefoot">
                                      <small class="text-muted">{{ (new Date(tweet.quoteObject.time * 1000)).toLocaleString(settings.data.language) }}</small>
                                    </div>
                                  </template>
                                </div>
                              </div>
                            </div>
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
  Vue.use(VueRouter);
  export default {
    name: 'App',
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
      translate: function (order = -1, uid = 0) {
        if (order+1) {
          this.tweets[order].translate_source = "pending";
          axios.get(this.basePath + '/api/v2/data/translate/?tr_type=tweets&tweet_id=' + this.tweets[order].tweet_id+ '&to=' + this.settings.data.language).then(response => {
            this.tweets[order].translate = response.data.data.translate;
            this.tweets[order].translate_source = response.data.data.translate_source;
          }).catch(error => {
            this.notice(error, "error");
            this.tweets[order].translate = '';
          })
        } else if (uid) {
          this.info.translate_source = "pending";
          axios.get(this.basePath + '/api/v2/data/translate/?tr_type=profile&uid=' + uid+ '&to=' + this.settings.data.language).then(response => {
            this.info.translate = response.data.data.translate;
            this.info.translate_source = response.data.data.translate_source;
          }).catch(error => {
            this.notice(error, "error");
            this.info.translate = '';
          })
        } else {
          this.notice("无输入", "error");
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
    components: {
      twCard,
      searchTips,
      //htmlText,
      imageList,
      twPolls,
    }
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

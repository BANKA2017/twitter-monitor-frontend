<template>
  <div id="online-about">
      <div class="container" id="main" role="main">
          <div class="row">
              <div class="col-lg-3">
                  <div style="position: sticky; top: 1rem;" >
                      <div class="fs-2 fw-bold w-100 text-start">Twitter Monitor</div>
                      <div class="mb-3" style="padding-left: 5px"><local-router /></div>
                      <el-divider class="my-2" />
                      <div class="mb-2 text-muted"><small>NEST.MOE</small></div>
                  </div>
              </div>
              <div class="col-lg-9">
                  <h3 class="my-3">About Twitter Monitor</h3>
                  <h3>免责声明</h3>
                  <p>由于我们后端对广告内容的筛选策略可能会导致部分内容缺失，所以时间线可能会出现断章取义的现象。</p>
                  <el-divider class="my-4" />
                  <h3>用户数据</h3>
                  <ul>
                      <li>我们会保存来源的 <code>ip</code>、<code>国家/地区</code>、<code>user-agent</code>、<code>地址/状态</code>、<code>cf-ray</code>、<code>referer</code> 作为Log以及后续分析，如有需要可向我们发送删除请求</li>
                      <li>我们使用 Cloudflare 作为 后端cdn 以及域名解析用，这里仅作告知</li>
                      <li>我们使用 Google Analytics 作为数据分析，如有不适可使用<code>一些广告拦截工具</code>对相关域名进行拦截</li>
                      <li>我们使用 Vercel 进行前端的部署，因为使用的是免费版，我们无法从此得到可分析数据</li>
                      <li>Online Mode 状态下的内容仅作为Twitter的镜像，并不保存在本地，如有删除的需要请直接向Twitter提出删除对应推文的要求</li>
                      <li class="text-danger">除此以外，我们没有再使用其他任何第三方分析工具，如果您发现有多余的请求或cookie，可能说明您正在遭受中间人攻击</li>
                  </ul>
                  <el-divider class="my-4" />
                  <h3>交流</h3>
                  <p>有何意见，有何建议，畅所欲言，但请不要发出您认为不应该在群组作出的发言，<abbr title="Safe For Work">SFW</abbr>，谢绝广告</p>
                  <ul>
                      <li>Telegram群：<a href="https://t.me/tmtg_cn" target="_blank">https://t.me/tmtg_cn</a></li>
                      <li>GitHub Discussions：<a href="https://github.com/BANKA2017/twitter-monitor/discussions" target="_blank">BANKA2017/twitter-monitor Discussions</a></li>
                  </ul>
                  <el-divider class="my-4" />
                  <h3>未来</h3>
                  <p>会加交互功能吗？也许吧……但短期内不会公开，就像当初online mode那样。</p>
                  <el-divider class="my-4" />
                  <h3>开源</h3>
                  <p>前端，后端与爬虫均以 <code>MIT</code> 协议开源</p>
                  <a class="text-decoration-none" href="https://github.com/BANKA2017/twitter-monitor-frontend" target="_blank">
                      <el-button class="mx-1 my-1" round size="small">前端</el-button>
                  </a>
                  <a class="text-decoration-none" href="https://github.com/BANKA2017/twitter-monitor" target="_blank">
                      <el-button class="mx-1 my-1" round size="small">后端 & 爬虫</el-button>
                  </a>
                  <p class="my-1">本项目使用或参考了以下项目</p>
                  <ul>
                      <li>bootstrap v5 | popper.js | bootstrap-icon（bootstrap三件套）</li>
                      <li>element-plus（不断吐槽但还得用）</li>
                      <li>vue3 | vue-router | vuex | vue-i18n | vue-gtag（vue工具包）</li>
                      <li>vite | typescript | vite-plugin-pwa（打包）</li>
                      <li>echarts（图表）</li>
                      <li>twemoji（统一emoji）</li>
                      <li>lodash（猜猜用来干啥了）</li>
                      <li>plyr（播放器）</li>
                      <li>@vueuse/head（修改 header）</li>
                      <el-divider class="my-2" />
                      <li>node.js (all in js)</li>
                      <li>express.js (backend)</li>
                      <li>itty-router (cloudflare workers backend)</li>
                      <li>sequelize (orm)</li>
                  </ul>
                  <el-divider class="my-4" />
                  <div class="text-center"> >_ Twitter Monitor</div>
                  <div class="my-4"></div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import {useHead} from "@vueuse/head"
import ArrowLeft from "../icons/ArrowLeft.vue"
import {defineComponent} from "vue"
import SinglePageHeader from "../components/SinglePageHeader.vue"
import LocalRouter from "../components/LocalRouter.vue";
import LinkList from "../components/LinkList.vue";
export default defineComponent({
  components: {LinkList, LocalRouter, SinglePageHeader, ArrowLeft},
  setup() {
    useHead({
      title: '关于',
    })
  }})
</script>

<style scoped>

</style>

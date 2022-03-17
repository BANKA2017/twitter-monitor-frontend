<template>
  <div id="about">
    <single-page-header title="关于" />
    <div class="container">
      <div class="row">
        <div class="col-md-10 offset-md-1">
          <h3>以前的事</h3>
          <p>爬Twitter这事我已经不是第一天干了，最早可以追溯到2016年底，虽然本站几乎所有代码都经过一次甚至数次重写，但是思路就源于那个时候</p>
          <p>那时我还在住校，没有电脑，没有ide，只有一台手机和安装着的文本编辑器，用着免费的RedHat OpenShift Online的机器。当年主要是为了爬内容发贴吧拿吧主，但后来吧主拿下来了，转推机还是保留了下来，一是为了保持发帖量保吧主，二是我觉得这玩意对于还是特殊人群有用的</p>
          <p>但好景不长，后来贴吧删封愈加严重，我为了账号停掉了断断续续运转了两年的转推机</p>
          <p>后来看到<a href="https://twi.lovelive.cx" target="_blank">愿光蓝鸟</a>上线，本来也有些想法的我，开始为本项目码下第一行代码并持续维护至今</p>
          <p class="small" style="color: white">
            做网页的想法其实是来自看到的一篇文章，提到某国前总统喜欢删推，所以我一直想记录下来</p>
          <hr class="my-4">
          <h3>碰过的坑</h3>
          <p>坑肯定碰过不少，我能想到的、能整理的暂时都总结在下面，希望能对后来者有所帮助</p>
          <a class="text-decoration-none" href="https://blog.nest.moe/2020/02/26/how-to-crawl-twitter/" target="_blank">
            <el-button class="mx-1 my-1" round size="mini">怎么爬 Twitter</el-button>
          </a>
          <a class="text-decoration-none" href="https://blog.nest.moe/2021/05/12/how-to-crawl-twitter-with-graphql/" target="_blank">
            <el-button class="mx-1 my-1" round size="mini">怎么爬 Twitter （GraphQL）</el-button>
          </a>
          <a class="text-decoration-none" href="https://blog.nest.moe/2020/03/08/about-element-ui/" target="_blank">
            <el-button class="mx-1 my-1" round size="mini">使用Element-ui遇到的坑</el-button>
          </a>
          <hr class="my-4">
          <h3>关于旧版（v1）</h3>
          <p>虽然旧的版本的数据不再更新，但还是可以访问的，<a href="https://tm.bangdream.fun/tmv1/" target="_blank">回到旧版</a>，即将合并旧版数据</p>
          <a class="text-decoration-none" href="https://github.com/BANKA2017/twitter-monitor/tree/8f7aad304f4a2377e40ac8b0db9b0801d6a01751" target="_blank">
            <el-button class="mx-1" round size="mini">GitHub</el-button>
          </a>
          <hr class="my-4">
          <h3>数据公开</h3>
          <a class="text-decoration-none" href="https://5my-my.sharepoint.com/:f:/g/personal/kasumi_bangdream_fun/En34oC5-535Eng8isHx5XqwB5-Di45HavsLVUEMCLUBC0w"
             target="_blank">
            <el-button class="mx-1" round size="mini">数据库备份</el-button>
          </a>
          <ul >
            <li>tmv1（每帐号早于2019-05-12的约800条推文 ~ 2020-02-28）</li>
            <li>tmv2（约2020年初 ~ 2021-05-12）</li>
          </ul>
          <hr class="my-4">
          <h3>中立性</h3>
          <p>本站仅对推文进行存档以及分析展示，展示的内容不应被视为对其中包含的观点或隐私政策的认可，如有必要，本站可能会对相关推文进行隐藏处理</p>
          <hr class="my-4">
          <h3>可信来源</h3>
          <p>尽管我们会尽我们所能确保数据的真实性，但您不应该将 Twitter Monitor 的内容视为可信来源</p>
          <hr class="my-4">
          <h3>用户数据</h3>
          <ul>
            <li>我们会保存来源的 <code>ip</code>、<code>国家/地区</code>、<code>user-agent</code>、<code>地址/状态</code>、<code>cf-ray</code>、<code>referer</code> 作为Log以及后续分析，如有需要可向我们发送删除请求</li>
            <li>我们使用 Cloudflare 作为 后端cdn 以及域名解析用，这里仅作告知</li>
            <li>我们使用 Google Analytics 作为数据分析，如有不适可使用<code>一些广告拦截工具</code>对相关域名进行拦截</li>
            <li>我们使用 Vercel 进行前端的部署，因为使用的是免费版，我们无法从此得到可分析数据</li>
            <li class="text-danger">除此以外，我们没有再使用其他任何第三方分析工具，如果您发现有多余的请求或cookie，可能说明您正在遭受中间人攻击</li>
          </ul>
          <hr class="my-4">
          <h3>交流</h3>
          <p>有何意见，有何建议，畅所欲言，但请不要发出您认为不应该在群组作出的发言，<abbr title="Safe For Work">SFW</abbr>，谢绝色图，谢绝键政，谢绝梯子</p>
          <ul>
            <li>Telegram群：<a href="https://t.me/tmtg_cn" target="_blank">https://t.me/tmtg_cn</a></li>
          </ul>
          <hr class="my-4">
          <h3>开源</h3>
          <p>前端，后端与爬虫均以 <code>MIT</code> 协议开源</p>
          <a class="text-decoration-none" href="https://github.com/BANKA2017/twitter-monitor-frontend" target="_blank">
            <el-button class="mx-1 my-1" round size="mini">前端</el-button>
          </a>
          <a class="text-decoration-none" href="https://github.com/BANKA2017/twitter-monitor" target="_blank">
            <el-button class="mx-1 my-1" round size="mini">后端 & 爬虫</el-button>
          </a>
          <p class="my-1">本项目使用或参考了以下项目</p>
          <ul>
            <li>bootstrap v4 | jquery | popper.js | bootstrap-icon（bootstrap四件套）</li>
            <li>element-plus（不断吐槽但还得用）</li>
            <li>vue3 | vue-router | vuex | vue-i18n | vue-gtag（vue工具包）</li>
            <li>vite | typescript | vite-plugin-pwa（打包）</li>
            <li>echarts（图表）</li>
            <li>twemoji（统一emoji）</li>
            <li>lodash（猜猜用来干啥了）</li>
            <li>plyr（播放器）</li>
            <li>@vueuse/head（修改 header）</li>
            <li>blurhash（模糊化图片）</li>
          </ul>
          <hr class="my-4">
          <div class="text-center">
            <el-button circle @click="$router.go(-1)"><arrow-left height="1em" status="" width="1em"/></el-button>
          </div>
          <div class="my-4"></div>
          <div class="text-center"> >_ Twitter Monitor</div>
          <div class="my-4"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {useHead} from "@vueuse/head"
import ArrowLeft from "@/icons/ArrowLeft.vue"
import {defineComponent} from "vue"
import SinglePageHeader from "@/components/SinglePageHeader.vue"
export default defineComponent({
  components: {SinglePageHeader, ArrowLeft},
  setup() {
    useHead({
      title: '关于',
      meta: [{
        name: "theme-color",
        content: "#1da1f2"
      }]
    })
  }})
</script>

<style scoped>

</style>

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
          <a class="text-decoration-none" href="https://blog.nest.moe/2020/02/27/how-to-crawl-twitter/" target="_blank">
            <el-button class="mx-1 my-1" round size="mini">怎么爬 Twitter</el-button>
          </a>
          <a class="text-decoration-none" href="https://blog.nest.moe/2021/05/12/how-to-crawl-twitter-with-graphql/" target="_blank">
            <el-button class="mx-1 my-1" round size="mini">怎么爬 Twitter （GraphQL）</el-button>
          </a>
          <a class="text-decoration-none" href="https://blog.nest.moe/2020/03/08/about-element-ui/About.vue" target="_blank">
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
          <p>尽管我们会尽我们所能确保数据的真实性，但用户不应该将 Twitter Monitor 的内容视为可信来源</p>
          <hr class="my-4">
          <h3>GDPR</h3>
          <p>根据相关法律法规，本站不对欧盟用户提供服务。</p>
          <hr class="my-4">
          <h3>交流</h3>
          <p>有何意见，有何建议，畅所欲言，但请不要发出您认为不应该在群组作出的发言，<abbr title="Safe For Work">SFW</abbr>，谢绝色图，谢绝键政，谢绝梯子</p>
          <ul>
            <li>Telegram群：<a href="https://t.me/tmtg_cn" target="_blank">https://t.me/tmtg_cn</a></li>
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

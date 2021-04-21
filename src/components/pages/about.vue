<template>
    <div id="about" v-once>
        <div class="jumbotron jumbotron-fluid" style="background-color: #1da1f2">
            <div class="container">
                <h1 class="display-4" style="color: white">关于</h1>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-md-10 offset-1">
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
                    <a href="https://blog.nest.moe/2020/02/26/how-to-crawl-twitter/" target="_blank">
                      <el-button class="text-decoration-none mx-1" round size="mini">怎么爬 Twitter</el-button>
                    </a>
                  <a href="https://blog.nest.moe/2020/03/08/about-element-ui/" target="_blank">
                    <el-button class="text-decoration-none mx-1" round size="mini">使用Element-ui遇到的坑</el-button>
                  </a>
                  <hr class="my-4">
                  <h3>关于旧版（v1）</h3>
                  <p><del>虽然旧的版本的数据不再更新，但还是可以访问的，<a href="https://bangdream.fun/tmv1/" target="_blank">回到旧版</a></del>，即将合并旧版数据</p>
                  <a href="https://github.com/BANKA2017/twitter-monitor/tree/8f7aad304f4a2377e40ac8b0db9b0801d6a01751" target="_blank">
                    <el-button class="text-decoration-none mx-1" round size="mini">GitHub</el-button>
                  </a>
                  <a href="https://5my-my.sharepoint.com/:u:/g/personal/chika_aqours_in/EZG4nGGnvJBFnVtIwFcOfpoBhMIYRfzBdZI8FiT8IJU9eQ?e=eZWVua"
                     target="_blank">
                    <el-button class="text-decoration-none mx-1" round size="mini">数据库备份</el-button>
                  </a>
                  <hr class="my-4">
                  <h3>中立性</h3>
                  <p>本站仅对推文进行存档以及分析展示，展示的内容不应被视为对其中包含的观点或隐私政策的认可，对于可能有争议的内容，本站会尽可能快地对内容进行<span style="color: red"><i class="el-icon-warning"></i>  标红警告</span>，如有必要，本站可能会对相关推文进行隐藏处理</p>
                  <hr class="my-4">
                  <h3>交流</h3>
                  <p>有何意见，有何建议，畅所欲言，但请不要发出您认为不应该在群组作出的发言，<abbr title="Safe For Work">SFW</abbr>，谢绝色图，谢绝键政，谢绝梯子</p>
                  <ul>
                    <li>Twitter Monitor计划 qq 群：<a href="https://jq.qq.com/?_wv=1027&k=oRfJSsNF" target="_blank">959374432</a></li>
                    <li>Telegram群：<a href="https://t.me/tmtg_cn" target="_blank">https://t.me/tmtg_cn</a></li>
                  </ul>
                  <hr class="my-4">
                  <div class="text-center">
                    <el-button icon="el-icon-back" circle @click="$router.go(-1)"></el-button>
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
    export default {
        name: "about",
        metaInfo () {
            return {
                title: "关于",
                meta: [{
                    name: "theme-color",
                    content: "#1da1f2"
                }]
            }
        },
    }
</script>

<style scoped>

</style>

<template>
  <div id="devConfig">
    <div class="my-4"></div>
    <div class="container">
      <div class="row">
        <div class="col-md-8">
          <h4>创建配置文件 Config.json</h4>
          <nav>
            <div class="nav nav-tabs" id="nav-tab" role="list">
              <div is="a" v-for="(list, key) in {user: '帐户', url: '链接', nsfwList: 'NSFW列表'}" :id="`config-`+key+`-tab`"
                   :key="key" :aria-controls="`config-`+key"
                   :class="{'nav-item': true, 'nav-link': true, 'active': type === key}" aria-selected="true"
                   data-toggle="tab"
                   role="button" @click="type=key">{{ list }}
              </div>
            </div>
          </nav>
          <div class="tab-content" id="nav-tabContent">
            <div id="config-user"
                 :class="{'tab-pane': true, 'fade': true, 'show': type==='user', 'active': type==='user'}" role="panel">
              <template id="nameList">
                <div class="my-4"></div>
                <template v-for="(info, index) in userList">
                  <a :class="{'mb-1': true, 'text-decoration-none': true, 'badge': true, 'badge-pill': true, 'badge-success': info.organization, 'badge-primary': !info.organization}"
                     :href="`#item` + index" :key="index" role="button">{{ info.display_name }}</a>
                </template>
                <div class="my-4"></div>
              </template>
              <div :id="`item` + s" :key="`item`+s" v-for="(user, s) in config.users">
                <div class="form-group">
                  <label :for="`user`+s+`name`" :style="user.name ? '' : 'color: orange'">id</label>
                  <input :id="`user`+s+`name`" aria-describedby="idHelp" class="form-control" type="text"
                         v-model="config.users[s].name">
                  <small id="idHelp" class="form-text text-muted">Twitter帐号id</small>
                </div>
                <div class="form-group">
                  <label :for="`user`+s+`display_name`" :style="(!user.display_name && !user.name) ? 'color: red' : ''">备注</label>
                  <input :id="`user`+s+`display_name`" aria-describedby="display_nameHelp" class="form-control"
                         type="text" v-model="config.users[s].display_name">
                  <small id="display_nameHelp" class="form-text text-muted">留空则使用帐号名称</small>
                </div>
                <div class="form-group" v-if="user.uid">
                  <label :for="`user`+s+`uid`">UID</label>
                  <input :id="`user`+s+`uid`" aria-describedby="uidHelp" class="form-control" type="text"
                         v-model="config.users[s].uid">
                  <small id="uidHelp" class="form-text text-muted">Twitter帐号uid，无需理会</small>
                </div>
                <div v-if="user.projects.length">
                  <template v-for="(project, ss) in user.projects">
                    <div :key="ss">
                      <div class="input-group">
                        <input class="form-control" placeholder="一级目录" type="text"
                               v-model="config.users[s].projects[ss][0]">
                        <div :id="`project`+ss" class="input-group-append">
                          <span class="input-group-text">-></span>
                        </div>
                        <input class="form-control" placeholder="二级目录" type="text"
                               v-model="config.users[s].projects[ss][1]">
                        <div :id="`project`+ss" class="input-group-append">
                          <button @click="action('del', 'project', s, ss)" class="btn btn-outline-danger" type="button">
                            删除
                          </button>
                        </div>
                      </div>
                      <div class="my-4"></div>
                    </div>
                  </template>

                  <small class="form-text text-muted" id="projectHelp">两格从左到右分别是<code>一级目录|二级目录</code></small>
                </div>
                <template
                    v-for="(checkInfo, checkType) in {hidden: '隐藏此帐号', deleted: '帐号已删除', locked: '推文已被保护', organization: '机构帐号', not_analytics: '不统计数据'}">
                  <div :key="checkType" class="form-group form-check">
                    <input :id="`user`+s+checkType" class="form-check-input" type="checkbox"
                           v-model="config.users[s][checkType]">
                    <label :for="`user`+s+checkType" class="form-check-label">{{ checkInfo }}</label>
                  </div>
                </template>
                <button @click="action('add', 'project', s)" class="btn btn-primary">添加目录</button>
                <button :class="{'btn': true, 'btn-primary': true, 'disabled': (!user.display_name && !user.name)}"
                        @click="(!user.display_name && !user.name) ? '' : action('add', 'users', s)">新增帐号
                </button>
                <button @click="action('del', 'users', s)" class="btn btn-outline-danger"
                        v-if="config.users.length > 1">删除帐号
                </button>

                <hr class="my-4">
              </div>
            </div>
            <div id="config-url" :class="{'tab-pane': true, 'fade': true, 'show': type==='url', 'active': type==='url'}"
                 role="panel">
              <div :key="s" v-for="(url, s) in config.links">
                <div class="form-group">
                  <label :for="`url`+s+`url`"
                         :style="/(http|https|ftp):\/\/[^.]+\..*/gm.test(url.url) ? '' : 'color: red'">url</label>
                  <input :id="`url`+s+`url`" class="form-control" type="text" v-model="config.links[s].url">
                </div>
                <div class="form-group">
                  <label :for="`url`+s+`display`">别名</label>
                  <input :id="`url`+s+`display`" class="form-control" type="text" v-model="config.links[s].display">
                </div>
                <!--<div class="form-group">-->
                <!--<label :for="`url`+s+`badgeClass`">类型</label>-->
                <!--<select :id="`url`+s+`badgeClass`" v-model="config.links[s].badgeClass" class="form-control">-->
                <!--<option :value="badgeClass[0]" v-for="badgeClass in [['primary', 'Primary'], ['secondary', 'Secondary'], ['success', 'Success'], ['danger', 'Danger'], ['warning', 'Warning'],  ['info', 'Info'], ['light', 'Light'], ['dark', 'Dark']]">{{ badgeClass[1] }}</option>-->
                <!--</select>-->
                <!--</div>-->
                <button
                    :class="{'btn': true, 'btn-primary': true, 'disabled': !(/(http|https|ftp):\/\/[^.]+\..*/gm.test(url.url))}"
                    @click="/(http|https|ftp):\/\/[^.]+\..*/gm.test(url.url) ? action('add', 'links', config.links.length) : ''"
                    v-if="s+1 === config.links.length">增加
                </button>
                <button @click="action('del', 'links', s)" class="btn btn-outline-danger">删除</button>
                <hr class="my-4">
              </div>
              <template v-if="config.links.length===0">
                <div class="my-4"></div>
                <button @click="action('add', 'links')" class="btn btn-primary">增加</button>
              </template>
            </div>
            <div id="config-nsfwList"
                 :class="{'tab-pane': true, 'fade': true, 'show': type==='nsfwList', 'active': type==='nsfwList'}"
                 role="panel">
              <div class="my-4"></div>
              <div :key="s" v-for="(nsfwUser, s) in config.nsfwList">
                <div class="input-group">
                  <input :aria-describedby="`nsfwUser`+s" class="form-control" type="text" v-model="config.nsfwList[s]">
                  <div :id="`nsfwUser`+s" class="input-group-append">
                    <button
                        :class="{'btn': true, 'btn-primary': true, 'disabled': !(nsfwUser && s+1===config.nsfwList.length)}"
                        @click="((nsfwUser && s+1===config.nsfwList.length) ? action('add', 'nsfwList') : '')"
                        type="button" v-if="s+1===config.nsfwList.length">增加
                    </button>
                    <button @click="action('del', 'nsfwList', s)" class="btn btn-outline-danger" type="button">删除
                    </button>
                  </div>
                </div>
                <hr class="my-4">
              </div>
              <template v-if="config.nsfwList.length===0">
                <div class="my-4"></div>
                <button @click="action('add', 'nsfwList')" class="btn btn-primary">增加</button>
              </template>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <!--生成的数据-->
          <label for="uploadFile">导入配置文件</label>
          <div class="custom-file">
            <input @change="jsonFileChange" accept="application/json" class="custom-file-input" id="uploadFile"
                   lang="zh" type="file">
            <label class="custom-file-label" for="uploadFile">config.json</label>
          </div>
          <div class="my-4"></div>
          <button @click="download('config.json', JSON.stringify(config))" class="btn btn-primary btn-block">下载配置
          </button>
          <div class="my-4"></div>
          <div class="input-group">
            <textarea class="form-control" rows="10" v-model="textareaData"></textarea>
          </div>
          <div class="text-center">
            >_ Twitter Monitor
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "devConfig",
  data() {
    return {
      type: "user",//user links
      config: {
        users: [
          {
            name: "Example_user",
            display_name: "Example user",
            hidden: false,
            deleted: false,
            locked: false,
            organization: false,
            not_analytics: false,
            projects: [
              ["project1", "tag1"],
            ],
          }
        ],
        links: [
          {
            url: "https://example.com",
            display: "Example Domain",
            //badgeClass: "primary",
          }
        ],
        nsfwList: [],
      },
      Templates: {
        users: {
          name: "",
          display_name: "",
          hidden: false,
          deleted: false,
          locked: false,
          not_analytics: false,
          organization: false,
          projects: [],
        },
        links: {
          url: "",
          display: "",
          //badgeClass: "primary",
        }
      },
      textareaData: "",
      textareaSettings: {
        copy: false,
        style: false,
      },
      projects: [],
    }
  },
  computed: {
    userList: function () {
      return this.config.users.map(x => {
        return {name: x.name, display_name: x.display_name, organization: x.organization}
      })
    },
  },
  watch: {
    "config": {
      handler: function () {
        this.textareaData = JSON.stringify(this.config, null, 4);
      },
      deep: true,
    },
    "textareaData": function () {
      if (this.textareaData) {
        try {
          let textareaDataArray = JSON.parse(this.textareaData);
          if (textareaDataArray !== this.config && (textareaDataArray.users && textareaDataArray.links && textareaDataArray.nsfwList)) {
            this.config = textareaDataArray;
          }
        } catch {
          this.notice("无法解析的内容", "error")
        }
      }
    }
  },
  mounted: function () {
    if (localStorage.getItem('twitter_monitor_config')) {
      //this.config = JSON.parse(localStorage.getItem('twitter_monitor_config'));
      //this.autoSave();
    }
    this.textareaData = JSON.stringify(this.config, null, 4);
  },
  methods: {
    action: function (action, where = "users", l1 = 0, l2 = 0) {
      if (where) {
        switch (action) {
          case "add":
            switch (where) {
              case 'nsfwList':
                this.config.nsfwList = this.config.nsfwList.concat([""]);
                break;
              case 'project':
                this.config.users[l1].projects = this.config.users[l1].projects.concat([["", ""]]);
                break;
              default:
                this.config[where] = (l1 === this.config[where].length) ? this.config[where].concat(this.Templates[where]) : this.config[where].slice(0, l1 + 1).concat(this.Templates[where]).concat(this.config[where].slice(l1 + 1));
            }
            break;
          case "del":
            switch (where) {
              case 'project':
                this.config.users[l1].projects.splice(l2, 1);
                break;
              default:
                this.config[where].splice(l1, 1);
            }
            break;
        }
      }
    },
    jsonFileChange: function () {
      let oFReader = new FileReader();
      let oFile = document.getElementById("uploadFile").files[0];
      oFReader.readAsText(oFile);
      oFReader.onload = () => {
        try {
          this.config = JSON.parse(oFReader.result);
        } catch {
          this.notice('文件不可解析', "error")
        }
      }
    },
    download: function (filename, text) {
      let element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    autoSave: function () {
      localStorage.setItem('twitter_monitor_config', JSON.stringify(this.config));
      setTimeout(() => {
        this.autoSave()
      }, 30000);//每30秒保存
    },
  }
}
</script>

<style scoped>

</style>

# twitter-monitor-frontend v3 (DEV)

[ [EN](#Deploy) | [中文](#部署) ]

## Known issues

- Vue will auto **MERGE** all whitespaces to one, so we couldn't display all whitespace in text with more than 2 whitespaces

## About

The [Twitter Monitor Frontend](https://github.com/BANKA2017/twitter-monitor-frontend) is the front-end component designed for the [Twitter Monitor](https://github.com/BANKA2017/twitter-monitor), used to display data collected by the monitor or as a third-party client for browsing Twitter (without direct access to its backend).

All functions include but are not limited to 
- Browsing user tweets
- Translating tweets
- Searching tweets
- Bookmarking/Exporting tweets
- Downloading images/videos
- Listening to Spaces/Broadcasts

More information about Twitter monitor -> <https://github.com/BANKA2017/twitter-monitor>.

## Deploy

### Environment variables

```dotenv
  #deploy https://github.com/BANKA2017/twitter-monitor in local
  VITE_DEV_BASE_PATH="http://192.168.123.101:3000"
  VITE_PRO_BASE_PATH="https://example.com"
  
  VITE_ONLINE_PATH="https://example.com/online"
  
  #tw_emoji
  VITE_TW_EMOJI_PATH="https://twemoji.maxcdn.com/v/latest/"
  
  
  #do not empty
  VITE_MEDIA_PATH="https://example.com/media/"
  
  #Google analytics
  VITE_GA_ID=""

  ```

Copy the `.env.example` file located in the `~/app/*/` directory and rename it to `.env`, then edit the environment variables.

### Full mode

The package will include the complete Twitter Monitor page and modules, resulting in a larger file size. You will need to fill in all environment variables.

Demo: <https://tm.bangdream.fun>

### Online only mode

The package will only contain the Online Mode page, resulting in a smaller file size. Please fill in all environment variables except for `VITE_DEV_BASE_PATH` and `VITE_PRO_BASE_PATH`.

As `UserInfo` module is shared with the full version, `Tmv2ChartWithoutDataSet` module will be generated but not used in practice.

Demo: <https://tm.nest.moe>

## Translation

check more in `/libs/i18n/`, base language is **Chinese simplified（zh-hans）**

- 简体中文 (zh-hans)
- 繁體中文/正體中文 (zh-hant)
- English (en) (Need help)
- 日本語 (ja) (Need help)
- 한국어 (ko) (Need help)

## More

>When using history mode, the URL will look "normal," e.g. <http://oursite.com/user/id>. Beautiful!

>Here comes a problem, though: Since our app is a single page client side app, without a proper server configuration, the users will get a 404 error if they access <http://oursite.com/user/id> directly in their browser. Now that's ugly.

>Not to worry: To fix the issue, all you need to do is add a simple catch-all fallback route to your server. If the URL doesn't match any static assets, it should serve the same index.html page that your app lives in. Beautiful, again!

- setup  <https://router.vuejs.org/guide/essentials/history-mode.html>

## 中文

## 部署

### 环境变量

```dotenv
  #我将 https://github.com/BANKA2017/twitter-monitor 部署在本地
  VITE_DEV_BASE_PATH="http://192.168.123.101:3000"
  VITE_PRO_BASE_PATH="https://example.com"
  
  VITE_ONLINE_PATH="https://example.com/online"
  
  #tw_emoji
  VITE_TW_EMOJI_PATH="https://twemoji.maxcdn.com/v/latest/"
  
  
  #媒体文件代理请务必不要留空
  VITE_MEDIA_PATH="https://example.com/media/"
  
  #Google analytics
  VITE_GA_ID=""

  ```

您可以拷贝位于 `~/app/*/` 目录下的 `.env.example` 并重命名为 `.env`，然后编辑环境变量

### Full mode

将会包含完整的Twitter Monitor页面和模块，打包文件将会更大，您需要补充完整环境变量的每一项

Demo: <https://tm.bangdream.fun>

### Online only mode

将只包含 Online mode 的页面，打包文件更小，请补充环境变量除了 `VITE_DEV_BASE_PATH` 与 `VITE_PRO_BASE_PATH` 以外的每一项。

由于与完整版共用 `UserInfo` 模块，因此会为 `Tmv2ChartWithoutDataSet` 生成模块，但实际使用时并不会用到。


Demo: <https://tm.nest.moe>

## 翻译

检查目录 `/libs/i18n/` 了解更多，我只能确保 **简体中文（zh-hans）** 用词的准确性

- 简体中文 (zh-hans)
- 繁體中文/正體中文 (zh-hant)
- English (en) (Need help)
- 日本語 (ja) (Need help)
- 한국어 (ko) (Need help)

## 更多

本项目默认使用 `vue-router` 的 `history` 模式，请自行参考 `Vue` 官网进行服务器的配置，本项目自带一个 `vercel` 的配置文件

若需要使用 `hash` 模式，请自行修改 `/src/router/index.ts` 文件中的相关代码，我们不对 `hash` 模式下的代码的可用性负责

```typescript
// /src/router/index.ts
// history
export default createRouter({
  history: createWebHistory('/'),
  routes: [...]
})
// hash
export default createRouter({
  history: createWebHashHistory(),
  routes: [...]
})
```

## JetBrains Open Source development license

本项目重度依赖于JetBrains™ 全家桶，感谢JetBrains s.r.o为本项目提供 [开源许可证](https://jb.gg/OpenSourceSupport) ，如果你同样对开发充满热情并且经常使用JetBrains s.r.o的产品，你也可以尝试通过JetBrains官方渠道 [申请](https://www.jetbrains.com/shop/eform/opensource) 开源许可证以供核心开发者使用

![JetBrains Logo (Main) logo](https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.svg)

Copyright © 2022 JetBrains s.r.o.

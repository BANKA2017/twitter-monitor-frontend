# twitter-monitor-frontend v3 (DEV)

## How to

- Create file `.env.local`
- Edit file `.env.local`

  ```dotenv
  #deploy https://github.com/BANKA2017/twitter-monitor in local
  VITE_DEV_BASE_PATH="http://192.168.123.101/dev/bangdreamfunv2"
  
  VITE_PRO_BASE_PATH="https://example.com"
  
  #tw_emoji
  VITE_TW_EMOJI_PATH="https://twemoji.maxcdn.com/v/latest/"
  
  #keep empty if not deployed media proxy
  VITE_MEDIA_PATH="https://example.com/api/v2/media/"
  VITE_GA_ID=""//Google analytics

  ```

- `yarn`
- `yarn run dev`

## Translation

check more in `/src/i18n/`, base language is **Chinese simplified（zh-hans）**

- 简体中文 (zh-hans)
- 繁體中文/正體中文 (zh-hant)
- English (en) (Need help)
- 日本語 (ja) (Need help)
- 한국어 (ko) (Need help)

## Backend

[Twitter Monitor](https://github.com/BANKA2017/twitter-monitor)

## More

>When using history mode, the URL will look "normal," e.g. <http://oursite.com/user/id>. Beautiful!

>Here comes a problem, though: Since our app is a single page client side app, without a proper server configuration, the users will get a 404 error if they access <http://oursite.com/user/id> directly in their browser. Now that's ugly.

>Not to worry: To fix the issue, all you need to do is add a simple catch-all fallback route to your server. If the URL doesn't match any static assets, it should serve the same index.html page that your app lives in. Beautiful, again!

- setup  <https://router.vuejs.org/guide/essentials/history-mode.html>

## 中文

## 部署

- 创建文件 `.env.local` 并编辑

  ```dotenv
  #我将 https://github.com/BANKA2017/twitter-monitor 部署在本地
  VITE_DEV_BASE_PATH="http://192.168.123.101/dev/bangdreamfunv2"
  
  VITE_PRO_BASE_PATH="https://example.com"
  
  #tw_emoji
  VITE_TW_EMOJI_PATH="https://twemoji.maxcdn.com/v/latest/"
  
  #有独立的媒体代理时使用
  VITE_MEDIA_PATH="https://example.com/api/v2/media/"
  VITE_GA_ID=""//Google analytics

  ```

- `yarn`
- `yarn run dev`

## 翻译

检查目录 `/src/i18n/` 了解更多，我只能确保 **简体中文（zh-hans）** 用词的准确性
- 简体中文 (zh-hans)
- 繁體中文/正體中文 (zh-hant)
- English (en) (很烂)
- 日本語 (ja) (根本没有)
- 한국어 (ko) (根本没有)

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

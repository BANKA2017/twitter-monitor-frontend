# twitter-monitor-frontend v3 (DEV)

**NOT COMPLETE AND DO NOT USE THIS BRANCH**

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
- `vite`

## Translation

check more in `/src/i18n/`, base language is **Chinese simplified**

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
- `vite`

## 翻译

检查目录 `/src/i18n/` 了解更多，我只能保障简体中文的准确性
- 简体中文 (zh-hans)
- 繁體中文/正體中文 (zh-hant)
- English (en) (很烂)
- 日本語 (ja) (根本没有)
- 한국어 (ko) (根本没有)

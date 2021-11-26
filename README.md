# tmv2-frontend

## How to

- Create file `.env.local`
- Edit file `.env.local`

  ```dotenv
  #deploy https://github.com/BANKA2017/twitter-monitor in local
  VUE_APP_DEV_BASE_PATH="http://192.168.123.101/dev/bangdreamfunv2"
  
  VUE_APP_PRO_BASE_PATH="https://example.com"
  
  #tw_emoji
  VUE_APP_TW_EMOJI_PATH="https://twemoji.maxcdn.com/v/latest/"
  
  #keep empty if not deployed media proxy
  VUE_APP_MEDIA_PATH="https://example.com/api/v2/media/"
  VUE_APP_GA_ID=""//Google analytics

  ```

- `npm install`
- `npm serve`

## Translation

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

## 中文介绍 (Chinese version)

以后还是写中文好了，英语渣写得好难受

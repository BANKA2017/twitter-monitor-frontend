# tmv2-frontend

## How to

- Edit file named `.env`
- `npm install`
- `npm serve`

## Translation

- 简体中文 (zh-hans)
- 繁體中文/正體中文 (zh-hant)
- English (en)
- 日本語 (ja) (Need help)
- 한국어 (ko) (Need help)

## More

>When using history mode, the URL will look "normal," e.g. <http://oursite.com/user/id>. Beautiful!

>Here comes a problem, though: Since our app is a single page client side app, without a proper server configuration, the users will get a 404 error if they access <http://oursite.com/user/id> directly in their browser. Now that's ugly.

>Not to worry: To fix the issue, all you need to do is add a simple catch-all fallback route to your server. If the URL doesn't match any static assets, it should serve the same index.html page that your app lives in. Beautiful, again!

- setup  <https://router.vuejs.org/guide/essentials/history-mode.html>

## Project setup

```shell
npm install
```

## Compiles and hot-reloads for development

```shell
npx vue-cli-service serve
```

## Compiles and minifies for production

```shell
npx vue-cli-service build
```

## Lints and fixes files

```shell
npx vue-cli-service lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

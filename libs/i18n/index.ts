import {createI18n} from "vue-i18n";

import zhHans from './zh_hans.json'
import zhHant from './zh_hant.json'
import en from './en.json'

const i18n = createI18n<typeof zhHans, 'zh-cn' | 'zh-tw' | 'en'>({
  legacy: false,
  locale: 'zh-cn',
  fallbackLocale: 'en',
  messages: {
    'zh-cn': zhHans,
    'zh-tw': zhHant,
    'en': en,
  }
})

export {i18n}

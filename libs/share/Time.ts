//时间相关
const isDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches

const secondsToText = {1: 'second', 60: 'minute', 3600: 'hour', 86400: 'day'}

export {isDark, secondsToText}

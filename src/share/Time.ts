//时间相关
const isDark = (date: Date) => {
  return (date.getHours() >= 18 || date.getHours() < 6)
}

const secondsToText = {1: 'second', 60: 'minute', 3600: 'hour', 86400: 'day'}

export {isDark, secondsToText}

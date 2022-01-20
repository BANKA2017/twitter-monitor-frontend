//时间相关
const isDark = (date: Date) => {
  return (date.getHours() >= 18 || date.getHours() < 6)
}

export {isDark}

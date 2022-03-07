const RouterNameList = {
  main: new Set<string>('main'),
  timeline: new Set<string>(['hashtag', 'cashtag', 'search', 'name-display', 'name-status', 'no-name-status']),
  search: new Set<string>('search'),
  tag: new Set<string>(['hashtag', 'cashtag']),
  search_and_tag: new Set<string>(['hashtag', 'cashtag', 'search']),
  status: new Set<string>(['name-display', 'name-status', 'no-name-status']),
  settings: new Set<string>('settings'),
  online: new Set<string>(['online', 'online-status'])
}
export {RouterNameList}
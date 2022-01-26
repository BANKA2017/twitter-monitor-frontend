import {AccountList, Card, Chart, Entity, Media, Quote, Stats, Status, Tweet, UserInfo} from "@/type/Content";

export interface Api<T> {
  code: number
  message: string
  query: string
  version: 'v2' | 'v3' | 'test'
  data: T
}

export interface ApiAccounts extends Api<{
  account_info: AccountList
  projects: string[]
  nsfwList: []
  links: {url: string, display: string}[]
  hash: string
}> {}

export interface ApiUserInfo extends Api<UserInfo> {}

export interface ApiTweets extends Api<Tweet[]> {}

export interface ApiTranslate extends Api<{
  cache: boolean
  full_text_origin: string
  target: string
  translate: string
  translate_source: string
}> {}

//TODO new api
export interface ApiStatus extends Api<string[] | number[]> {}

export interface ApiStatusLegacy extends Api<Status[]> {}

export interface ApiStats extends Api<Stats[]> {}

//TODO new api
export interface ApiChart extends Api<string[] | number[]> {}

export interface ApiChartLegacy extends Api<Chart[]> {}

export interface ApiTrends extends Api<{
  timestamp: number
  hashtag_list: {text: string, count: number}[]
  tweet_time_list: number[]
  following: {name: string; display_name: string; header: string; count: number}[][]
  statuses: {name: string; display_name: string; header: string; count: number}[]
}> {}

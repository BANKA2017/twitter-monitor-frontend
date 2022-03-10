import {
  AccountList,
  LegacyChart,
  HashtagList,
  OnlineMedia,
  Stats,
  Status,
  Tweet,
  UserInfo,
} from "@/type/Content";

export interface Api<T> {
  code: number
  message: string
  query: string
  version: 'v2' | 'v3' | 'test' | 'compat_v3'
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

export interface ApiTweets extends Api<{
  bottom_tweet_id: string
  hasmore: boolean
  rss_mode: boolean
  top_tweet_id: string
  tweets: Tweet[]
}> {}

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
export interface ApiChart extends Api<(string | number)[][]> {}

export interface ApiChartLegacy extends Api<LegacyChart[]> {}

export interface ApiTrends extends Api<{
  timestamp: number
  hashtag_list: {text: string, count: number}[]
  tweet_time_list: number[]
  following: {name: string; display_name: string; header: string; count: number}[][]
  statuses: {name: string; display_name: string; header: string; count: number}[]
}> {}

export interface ApiOnline extends Api<{
  media_info: OnlineMedia[]
  video: boolean
  video_info: {
    aspect_ratio: number[]
    duration_millis: number
    variants: {
      bitrate?: number
      content_type: string
      url: string
    }[]
  } | {}
}> {}

export interface ApiHashtagList extends Api<{
  list: HashtagList[]
  start: number
  end: number
}> {}

export interface ApiStaffData {
  data: {
    display_name: string
    display_name_list: string[]
    name: string
    project: string
    uid: string
    followers: {[p: string]: {start: number; highest: number; lowest: number; end: number}}
    tweets_daily: {[p: string]: {
      card: {[q: string]: number}
      count: number
      hour_count: number[]
      link: string[]
      media: number
      origin: number
      quote_status_count: number
      retweet: number
      tag: string[]
      video_count: number
    }}
  }
  range: number[]
}

export type ApiLoveLiveDateList = string[]

export interface ApiLoveLiveData {
  data: {
    color: string
    display_name: string[]
    followers: {start: number; end: number; highest: number; lowest: number}[]
    name: string
    name_cn: string
    project: string
    team: string
    uid: string
    tweets: {
      card: string[]
      count: number
      hour_count: number[]
      link: {[p: string]: number}
      tag: {[p: string]: number}
      media: number
      origin: number
      quote_status_count: number
      retweet: number
      video_count: number
    }
  }[]
  range: { start: number; end: number }
}
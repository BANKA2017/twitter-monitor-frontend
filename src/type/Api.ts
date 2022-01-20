import {AccountList, Card, Entity, Media, Quote, Stats, Status} from "@/type/Content";

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

export interface ApiUserInfo extends Api<{
  uid: bigint
  uid_str: string
  name: string
  display_name: string
  header: string
  banner: bigint
  following: number
  followers: number
  description: string
  description_origin: string
  statuses_count: number
  top: string
  locked: number
  deleted: number
  verified: number
  description_entities: Entity[]
}> {}

export interface ApiTweets extends Api<{
  tweet_id: bigint
  tweet_id_str: string
  uid: bigint
  uid_str: string
  name: string
  display_name: string
  media: number
  video: number
  card: string
  poll: number
  quote_status: number
  source: string
  full_text: string
  full_text_origin: string
  retweet_from: string
  retweet_from_name: string
  dispute: number
  time: number
  type: string
  entities: Entity[]
  cardObject: Card
  quoteObject: Quote | []
  mediaObject: {
    tweetsMedia: Media[]
    "quoteMedia": Media[]
    "cardMedia": Media[]
  }
}> {}

//TODO new api
export interface ApiStatus extends Api<string[] | number[]> {}

export interface ApiStatusLegacy extends Api<Status[]> {}

export interface ApiStats extends Api<Stats[]> {}

//TODO new api
export interface ApiChart extends Api<string[] | number[]> {}

export interface ApiChartLegacy extends Api<{
  timestamp: number
  followers: number
  following: number
  statuses_count: number
}[]> {}

export interface ApiTrends extends Api<{
  timestamp: number
  hashtag_list: {text: string, count: number}[]
  tweet_time_list: number[]
  following: {name: string; display_name: string; header: string; count: number}[][]
  statuses: {name: string; display_name: string; header: string; count: number}[]
}> {}

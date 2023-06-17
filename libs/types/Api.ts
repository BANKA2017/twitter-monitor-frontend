import {
  AccountList,
  LegacyChart,
  HashtagList,
  OnlineMediaList,
  Stats,
  Status,
  Tweet,
  UserInfo, AudioSpace, LiveVideoContent, Entity,
} from "./Content";

export interface Api<T> {
  code: number
  message: string
  query?: string
  version: 'v2' | 'v3' | 'test' | 'compat_v3' | 'online' | 'album' | 'translate'
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
  entities: Entity[]
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

export interface ApiOnlineTrends extends Api<{
  name: string
  domainContext: string
  metaDescription?: string
  displayedRelatedVariants?: string[]
}[]> {}

export interface ApiOnlineMedia extends Api<OnlineMediaList | {}> {}

export interface ApiAudioSpace extends Api<AudioSpace> {}
export interface ApiBroadcast extends Api<LiveVideoContent> {}
export interface ApiPolls extends Api<number[]> {}

export interface ApiListInfo extends Api<{
  user_info: UserInfo | {}
  name: string
  description: string
  id: string
  member_count: number
  created_at: number
  subscriber_count: number
  banner: {
    url: string
    original_height: number
    original_width: number
    media_key: string
  }
}> {}

export interface ApiListMember extends Api<{
  users: UserInfo[]
  cursor: {top: string; bottom: string}
}> {}

export interface ApiCommunityInfo extends Api<{
  name: string
  description: string
  id: string
  member_count: number
  moderator_count: number
  default_theme: string
  created_at: number
  rules: {name: string; description: string}[]
  banner: {
    url: string
    original_height: number
    original_width: number
    media_key: string
  }
}> {}

export interface ApiHashtagList extends Api<{
  list: HashtagList[]
  start: number
  end: number
}> {}

export interface ApiTyprahead extends Api<{
  users: {
    uid: string
    name: string
    display_name: string
    header: string
    banner: number
    created_at: number | null
    verified: number
    top: string
  }[]
  topics: {
    topic: string
    rounded_score: number
    tokens: any[]
    inline: boolean
  }[]
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

export interface ApiAnnual2020 {
  userAddList: {name: string; display_name: string; add: boolean}[]
  userDeleteList: {name: string; display_name: string; add: boolean}[]
  pollTopTweet: Tweet
  userData: {
    uid: string
    name: string
    display_name: string
    followers: number
    statuses_count: number
    time: number
    followers_add: number
    statuses_count_add: number
  }[]
  projects: {text: string; value: string}[]
  hashTagList: {count: number; text: string}[]
  serverStatusMeta: {
    date: string
    total_tweets: number
    success_rate: number
    total_time_cost: number
    max_time_cost: number
    min_time_cost: number
    avg_time_cost: number
    avg_tweets: number
    tweets_count: number
  }[]
}

export interface ApiAnnual2021 {
  range: {start: number; end: number}
  user_add_list: {name: string; display_name: string; add: boolean}[]
  user_del_list: {name: string; display_name: string; add: boolean}[]
  hashtag_rank: {count: number; text: string}[]
  user_data: { uid: number; name: string; display_name: string; followers: number; statuses_count: number; time: number; followers_add: number; statuses_count_add: number; group: string[] }[]
  server_status_meta: { date: string; total_tweets: number; success_rate: number; online_rate: number; total_time_cost: number; max_time_cost: number; min_time_cost: number; avg_time_cost: number; avg_tweets: number; tweets_count: number; }[]
  account_color: {[p in string]: {[q in string]: string}}
  single_project_hashtag: {[p in string]: {value: number; name: string}[]}
  display_name_list: {[p in string]: string}
  account_data: {
    name: string
    display_name_list: string[]
    organization: boolean
    uid: string
    projects: string[][]
    daily_data: {[p in string]: {
      followers: number
      following: number
      statuses_count: number
      origin: number
      hour_count: number[]
      media: number[]
    }}
    range: {start: number; end: number}
  }[]
}

export interface ApiAnnual2022 {
  range: {start: number; end: number}
  user_add_list: {name: string; display_name: string; uid: string}[]
  user_rename_list: {name: string; old_name: string; display_name: string; uid: string}[]
  user_unban_list: {name: string; display_name: string; uid: string}[]
  hashtag_rank: {count: number; text: string}[]
  user_data: { uid: number; name: string; display_name: string; followers: number; statuses_count: number; time: number; followers_add: number; statuses_count_add: number; group: string[] }[]
  server_status_meta: { date: string; total_tweets: number; success_rate: number; online_rate: number; total_time_cost: number; max_time_cost: number; min_time_cost: number; avg_time_cost: number; avg_tweets: number; tweets_count: number; }[]
  account_color: {[p in string]: {[q in string]: string}}
  single_project_hashtag: {[p in string]: {value: number; name: string}[]}
  display_name_list: {[p in string]: string}
  account_data: {
    name: string
    display_name_list: string[]
    organization: boolean
    uid: string
    projects: string[][]
    daily_data: {[p in string]: {
      followers: number
      following: number
      statuses_count: number
      origin: number
      hour_count: number[]
      media: number[]
    }}
    range: {start: number; end: number}
  }[]
  single_project_list: {
    [p in string]: {
      most_retweet: singleProjectItem[]
      most_quote: singleProjectItem[]
      most_reply: singleProjectItem[]
      most_like: singleProjectItem[]
      like: {more_than_10k: number; less_than_10k: number}
      count: number
      retweet_count: number
      deleted_count: number
    }
  }
  single_project_tweets: Tweet[]
}

export interface singleProjectItem {
  tweet_id: string
  uid: string
  name: string
  retweets: number
  quotes: number
  replies: number
  likes: number
  isRetweet: boolean
  deletedStatus: boolean
}
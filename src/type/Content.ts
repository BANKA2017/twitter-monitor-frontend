export interface AccountList {
  [p: string]: {
    [q: string]: {name: string; display_name: string; projects: string[][]}[]
  }
}

export interface UserInfo {
  uid: number
  uid_str: string
  name: string
  display_name: string
  header: string
  banner: number
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
}


export interface LegacyChart {
  timestamp: number | string
  followers: number
  following: number
  statuses_count: number
}

export interface Tweet {
  tweet_id: number
  tweet_id_str: string
  conversation_id_str: string
  uid: number
  uid_str: string
  name: string
  display_name: string
  avatar?: string //online mode only
  media: number
  video: number
  card: string
  poll: number
  quote_status: number
  quote_status_str: string
  source: string
  full_text: string
  full_text_origin: string
  retweet_from: string
  retweet_from_name: string
  dispute: number
  time: number
  type: string
  favorite_count?: number
  retweet_count?: number
  quote_count?: number
  rtl?: boolean
  display_text_range?: number[]
  entities: Entity[]
  pollObject: PollItem[]
  cardObject?: Card
  quoteObject?: Quote
  mediaObject: Media[]
  user_info?: UserInfo
  retweet_user_info?: UserInfo
}

export interface Translate {
  text: string
  translate_source: string
}

export interface Entity {
  expanded_url: string
  indices_end: number
  indices_start: number
  text: string
  type: 'hashtag' | 'symbol' | 'url' | 'user_mention' | "emoji" | '' //emoji and empty('') are for FullTextToHtml
}

export interface Media {
  tweet_id: number
  uid: number
  cover: string
  url: string
  extension: string
  filename: string
  origin_type: string
  source: string
  content_type: string
  origin_info_height: number
  origin_info_width: number
  title?: string | null
  description?: string | null
  blurhash: string | null
}

export interface OnlineMedia {
  basename: string
  bitrate: number
  content_type: string
  cover: string
  extension: string
  filename: string
  hidden: boolean
  media_key: string
  origin_info_height: number
  origin_info_width: number
  origin_type: string
  title?: string | null
  description?: string | null
  source: string
  tweet_id: string
  uid: string
  url: string
}

export type MediaSize = 'large' | 'medium' | 'small' | 'thumb' | 'tiny' | 'orig'

export interface Quote {
  tweet_id: number
  id_str: string
  name: string
  display_name: string
  full_text: string
  time: number
  media: number
  video: number
  entities: Entity[]
}

export interface PollItem {
  choice_label: string
  poll_order: 1 | 2 | 3 | 4
  end_datetime: number
  count: number
  checked: boolean
}

export interface Card {
  title: string
  description: string
  vanity_url: string
  type: string//TODO list all types
  secondly_type: string
  url: string
  media: number
  unified_card_app: number | boolean//set 'true' while key 'app' existed
  app?: {
    unified_card_type: string
    type: 'iphone_app' | 'ipad_app' | 'android_app'
    appid: string | number
    country_code: string
    title: string
    category: string
  }[]
}

export interface Status {
  time: number
  total_users: number
  total_tweets: number
  total_req_tweets: number
  total_throw_tweets: number
  total_req_times: number
  total_errors_count: number
  total_media_count: number
  total_time_cost: number
}

export interface Stats {
  uid: number
  name: string
  display_name: string
  following: number
  followers: number
  statuses_count: number
  group: string[]
}

export interface HashtagList {
  name: string
  value: number
}

export interface AdvancedSearchQuery {
  q?: string
  text_or_mode?: string
  text_not_mode?: string
  user?: string
  user_and_mode?: string
  user_not_mode?: string
  tweet_type?: string
  tweet_media?: string
  start?: string
  end?: string
  order?: string
  advanced?: string
  hidden?: string
}

export interface sunBurstType {
  name?: string
  itemStyle?: {color: string}
  value?: number
  children?: sunBurstType | sunBurstType[]
  _custom?: {
    type: string
    objectType: string
    value: sunBurstType | sunBurstType[]
  }
}
export interface Annual2021Template<U, V> {
  tweets: U
  retweet: U
  hourCount: number[]
  mediaCount: number[]
  trendsData: {
    followers: V
    statuses_count: V
    label: {[p in string]: string}
    color: string[]
  }
  renameDepartment: {[q in string]: sunBurstType[]}
}
export interface Annual2021DataTemplate extends Annual2021Template<[string, number][], {[index: string]: number | string; date: string;}[]> {}

export interface Annual2021TmpDataTemplate extends Annual2021Template<{[p in string]: number}, {[index: string]: number | string}>{}
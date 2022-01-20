export interface AccountList {
  [p: string]: {
    [q: string]: {name: string; display_name: string; projects: string[][]}[]
  }
}

export interface Tweets {

}

export interface Entity {
  expanded_url: string
  indices_end: number
  indices_start: number
  text: string
  type: 'hashtag' | 'cashtag' | 'urls' | 'user_mentions' | "emoji" | '' //emoji and empty('') is for FullTextToHtml
}

export interface Media {
  tweet_id: bigint
  uid: bigint
  cover: string
  url: string
  extension: string
  filename: string
  origin_type: string
  source: string
  content_type: string
  origin_info_height: number
  origin_info_width: number
  blurhash: string | null
}

export interface Quote {
  tweet_id: bigint
  name: string
  display_name: string
  full_text: string
  time: number
  media: number
  video: number
}

export interface Card {
  title: string
  description: string
  vanity_url: string
  type: string//TODO list all types
  secondly_type: string
  url: string
  media: number
  unified_card_app: number | boolean//'true'
  app?: {
    unified_card_type: string
    type: 'iphone_app' | 'ipad_app' | 'android_app'
    appid: string | number
      country_code: string
    title: string
    category: string
  }
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
  uid: bigint
  name: string
  display_name: string
  following: number
  followers: number
  statuses_count: number
  group: string[]
}

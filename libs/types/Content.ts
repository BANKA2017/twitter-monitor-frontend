export interface AccountList {
  [p: string]: {
    [q: string]: {name: string; display_name: string; nsfw: boolean; organization: boolean; projects: string[][]}[]
  }
}

export interface UserInfo {
  uid: string
  uid_str: string
  name: string
  display_name: string
  header: string
  banner: number
  following: number
  followers: number
  description: string
  description_original: string
  statuses_count: number
  top: string
  locked: number
  deleted: number
  verified: number
  description_entities: Entity[]
}

export interface CommunityInfo {
  name: string
  description: string
  id: string
  member_count: number
  moderator_count: number
  default_theme: string
  created_at: number
  rules: {name: string; description: string}[]
  join_policy: string
  banner: {
    url: string
    original_height: number
    original_width: number
    media_key: string
  }
}

export interface Birdwatch {
  id: string
  title: string
  text: string
}

export interface LegacyChart {
  timestamp: number | string
  followers: number
  following: number
  statuses_count: number
}

export interface Tweet {
  tweet_id: string | number
  tweet_id_str: string
  conversation_id_str: string
  uid: string
  uid_str: string
  name: string
  display_name: string
  avatar?: string //online mode only
  media: number
  video: number
  card: string
  poll: number
  quote_status: string
  quote_status_str: string
  source: string
  full_text: string
  full_text_original: string
  retweet_from: string
  retweet_from_name: string
  dispute: number
  time: number
  type: string
  reply_count?: number
  favorite_count?: number
  retweet_count?: number
  quote_count?: number
  rtl?: boolean
  display_text_range?: number[]
  vibe?: Vibe
  entities: Entity[]
  richtext?: RichText
  pollObject: PollItem[]
  cardObject?: Card
  quoteObject?: Quote
  mediaObject: Media[]
  is_top?: boolean
  user_info?: UserInfo
  retweet_user_info?: UserInfo
  community?: CommunityInfo
  birdwatch?: Birdwatch
}

export interface RichText {
  richtext_tags: {
    from_index: number
    to_index: number
    richtext_types: string[]
    content?: Entity[]
    text?: string
  }[]
}

export interface Vibe {
  text: string
  imgDescription: string
  discoveryQueryText: string
}

export interface Translate {
  text: string
  translate_source: string
  entities: Entity[]
}

export interface Entity {
  expanded_url: string
  indices_end: number
  indices_start: number
  indices_end_backup?: number // for emoji
  indices_start_backup?: number // for emoji
  text: string
  type: 'hashtag' | 'symbol' | 'url' | 'user_mention' | "emoji" | 'text' | '' //emoji and empty('') are for FullTextToHtml
}

export interface Media {
  tweet_id: string | number
  id_str?: string
  uid: string
  cover: string
  url: string
  extension: string
  filename: string
  original_type: string
  source: string
  content_type: string
  original_info_height: number
  original_info_width: number
  title?: string | null
  description?: string | null
  blurhash: string | null
  sensitive_media_warning?: {
    adult_content?: boolean
    graphic_violence?: boolean
    other?: boolean
  }
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
  original_info_height: number
  original_info_width: number
  original_type: string
  title?: string | null
  description?: string | null
  source: string
  tweet_id: string
  id_str?: string
  uid: string
  url: string
  sensitive_media_warning?: {
    adult_content?: boolean
    graphic_violence?: boolean
    other?: boolean
  }
}

export interface OnlineMediaList {
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
  }[]
}

export type MediaSize = 'large' | 'medium' | 'small' | 'thumb' | 'tiny' | 'orig'

export interface Quote {
  tweet_id: string | number
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

export interface LiveVideoContent {
  id: string
  avatar: string
  name: string
  display_name: string
  state: string
  start: string
  end: string
  media_key: string
  playback?: string
  title: string
  total: number
  is_available_for_replay: boolean
}

export interface AudioSpace extends LiveVideoContent {
  verified: boolean
  admins: AudioUsersItem[]
  listeners: AudioUsersItem[]
  speakers: AudioUsersItem[]
}

export interface AudioUsersItem {
  uid: string
  uid_str: string
  name: string
  display_name: string
  avatar: string
  start: number
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
  uid: string
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

export interface BookMarkMedia {
  is_video: boolean
  url: string
  cover: string
  size: 1//TODO aspect ratio
}

export interface BookMark {
  type: 'media' | 'tweet' | 'profile'
  tweet_id?: string
  uid: string
  name: string
  display_name: string
  text?: string
  entities: Entity[]
  media: BookMarkMedia[]
  timestamp: string
  add_timestamp: string
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
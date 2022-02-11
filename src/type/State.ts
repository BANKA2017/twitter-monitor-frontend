import {AccountList, Translate, Tweet} from "@/type/Content";

//TODO fix type
export type TweetMode = string//'timeline' | 'tag' | 'search' | 'status'
export type TweetType = string//'all' | 'self' | 'retweet' | 'media'
export interface userListInterface {name: string; display_name: string; project: string; tag: string}


export interface State {
  now: Date
  userTimeZone: string
  darkMode: boolean
  devmode: boolean

  projects: string[]
  links: {url: string; display: string}[]
  names: AccountList
  userList: userListInterface[]
  languageList: { code: string; name: string; local_name: string; status: string}[]
  tweets: Tweet[]
  translate: { [p: string]: Translate }//{tweet_id: Translate}
  userExists: boolean
  tweetMode: TweetMode
  tweetType: TweetType

  home: boolean
  project: string
  title: string

  height: number
  width: number
  siteHeight: number
  viewportHeight: number
  altitudeDifference: number

  settings: {
    language: string
    cookie_accept: boolean
    displayPicture: boolean
    autoLoadTweets: boolean
    autoRefresh: boolean
    basePath: string
    mediaPath: string
  }

  adminMode: boolean

  image: {
    mode: 'photo' | 'banner' | 'avatar'
    offset: number
    imageList: {url: string; blurhash: string | null}[]
  }

  hasBeenSyncFromLocalStorage: boolean
  samePath: boolean
  realMediaPath: string
  twemojiBasePath: string
  //onlinePath: string
}

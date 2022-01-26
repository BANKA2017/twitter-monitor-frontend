import {AccountList, Tweet, TweetEx} from "@/type/Content";

export interface State {
  now: Date
  userTimeZone: string
  darkMode: boolean
  devmode: boolean

  projects: string[]
  links: {url: string; display: string}[]
  names: AccountList
  userList: {name: string; display_name: string; project: string; tag: string}[]
  languageList: { code: string; name: string; local_name: string; status: string}[]
  tweets: TweetEx[]
  userExists: boolean

  home: boolean
  project: string
  title: string

  height: number
  width: number
  altitudeDifference: number

  settings: {
    language: string
    cookie_accept: boolean
    displayPicture: boolean
    basePath: string
    mediaPath: string
  }

  hasBeenSyncFromLocalStorage: boolean
  samePath: boolean
  realMediaPath: string
  twemojiBasePath: string
  //onlinePath: string
}

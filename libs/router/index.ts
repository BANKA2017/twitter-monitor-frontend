import {createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw} from "vue-router"

const About = () => import("../views/About.vue")
const OnlineAbout = () => import("../views/OnlineAbout.vue")
const Api = () => import("../views/Api.vue")
const Stats = () => import("../views/Stats.vue")
const Status = () => import("../views/Status.vue")
const BookMarks = () => import("../views/BookMarks.vue")
const TimeLine = () => import("../views/TimeLine.vue")
const Main = () => import('../views/Main.vue')
const Trends = () => import("../views/trends/index.vue")
const TrendsMain = () => import("../views/trends/trendsMain.vue")
const TrendsAccount = () => import("../views/trends/trendsAccount.vue")
//TODO update to TypeScript
const Topic = () => import("../views/topics/index.vue")
const Annual2019 = () => import("../views/topics/annual2019.vue")
const Annual2020 = () => import("../views/topics/annual2020.vue")
const Annual2021 = () => import("../views/topics/annual2021.vue")
const Annual2022 = () => import("../views/topics/annual2022.vue")
const loveliveTrends = () => import("../views/topics/loveliveTrends.vue")
const bangdreamTrends = () => import("../views/topics/bangDreamTrends.vue")
//const staffCandleStickPage = () => import("../views/topics/staffCandleStickPage.vue")
const NotFound = () => import("../views/NotFound.vue")
const Settings = () => import("../views/Settings.vue")
const Tools = () => import("../views/tools/Index.vue")
const Media = () => import("../views/tools/Media.vue")
const SnowFlakeTool = () => import("../views/tools/SnowFlakeTool.vue")
const Translator = () => import("../views/tools/Translator.vue")
//const PhotoPreview = () => import('@/views/TO_DEL_PhotoPreview.vue')

let routes: RouteRecordRaw[] = [
    { path: '/about', component: OnlineAbout, name: 'about'},
    {
        path: '/i/tools',
        component: Tools,
        name: 'tools',
        children: [
            {path: '', component: Tools, name: 'tool-main-page'},
            {
                path: 'media',
                component: Media,
                children: [
                    {path: '', component: Media, name: 'media-downloader'},
                    {path: ':tweet_id(\\d+)', component: Media, name: 'media-downloader-status'}
                ]
            },
            {path: 'snowflake_tool', component: SnowFlakeTool, name: 'snowflake-tool'},
            {
                path: 'translator',
                component: Translator,
                name: 'translator',
                children:[
                    {path: '', component: Translator, name: 'translator-empty'},
                    {path: ':name', component: Translator, name: 'translator-name'},
                    {path: 'status/:status(\\d+)', component: Translator, name: 'translator-name-status'}
                ]
            }
        ]
    },
    { path: '/api', component: Api, name: 'api'},
    { path: '/i/bookmarks', component: BookMarks, name: 'bookmarks'},
    { path: '/settings', component: Settings, name: 'settings'},
    //{ path: '/tools', component: Tools, name: 'tools'},
    { path: '/hashtag/:tag?', component: TimeLine, name: 'hashtag'},
    { path: '/cashtag/:tag?', component: TimeLine, name: 'cashtag'},
    {
        path: '/search',
        component: TimeLine,
        children: [
            {path: '', component: TimeLine, name: 'search'},//will no longer use params
            {path: ':search', redirect: to => ({ path: '/search/', query: { q: to.params.search }})}
        ]
    },
    {
        path: '/',
        component: Main,
        name: 'main',
        children: [{
            path: 'index.html',
            redirect: '/'
        }]
    },
    { path: '/i/lists/:listId(\\d+)', component: TimeLine, name: 'lists'},
    {
        path: '/:name',
        component: TimeLine,
        children: [
            {path: '', redirect: to => ({path: '/' + to.params.name + '/all'})},
            {path: ':display', component: TimeLine, name: 'name-display'},
            {path: 'status/:status(\\d+)', component: TimeLine, name: 'name-status'},
        ]
    },
    { path: '/i/status/:status(\\d+)', component: TimeLine, name: 'no-name-status'},
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
    { path: '/:pathMatch(.*)', name: 'bad-not-found', component: NotFound },
]

//online mode
if (import.meta.env.VITE_DEV_BASE_PATH??import.meta.env.VITE_PRO_BASE_PATH??'') {
    routes[0].component = About
    routes.push(
        { path: '/i/events/:path?', redirect: to => ({ path: '/i/topics/' + to.params.path}) },//to topics
        {
            path: '/i/topics',
            component: Topic,
            name: 'mainTopics',
            children: [
                {path: '2019', component: Annual2019, name: '2019'},
                {path: '2020', component: Annual2020, name: '2020'},
                {path: '2021', component: Annual2021, name: '2021'},
                {path: '2022', component: Annual2022, name: '2022'},
                {path: 'lovelive_trends/:name?', component: loveliveTrends, name: 'lovelive_trends'},
                {path: 'bangdream_trends/:name?', component: bangdreamTrends, name: 'bangdream_trends'},
                //{path: 'staff_data_page', component: staffCandleStickPage, name: 'staff_data_page'}
            ]
        },
        { path: '/i/stats', component: Stats, name: 'stats'},
        { path: '/i/status', component: Status, name: 'status'},
        {
            path: '/i/trends',
            component: Trends,
            name: 'trends',
            children: [
                {path: '', component: TrendsMain, name: 'trends'},
                {path: ':name', component: TrendsAccount, name: 'trends-name'}
            ]
        },
        {
            path: '/i/online',
            redirect: () => ({ path: '/i/tools/media'})
        }
    )
}

export default createRouter({
    history: createWebHistory('/'),
    routes
})

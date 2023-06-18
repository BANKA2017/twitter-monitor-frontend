import {createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw} from "vue-router"

const OnlineAbout = () => import("../views/OnlineAbout.vue")
const Api = () => import("../views/Api.vue")
const BookMarks = () => import("../views/BookMarks.vue")
const TimeLine = () => import("../views/TimeLine.vue")
const Main = () => import('../views/Main.vue')
//TODO update to TypeScript
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
    { path: '/i/communities/:communityId(\\d+)', component: TimeLine, name: 'communities'},
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

export default createRouter({
    history: createWebHistory('/'),
    routes
})

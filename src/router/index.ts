import {createRouter, createWebHistory} from "vue-router";

const About = () => import("@/views/About.vue")
const Api = () => import("@/views/Api.vue")
const Stats = () => import("@/views/Stats.vue")
const Status = () => import("@/views/Status.vue")
//const Online = () => import(/* webpackChunkName: "pages" */ "../components/pages/online");
const TimeLine = () => import("@/views/TimeLine.vue")
const Main = () => import('@/views/Main.vue')
const Trends = () => import("@/views/Trends.vue")
//const Event = () => import(/* webpackChunkName: "events" */ "../components/pages/events");
//const Annual2019 = () => import(/* webpackChunkName: "events" */ "../components/pages/events/annual2019");
//const Annual2020 = () => import(/* webpackChunkName: "events" */ "../components/pages/events/annual2020");
//const Annual2021 = () => import(/* webpackChunkName: "events" */ "../components/pages/events/annual2021");
//const loveliveTrends = () => import(/* webpackChunkName: "events" */ "../components/pages/events/loveliveTrends");
//const staffCandleStickPage = () => import(/* webpackChunkName: "events" */ "../components/pages/events/staffCandleStickPage");
const NotFound = () => import("@/views/NotFound.vue")
const Settings = () => import("@/views/Settings.vue")
//const PhotoPreview = () => import('@/views/PhotoPreview.vue')

export default createRouter({
    history: createWebHistory('/'),
    routes: [
        { path: '/about', component: About, name: 'about'},
        //{
        //    path: '/i/events',
        //    component: Event,
        //    name: 'mainEvents',
        //    children: [
        //        {
        //            path: '2019',//2019年度总结
        //            component: Annual2019,
        //        },
        //        {
        //            path: '2020',//2020年度总结
        //            component: Annual2020,
        //        },
        //        {
        //            path: '2021',//2021年度总结
        //            component: Annual2021,
        //        },
        //        {
        //            path: 'lovelive_trends',//lovelive趨勢
        //            component: loveliveTrends,
        //        },
        //        {
        //            path: 'staff_data_page',
        //            component: staffCandleStickPage
        //        }
        //    ]
        //},
        { path: '/api', component: Api, name: 'api'},
        { path: '/i/stats', component: Stats, name: 'stats'},
        { path: '/i/status', component: Status, name: 'status'},
        { path: '/i/trends', component: Trends, name: 'trends'},
        //will split to another project
        //{
        //    path: '/i/online',
        //    component: Online,
        //    children: [{
        //        path: ':tweet_id',
        //        component: Online,
        //    }]
        //},
        { path: '/settings', component: Settings, name: 'settings'},
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
            children: [{
                path: 'index.html',
                redirect: '/'
            }
            //{
            //    path: 'i',
            //    component: UserSelector,
            //    children: [
            //        {
            //            path: 'project/:project',
            //            component: UserSelector,
            //            children: [
            //                {path: ':name', component: UserSelector},
            //                {path: ':name/:display', component: UserSelector},
            //                {path: ':name/status/:status', component: UserSelector}
            //            ]
            //        }
            //    ]
            //}
            ]
        },
        {
            path: '/:name',
            component: TimeLine,
            children: [
                {path: '', redirect: to => ({path: '/' + to.params.name + '/all'})},
                {path: ':display', component: TimeLine, name: 'name-display'},
                {path: 'status/:status(\\d+)', component: TimeLine, name: 'name-status'},
            ]
        },
        //will add but not now
        //{ path: '/:name/avatar', component: PhotoPreview, name: 'photo-avatar'},
        //{ path: '/:name/banner', component: PhotoPreview, name: 'photo-banner'},
        //{ path: '/:name/status/:status/photo/:order', component: PhotoPreview, name: 'photo-status-photo'},
        { path: '/i/status/:status(\\d+)', component: TimeLine, name: 'no-name-status'},
        { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
        { path: '/:pathMatch(.*)', name: 'bad-not-found', component: NotFound },
    ]
})

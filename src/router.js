import {createRouter, createWebHistory} from "vue-router";

const About = () => import("./components/pages/about");
const Api = () => import("./components/pages/api");
const Stats = () => import("./components/pages/stats");
const Status = () => import("./components/pages/status");
const Online = () => import("./components/pages/online");
const timeLine = () => import(/* webpackChunkName: "kernel" */ "./components/pages/timeLine");
const UserSelector = () => import(/* webpackChunkName: "kernel" */ "./components/pages/userSelector");
const devConfig = () => import("./components/pages/devConfig");
const Trends = () => import("./components/pages/trends");
const Event = () => import(/* webpackChunkName: "events" */ "./components/pages/events/index");
const Annual2019 = () => import(/* webpackChunkName: "events" */ "./components/pages/events/annual2019");
const Annual2020 = () => import(/* webpackChunkName: "events" */ "./components/pages/events/annual2020");
const loveliveTrends = () => import(/* webpackChunkName: "events" */ "./components/pages/events/loveliveTrends");
const staffCandleStickPage = () => import(/* webpackChunkName: "events" */ "./components/pages/events/staffCandleStickPage");
const notFound = () => import("./components/pages/errors/notFound");
const Settings = () => import("./components/pages/settings")

export default createRouter({
    history: createWebHistory('/'),
    routes: [
        {
            path: '/about',
            component: About
        },
        {
            path: '/i/events',
            component: Event,
            name: 'mainEvents',
            children: [
                {
                    path: '2019',//2019年度总结
                    component: Annual2019,
                },
                {
                    path: '2020',//2020年度总结
                    component: Annual2020,
                },
                {
                    path: 'lovelive_trends',//lovelive趨勢
                    component: loveliveTrends,
                },
                {
                    path: 'staff_data_page',
                    component: staffCandleStickPage
                }
            ]
        },
        {
            path: '/api',
            component: Api
        },
        {
            path: '/i/stats',
            component: Stats
        },
        {
            path: '/i/status',
            component: Status
        },
        {
            path: '/i/trends',
            component: Trends
        },
        {
            path: '/i/online',
            component: Online,
            children: [{
                path: ':tweet_id'
            }]
        },
        {
            path: '/settings',
            component: Settings
        },
        {
            path: '/i/dev/config',
            component: devConfig
        },
        {
            path: '/hashtag/:hashtag',
            component: timeLine,
        }, {
            path: '/cashtag/:cashtag',
            component: timeLine,
        }, {
            path: '/search/',
            component: timeLine,
            children: [
                {path: '', component: timeLine,},//will no longer use params
                {path: ':search', component: timeLine,}//to delete
            ]
        },
        {
            path: '/',
            component: UserSelector,
            children: [{
                path: 'index.html',
                redirect: '/'
            }, {
                path: 'i',
                component: UserSelector,
                children: [
                    {
                        path: 'project/:project',
                        component: UserSelector,
                        children: [
                            {path: ':name', component: UserSelector},
                            {path: ':name/:display', component: UserSelector},
                            {path: ':name/status/:status', component: UserSelector}
                        ]
                    }
                ]
            }]
        }, {
            path: '/:name',
            component: timeLine,
            children: [
                {path: '', component: timeLine,},
                {path: ':display', component: timeLine,},
                {path: 'status/:status', component: timeLine,}
            ]
        },
        { path: '/:pathMatch(.*)*', name: 'not-found', component: notFound },
        { path: '/:pathMatch(.*)', name: 'bad-not-found', component: notFound },
    ]
})

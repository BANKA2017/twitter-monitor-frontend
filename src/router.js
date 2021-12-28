import {createRouter, createWebHistory} from "vue-router";

const About = () => import(/* webpackChunkName: "pages" */ "./components/pages/about");
const Api = () => import(/* webpackChunkName: "pages" */ "./components/pages/api");
const Stats = () => import(/* webpackChunkName: "pages" */ "./components/pages/stats");
const Status = () => import(/* webpackChunkName: "pages" */ "./components/pages/status");
const Online = () => import(/* webpackChunkName: "pages" */ "./components/pages/online");
const timeLine = () => import(/* webpackChunkName: "core" */ "./components/pages/timeLine");
const UserSelector = () => import(/* webpackChunkName: "core" */ "./components/pages/userSelector");
const devConfig = () => import(/* webpackChunkName: "pages" */ "./components/pages/devConfig");
const Trends = () => import(/* webpackChunkName: "pages" */ "./components/pages/trends");
const Event = () => import(/* webpackChunkName: "events" */ "./components/pages/events/index");
const Annual2019 = () => import(/* webpackChunkName: "events" */ "./components/pages/events/annual2019");
const Annual2020 = () => import(/* webpackChunkName: "events" */ "./components/pages/events/annual2020");
const Annual2021 = () => import(/* webpackChunkName: "events" */ "./components/pages/events/annual2021");
const loveliveTrends = () => import(/* webpackChunkName: "events" */ "./components/pages/events/loveliveTrends");
const staffCandleStickPage = () => import(/* webpackChunkName: "events" */ "./components/pages/events/staffCandleStickPage");
const notFound = () => import(/* webpackChunkName: "core" */"./components/pages/errors/notFound");
const Settings = () => import(/* webpackChunkName: "core" */"./components/pages/settings")

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
                    path: '2021',//2021年度总结
                    component: Annual2021,
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
                path: ':tweet_id',
                component: Online,
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

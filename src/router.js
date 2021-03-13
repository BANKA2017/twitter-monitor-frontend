import Vue from "vue";
import VueRouter from "vue-router";

const About = () => import("./components/pages/about");
const Api = () => import("./components/pages/api");
const Account = () => import("./components/pages/account");
const Stats = () => import("./components/pages/stats");
const Status = () => import("./components/pages/status");
const Online = () => import("./components/pages/online");
const timeLine = () => import("./components/pages/timeLine");
const UserSelector = () => import("./components/pages/userSelector");
const devConfig = () => import("./components/pages/devConfig");
const Admin = () => import("./components/pages/admin");
const Trends = () => import("./components/pages/trends");
const Annual2019 = () => import("./components/pages/events/annual2019");
const Annual2020 = () => import("./components/pages/events/annual2020");

Vue.use(VueRouter);
export default new VueRouter({
    mode: 'history',//hash history
    base: '/',//hash mode not require
    routes: [
        {
            path: '/about',
            component: About
        },
        {
            path: '/i/events/2019',//2019年度总结
            component: Annual2019,
        },
        {
            path: '/i/events/2020',//2020年度总结
            component: Annual2020,
        },
        {
            path: '/api',
            component: Api
        },
        {
            path: '/account',
            component: Account
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
            path: '/i/dev/config',
            component: devConfig
        },
        {
            path: '/i/admin',
            component: Admin
        },
        {
            path: '/hashtag/:hashtag',
            component: timeLine,
        }, {
            path: '/cashtag/:cashtag',
            component: timeLine,
        }, {
            path: '/search/:search',
            component: timeLine,
        },
        {
            path: '/',
            component: UserSelector,
            children: [{
                path: 'index.html'
            }, {
                path: 'i',
                children: [
                    {
                        path: 'project/:project',
                        children: [
                            {path: ':name'},
                            {path: ':name/:display'},
                            {path: ':name/status/:status'}
                        ]
                    }
                ]
            }]
        }, {
            path: '/:name',
            component: timeLine,
            children: [
                {path: ''},
                {path: ':display'},
                {path: 'status/:status'}
            ]
        },
    ]
})

import Vue from "vue";
import VueRouter from "vue-router";
import About from "./components/pages/about";
import Api from "./components/pages/api";
import Account from "./components/pages/account";
import Stats from "./components/pages/stats";
import Status from "./components/pages/status";
import Online from "./components/pages/online";
import timeLine from "./components/pages/timeLine";
import UserSelector from "./components/pages/userSelector"

Vue.use(VueRouter);
export default new VueRouter({
    mode: 'history',//hash history
    base: '/twitter/',//hash mode not require
    routes: [
        {
            path: '/about',
            component: About
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
            path: '/i/online',
            component: Online
        }, {
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
                //component: timeLine,
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

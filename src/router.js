import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);
export default new VueRouter({
    base: '/',
    routes: [
        {
            path: '/about',
            component: () => import("./components/pages/about"),
        },
        {
            path: '/api',
            component: () => import("./components/pages/api"),
        },
        {
            path: '/i',
            children: [
                {
                    path: 'project/:project',
                    children: [
                        {path: ':name'},
                        {path: ':name/:display'},
                        {path: ':name/status/:status'}
                    ]
                },
                {
                    path: 'stats',
                    component: () => import("./components/pages/stats"),
                },
                {
                    path: 'status',
                    component: () => import("./components/pages/status"),
                }
            ]
        },{
            path: '/hashtag/:hashtag',
        },{
            path: '/cashtag/:cashtag',
        },{
            path: '/search/:search',
        },{
            path: '/:name',
            children: [
                {path: ''},
                {path: ':display'},
                {path: 'status/:status'}
            ]
        }
    ]
});

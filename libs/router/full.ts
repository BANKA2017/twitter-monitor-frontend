import router from './index'

const About = () => import("../views/About.vue")
const Stats = () => import("../views/Stats.vue")
const Status = () => import("../views/Status.vue")
const Topic = () => import("../views/topics/index.vue")
const Annual2019 = () => import("../views/topics/annual2019.vue")
const Annual2020 = () => import("../views/topics/annual2020.vue")
const Annual2021 = () => import("../views/topics/annual2021.vue")
const Annual2022 = () => import("../views/topics/annual2022.vue")
const loveliveTrends = () => import("../views/topics/loveliveTrends.vue")
const bangdreamTrends = () => import("../views/topics/bangDreamTrends.vue")

const Trends = () => import("../views/trends/index.vue")
const TrendsMain = () => import("../views/trends/trendsMain.vue")
const TrendsAccount = () => import("../views/trends/trendsAccount.vue")

  router.addRoute({ path: '/about', component: About, name: 'about'})
  router.addRoute({ path: '/i/events/:path?', redirect: to => ({ path: '/i/topics/' + to.params.path}) })//to topics
  router.addRoute({
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
  })
  router.addRoute({ path: '/i/stats', component: Stats, name: 'stats'})
  router.addRoute({ path: '/i/status', component: Status, name: 'status'})
  router.addRoute({
    path: '/i/trends',
    component: Trends,
    name: 'trends',
    children: [
      {path: '', component: TrendsMain, name: 'trends'},
      {path: ':name', component: TrendsAccount, name: 'trends-name'}
    ]
  })
  router.addRoute({
    path: '/i/online',
    redirect: () => ({ path: '/i/tools/media'})
  })


export default router
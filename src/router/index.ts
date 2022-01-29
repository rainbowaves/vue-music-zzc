import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const Recommend = () => import('@/views/recommend/recommend.vue'/* webpackChunkName: "recommend" */)
const Singer = () => import('@/views/singer/singer.vue'/* webpackChunkName: "singer" */)
const TopList = () => import('@/views/top-list/top-list.vue'/* webpackChunkName: "top-list" */)
const Search = () => import('@/views/search/search.vue'/* webpackChunkName: "search" */)
const SingerDetail = () => import('@/views/singer/singer-detail.vue'/* webpackChunkName: "singer-detail" */)
const Album = () => import('@/views/recommend/album.vue'/* webpackChunkName: "album" */)
const TopDetail = () => import('@/views/top-list/top-detail.vue'/* webpackChunkName: "top-detail" */)
const UserCenter = () => import('@/views/user-center/user-center.vue'/* webpackChunkName: "user-center" */)

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: Recommend,
    children: [
      {
        path: ':id',
        component: Album
      }
    ]
  },
  {
    path: '/singer',
    component: Singer,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  },
  {
    path: '/top-list',
    component: TopList,
    children: [
      {
        path: ':id',
        component: TopDetail
      }
    ]
  },
  {
    path: '/search',
    component: Search,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  },
  {
    path: '/user',
    components: {
      user: UserCenter
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router

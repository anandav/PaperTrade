import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import PaperTrade from '../components/PaperTrade'
import Detail from "../components/PortfolioDetail"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: PaperTrade,
    redirect: '/papertrade'
  },
  {
    path: '/papertrade',
    name: 'PaperTrade',
    component: PaperTrade
  },
  {
    path: '/Detail/:id',
    name: 'Detail',
    component: Detail
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },{
    path : '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

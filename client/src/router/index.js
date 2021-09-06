import Vue from 'vue';
import VueRouter from 'vue-router';
import PaperTrade from '../views/PaperTrade';
import Builder from '../views/builder/Builder';

Vue.use(VueRouter)

const approutes = [
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
    path: '/builder',
    name: 'Builder',
    component: Builder
  },
  {
    path: '/about',
    name: 'About',
  },{
    path : '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes : approutes
})

export default router

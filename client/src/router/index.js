//import * as Vue from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import PaperTrade from '../views/PaperTrade';
import Builder from '../views/builder/Builder';

const routes = [
  {
    path: '/',
    component: PaperTrade,
    
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
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }]

const router = createRouter({
    history : createWebHistory(),
    routes
});
// const router = new VueRouter({
//   mode: 'history',
//   base: process.env.BASE_URL,
//   routes : approutes
// })

export default router

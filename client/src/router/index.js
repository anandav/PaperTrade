//import * as Vue from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import PaperTrade from '../views/PaperTrade';
import Builder from '../views/builder/Builder';
import Login from '../views/Login.vue';

const routes = [
  {
    path: '/',
    component: PaperTrade,
    meta: { requiresAuth: true }
  },
  {
    path: '/builder',
    name: 'Builder',
    component: Builder,
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'About',
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
    history : createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('token');

  if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});

// const router = new VueRouter({
//   mode: 'history',
//   base: process.env.BASE_URL,
//   routes : approutes
// })

export default router

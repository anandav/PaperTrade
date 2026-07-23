import { createRouter, createWebHistory } from 'vue-router';
import PaperTrade from '../views/PaperTrade';
import Builder from '../views/builder/Builder';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/papertrade',
    name: 'PaperTrade',
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
    component: () => import('../views/About.vue')
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
    next('/');
  } else {
    next();
  }
});

export default router

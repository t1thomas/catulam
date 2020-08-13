import Vue from 'vue';
import VueRouter from 'vue-router';
import SprintPlanner from '@/views/SprintPlanner.vue';
import Home from '../views/Home.vue';
import backlog from '../views/Backlog.vue';
import login from '../views/Login.vue';
import SprintBoard from '../views/SprintBoard.vue';
import AuthGuard from '../AuthGuard';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: login,
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    beforeEnter: AuthGuard,
  },
  {
    path: '/sprint',
    name: 'sprint',
    component: SprintBoard,
    beforeEnter: AuthGuard,
  },
  {
    path: '/backlog',
    name: 'backlog',
    component: backlog,
    beforeEnter: AuthGuard,
  },
  {
    path: '/sPlanner',
    name: 'SprintPlanner',
    component: SprintPlanner,
    beforeEnter: AuthGuard,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;

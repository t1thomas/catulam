import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import backlog from '../views/Backlog.vue';
import ProjectPage from '../views/ProjectPage.vue';
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
    path: '/project',
    name: 'ProjectPage',
    component: ProjectPage,
    beforeEnter: AuthGuard,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;

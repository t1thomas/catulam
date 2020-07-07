import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import backlog from '../views/Backlog.vue';
import login from '../views/Login.vue';
import TicketPage from '../components/Ticket/Page Components/TicketPage.vue';
import UserStoryPage from '../components/UserStory/UserStoryPage.vue';
import SprintBoard from '../views/SprintBoard.vue';
import AuthGuard from '../AuthGuard';

Vue.use(VueRouter);

const routes = [
  {
    path: '/sprint',
    name: 'sprint',
    component: SprintBoard,
    beforeEnter: AuthGuard,
  },
  {
    path: '/uStory',
    name: 'uStory',
    component: UserStoryPage,
    beforeEnter: AuthGuard,
  },
  {
    path: '/ticket',
    name: 'ticket',
    component: TicketPage,
    beforeEnter: AuthGuard,
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    beforeEnter: AuthGuard,
  },
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
    path: '/backlog',
    name: 'backlog',
    component: backlog,
    beforeEnter: AuthGuard,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;

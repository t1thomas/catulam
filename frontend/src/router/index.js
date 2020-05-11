import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import backlog from '../views/Backlog.vue';
import login from '../views/Login.vue';
import PassReset from '../views/PassReset.vue';
import TicketPage from '../components/Ticket/Page Components/TicketPage.vue';
import UserStoryPage from '../components/UserStory/UserStoryPage.vue';
import SprintBoard from '../views/SprintBoard.vue';

Vue.use(VueRouter);

const AuthAccess = async (to, from, next) => {
  Vue.$store.dispatch('fetchCurrentUser')
    .then(() => {
      const user = Vue.$store.getters.getCurrentUser;
      if (user === null) {
        next({
          path: '/',
        });
      } else if (user.passwordUpdate === true) {
        // if a reset password is required, send user to reset page
        next({
          path: '/resetPass',
        });
      } else {
        next();
      }
    })
    .catch((e) => {
      console.error(e);
      next({
        path: '/',
      });
    });
};
// const HomeAccess = async (to, from, next) => {
//   const user = await Vue.$store.getters.getCurrentUser;
//   if (user === null) {
//     next({
//       path: '/',
//     });
//   } else {
//     console.log(to);
//     console.log('heyoo');
//     next({
//       path: `/home/${user.type}`,
//     });
//   }
// };

const routes = [
  {
    path: '/sprint',
    name: 'sprint',
    component: SprintBoard,
    beforeEnter: AuthAccess,
  },
  {
    path: '/uStory',
    name: 'uStory',
    component: UserStoryPage,
    beforeEnter: AuthAccess,
  },
  {
    path: '/ticket',
    name: 'ticket',
    component: TicketPage,
    beforeEnter: AuthAccess,
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    beforeEnter: AuthAccess,
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
    beforeEnter: AuthAccess,
  },
  {
    path: '/resetPass',
    name: 'ResetPass',
    component: PassReset,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;

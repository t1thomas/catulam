import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
// import GitAuth from '../views/GitAuthentication.vue';
// import repoandbranchselector from '../views/Ebranchselector.vue';
// import repoandbranchselector from '../components/Ebranchselector.vue';
import backlog from '../views/backlog.vue';
import login from '../views/login.vue';

Vue.use(VueRouter);

const AuthAccess = (to, from, next) => {
  if (!Vue.$store.state.currentUser) {
    next({
      path: '/login',
    });
  } else {
    console.log('thendi');
    next();
  }
};
const routes = [
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
  // {
  //   path: '/gitauth/callback',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  // },
  // {
  //   path: '/gitauth/callback',
  //   name: 'GitAuth',
  //   component: GitAuth,
  // },
  // {
  //   path: '/repoandbranch',
  //   name: 'repoandbranchselector',
  //   component: repoandbranchselector,
  // },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;

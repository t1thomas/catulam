import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
// import GitAuth from '../views/GitAuthentication.vue';
// import repoandbranchselector from '../views/Ebranchselector.vue';
// import repoandbranchselector from '../components/Ebranchselector.vue';
import backlog from '../views/backlog.vue';
import login from '../views/login.vue';
import PassReset from '../views/PassReset.vue';
import gqlQueries from '../graphql/gql-queries';

Vue.use(VueRouter);
const AuthAccess = async (to, from, next) => {
  await Vue.$apolloClient.query({
    query: gqlQueries.CurrentUser,
    fetchPolicy: 'no-cache',
  }).then((response) => {
    const { getCurrentUser } = response.data;
    if (getCurrentUser === null) {
      next({
        path: '/',
      });
    } else if (getCurrentUser.passwordUpdate === true) {
      // if a reset password is required, send user to reset page
      next({
        path: '/resetPass',
      });
    } else {
      next();
    }
    Vue.$store.dispatch('setUser', getCurrentUser);
  }).catch((error) => {
    Vue.$store.dispatch('setUser', null);
    console.error(error);
    next({
      path: '/',
    });
  });
};
const ForbiddenAccess = async (to, from, next) => {
  const user = await Vue.$store.getters.getCurrentUser;
  if (user === null) {
    next({
      path: '/',
    });
  } else if (user.passwordUpdate === true) {
    // if a reset password is required, send user to reset page
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
  {
    path: '/resetPass',
    name: 'ResetPass',
    component: PassReset,
    beforeEnter: ForbiddenAccess,

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

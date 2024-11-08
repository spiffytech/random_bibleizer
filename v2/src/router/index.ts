import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      props: { quiz: false }
    },
    {
      path: '/quiz',
      name: 'quiz',
      component: Home,
      props: { quiz: true }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../pages/About.vue')
    }
    /*
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
    */
  ]
});

export default router;

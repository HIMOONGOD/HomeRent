import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../components/HomePage.vue'),
    },
    {
      path: '/explore',
      name: 'explore',
      component: () => import('../components/ExplorePage.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/AuthPage.vue'),
      props: { mode: 'login' },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../components/AuthPage.vue'),
      props: { mode: 'register' },
    },
    {
      path: '/properties/:id',
      name: 'property-detail',
      component: () => import('../components/PropertyDetailPage.vue'),
    },
    {
      path: '/tenant',
      name: 'tenant',
      component: () => import('../components/PlaceholderPage.vue'),
      props: { title: 'Tenant Hub' },
    },
    {
      path: '/landlord',
      name: 'landlord',
      component: () => import('../components/LandLord.vue'),
      props: { title: 'Landlord Portal' },
    },{
      path: '/admin',
      name: 'admin',
      component: () => import('../components/AdminPage.vue'),
    },{
      path: '/add-property',
      name: 'add-property',
      component: () => import('../components/AddProperty.vue'),
      props: { title: 'Add Property' },
    },
    {
      path: '/saved',
      name: 'saved',
      component: () => import('../components/PlaceholderPage.vue'),
      props: { title: 'Saved Homes' },
    },
    {
      path: '/create',
      name: 'create',
      redirect: '/add-property',
    },
  ],
})

export default router

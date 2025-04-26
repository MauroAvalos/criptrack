import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue'
import { user } from '../store/user';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }, // 🔐 Ruta protegida
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/transaccion',
    name: 'CryptoTransaction',
    component: () => import('@/views/CryptoTransaction.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/historial',
    name: 'TransactionHistory',
    component: () => import('@/views/TransactionHistoryView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/status',
    name: 'CurrentStatus',
    component: () => import('@/views/CurrentStatus.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/investment-analysis',
    name: 'InvestmentAnalysis',
    component: () => import('@/views/InvestmentAnalysis.vue'),
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Guard global para proteger rutas
// router/index.js

router.beforeEach((to, from, next) => {
  const isAuthRequired = to.meta.requiresAuth
  const isLoggedIn = user.isAuthenticated

  if ((to.path === '/login' || to.path === '/register') && isLoggedIn) {
    next('/') // Redirige al Home si ya está logueado
  } else if (isAuthRequired && !isLoggedIn) {
    next('/login') // Redirige al Login si no está logueado
  } else {
    next()
  }
})

export default router;

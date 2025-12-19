import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/user/Homepage/HomeView.vue'
import AboutUs from '../views/user/AboutUs/AboutUs.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/about-us',
            name: 'about',
            component: AboutUs
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/auth/LoginView.vue'),
            meta: { hideLayout: true }
        },
        {
            path: '/events',
            name: 'events',
            component: () => import('../views/user/Events/Event.vue')
        },
        {
            path: '/english-corner',
            name: 'english-corner',
            component: () => import('../views/user/EnglishCorner/EnglishCorner.vue')
        },
        {
            path: '/english-corner/:slug',
            name: 'article-detail',
            component: () => import('../views/user/EnglishCorner/[slug]/Article.vue')
        },
        {
            path: '/payment',
            name: 'payment',
            component: () => import('../views/user/Payment/PaymentView.vue')
        },
        {
            path: '/appointment',
            name: 'appointment',
            component: () => import('../views/user/Appointment/Appointment.vue')
        }
    ]
})

export default router

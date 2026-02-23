import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/user/Homepage/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
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
        },
        {
            path: '/admin',
            name: 'admin-dashboard',
            component: () => import('../views/admin/Dashboard/DashboardAdmin.vue'),
            meta: { hideLayout: true }
        },
        {
            path: '/admin/applicant-data',
            name: 'admin-applicant',
            component: () => import('../views/admin/ApplicantData/Applicant.vue'),
            meta: { hideLayout: true }
        },
        {
            path: '/admin/account',
            name: 'admin-account',
            component: () => import('../views/admin/Account/Account.vue'),
            meta: { hideLayout: true }
        },
        {
            path: '/admin/appointment',
            name: 'admin-appointment',
            component: () => import('../views/admin/Appointment/Appointment.vue'),
            meta: { hideLayout: true }
        },
        {
            path: '/admin/events',
            name: 'admin-events',
            component: () => import('../views/admin/Events/Events.vue'),
            meta: { hideLayout: true }
        },
        {
            path: '/admin/english-corner',
            name: 'admin-english-corner',
            component: () => import('../views/admin/EnglishCorner/EnglishCorner.vue'),
            meta: { hideLayout: true }
        },
        {
            path: '/admin/english-corner/create',
            name: 'admin-english-corner-create',
            component: () => import('../views/admin/EnglishCorner/CRUD/CRUDView.vue'),
            meta: { hideLayout: true }
        },
        {
            path: '/admin/english-corner/edit/:id',
            name: 'admin-english-corner-edit',
            component: () => import('../views/admin/EnglishCorner/CRUD/CRUDView.vue'),
            meta: { hideLayout: true }
        },
        {
            path: '/admin/payments',
            name: 'admin-payments',
            component: () => import('../views/admin/Payments/Payment.vue'),
            meta: { hideLayout: true }
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth',
            }
        }
        if (savedPosition) {
            return savedPosition
        }
        return { top: 0 }
    }
})

export default router

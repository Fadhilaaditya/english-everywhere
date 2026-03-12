import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/user/Homepage/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth',
            }
        }
        return savedPosition || { top: 0 }
    },
    routes: [
        // ==============================
        // PUBLIC / USER ROUTES
        // ==============================
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
            path: '/profile',
            name: 'user-profile',
            component: () => import('../views/user/Profile/Profile.vue')
        },

        // ==============================
        // TEACHER ROUTES (BARU)
        // ==============================
        {
            path: '/teacher',
            // Menggunakan Layout khusus Teacher sebagai parent
            component: () => import('../views/teacher/TeacherLayout/TeacherLayout.vue'),
            meta: { hideLayout: true, requiresAuth: true, role: 'teacher' }, // Sembunyikan layout public (Navbar/Footer)
            children: [
                {
                    path: '', // URL: /teacher
                    name: 'teacher-home',
                    component: () => import('../views/user/Homepage/HomeView.vue')
                },
                {
                    path: 'events', // URL: /teacher/events
                    name: 'teacher-events',
                    component: () => import('../views/user/Events/Event.vue')
                },
                {
                    path: 'english-corner', // URL: /teacher/english-corner
                    name: 'teacher-english-corner',
                    component: () => import('../views/user/EnglishCorner/EnglishCorner.vue')
                },
                {
                    path: 'materials', // URL: /teacher/materials
                    name: 'teacher-materials',
                    component: () => import('../views/teacher/LearningMaterial/LearningMaterial.vue')
                },
                {
                    path: 'schedule', // URL: /teacher/schedule
                    name: 'teacher-schedule',
                    component: () => import('../views/teacher/Schedule/Schedule.vue')
                },
                {
                    path: 'profile', // URL: /teacher/profile
                    name: 'teacher-profile',
                    component: () => import('../views/user/Profile/Profile.vue')
                }
            ]
        },

        // ==============================
        // ADMIN ROUTES
        // ==============================
        {
            path: '/admin',
            name: 'admin-dashboard',
            component: () => import('../views/admin/Dashboard/DashboardAdmin.vue'),
            meta: { hideLayout: true, requiresAuth: true, role: 'admin' }
        },
        {
            path: '/admin/applicant-data',
            name: 'admin-applicant',
            component: () => import('../views/admin/ApplicantData/Applicant.vue'),
            meta: { hideLayout: true, requiresAuth: true, role: 'admin' }
        },
        {
            path: '/admin/account',
            name: 'admin-account',
            component: () => import('../views/admin/Account/Account.vue'),
            meta: { hideLayout: true, requiresAuth: true, role: 'admin' }
        },
        {
            path: '/admin/appointment',
            name: 'admin-appointment',
            component: () => import('../views/admin/Appointment/Appointment.vue'),
            meta: { hideLayout: true, requiresAuth: true, role: 'admin' }
        },
        {
            path: '/admin/events',
            name: 'admin-events',
            component: () => import('../views/admin/Events/Events.vue'),
            meta: { hideLayout: true, requiresAuth: true, role: 'admin' }
        },
        {
            path: '/admin/english-corner',
            name: 'admin-english-corner',
            component: () => import('../views/admin/EnglishCorner/EnglishCorner.vue'),
            meta: { hideLayout: true, requiresAuth: true, role: 'admin' }
        },
        {
            path: '/admin/english-corner/create',
            name: 'admin-english-corner-create',
            component: () => import('../views/admin/EnglishCorner/CRUD/CRUDView.vue'),
            meta: { hideLayout: true, requiresAuth: true, role: 'admin' }
        },
        {
            path: '/admin/english-corner/edit/:id',
            name: 'admin-english-corner-edit',
            component: () => import('../views/admin/EnglishCorner/CRUD/CRUDView.vue'),
            meta: { hideLayout: true, requiresAuth: true, role: 'admin' }
        },
        {
            path: '/admin/payments',
            name: 'admin-payments',
            component: () => import('../views/admin/Payments/Payment.vue'),
            meta: { hideLayout: true, requiresAuth: true, role: 'admin' }
        },
        {
            path: '/admin/schedules',
            name: 'admin-schedules',
            component: () => import('../views/admin/Schedules/ManageSchedules.vue'),
            meta: { hideLayout: true, requiresAuth: true, role: 'admin' }
        }
    ]
})

// ==============================
// NAVIGATION GUARD
// ==============================
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    const userRole = localStorage.getItem('role')

    // 1. Check if route requires authentication
    if (to.meta.requiresAuth) {
        if (!token) {
            // No token, redirect to login
            return next({ name: 'login', query: { redirect: to.fullPath } })
        }

        // 2. Check if route requires a specific role
        if (to.meta.role) {
            // Normalisasi userRole untuk perbandingan
            const normalizedUserRole = userRole === 'user' ? 'student' : userRole

            if (normalizedUserRole === 'admin') {
                // Admin can access everything
                return next()
            }

            if (to.meta.role !== normalizedUserRole) {
                // Role mismatch
                console.warn(`Access denied: Required role ${to.meta.role}, User role ${normalizedUserRole}`)
                return next({ name: 'home' }) // Redirect to home
            }
        }
    }

    // 3. Prevent logged-in users from accessing login page
    if (to.path === '/login' && token) {
        if (userRole === 'admin') return next({ name: 'admin-dashboard' })
        if (userRole === 'teacher') return next({ name: 'teacher-home' })
        return next({ name: 'home' })
    }

    next()
})

export default router
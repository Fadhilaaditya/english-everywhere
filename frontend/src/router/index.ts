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
            component: HomeView,
            meta: { 
                title: 'Kursus Bahasa Inggris Tangerang & Tangsel | English Everywhere',
                description: 'English Everywhere - Kursus bahasa Inggris interaktif di Tangerang & Tangerang Selatan. Belajar komunikatif dan menyenangkan.'
            }
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/auth/LoginView.vue'),
            meta: { 
                hideLayout: true,
                title: 'Login | English Everywhere',
                description: 'Masuk ke akun English Everywhere Anda.'
            }
        },
        {
            path: '/events',
            name: 'events',
            component: () => import('../views/user/Events/Event.vue'),
            meta: { 
                title: 'Event & Webinar Bahasa Inggris | English Everywhere',
                description: 'Daftar event seru, webinar, dan workshop bahasa Inggris di Tangerang bersama English Everywhere.'
            }
        },
        {
            path: '/english-corner',
            name: 'english-corner',
            component: () => import('../views/user/EnglishCorner/EnglishCorner.vue'),
            meta: { 
                title: 'Tips & Artikel Belajar Bahasa Inggris | English Corner',
                description: 'Tips belajar bahasa Inggris, wawasan budaya, dan artikel menarik lainnya di English Corner.'
            }
        },
        {
            path: '/english-corner/:slug',
            name: 'article-detail',
            component: () => import('../views/user/EnglishCorner/[slug]/Article.vue'),
            meta: { 
                title: 'Article | English Everywhere',
                description: 'Baca selengkapnya artikel menarik di English Corner.'
            }
        },
        {
            path: '/payment',
            name: 'payment',
            component: () => import('../views/user/Payment/PaymentView.vue'),
            meta: { 
                title: 'Payment | English Everywhere',
                description: 'Selesaikan pembayaran kelas English Everywhere Anda.'
            }
        },
        {
            path: '/appointment',
            name: 'appointment',
            component: () => import('../views/user/Appointment/Appointment.vue'),
            meta: { 
                title: 'Appointment | English Everywhere',
                description: 'Jadwalkan sesi belajar Anda di English Everywhere.'
            }
        },
        {
            path: '/profile',
            name: 'user-profile',
            component: () => import('../views/user/Profile/Profile.vue'),
            meta: { 
                title: 'Profile | English Everywhere',
                description: 'Kelola profil dan akun English Everywhere Anda.'
            }
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
                    component: () => import('../views/user/Homepage/HomeView.vue'),
                    meta: { 
                        title: 'Teacher Home | English Everywhere',
                        description: 'Dashboard pengajar English Everywhere.'
                    }
                },
                {
                    path: 'events', // URL: /teacher/events
                    name: 'teacher-events',
                    component: () => import('../views/user/Events/Event.vue'),
                    meta: { 
                        title: 'Teacher Events | English Everywhere',
                        description: 'Lihat event mendatang untuk pengajar.'
                    }
                },
                {
                    path: 'english-corner', // URL: /teacher/english-corner
                    name: 'teacher-english-corner',
                    component: () => import('../views/user/EnglishCorner/EnglishCorner.vue'),
                    meta: { 
                        title: 'Teacher English Corner | English Everywhere',
                        description: 'Kelola artikel di English Corner.'
                    }
                },
                {
                    path: 'materials', // URL: /teacher/materials
                    name: 'teacher-materials',
                    component: () => import('../views/teacher/LearningMaterial/LearningMaterial.vue'),
                    meta: { 
                        title: 'Learning Materials | English Everywhere',
                        description: 'Akses materi pembelajaran untuk pengajar.'
                    }
                },
                {
                    path: 'schedule', // URL: /teacher/schedule
                    name: 'teacher-schedule',
                    component: () => import('../views/teacher/Schedule/Schedule.vue'),
                    meta: { 
                        title: 'My Schedule | English Everywhere',
                        description: 'Lihat dan kelola jadwal mengajar Anda.'
                    }
                },
                {
                    path: 'profile', // URL: /teacher/profile
                    name: 'teacher-profile',
                    component: () => import('../views/user/Profile/Profile.vue'),
                    meta: { 
                        title: 'Teacher Profile | English Everywhere',
                        description: 'Kelola profil pengajar Anda.'
                    }
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
// SEO / META GUARD
// ==============================
router.afterEach((to) => {
    // Dynamic Title
    const baseTitle = 'English Everywhere';
    const pageTitle = to.meta.title ? `${to.meta.title}` : baseTitle;
    document.title = pageTitle;

    // Helper to update meta tags
    const updateMeta = (selector: string, content: string) => {
        const el = document.querySelector(selector);
        if (el) el.setAttribute('content', content);
    };

    const description = (to.meta.description as string) || 'Belajar Bahasa Inggris Seru & Interaktif bersama English Everywhere.';
    
    // Update Meta Tags
    updateMeta('meta[name="description"]', description);
    
    // Update OG Tags (for browser tools)
    updateMeta('meta[property="og:title"]', pageTitle);
    updateMeta('meta[property="og:description"]', description);
    updateMeta('meta[property="twitter:title"]', pageTitle);
    updateMeta('meta[property="twitter:description"]', description);
});

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

            if (normalizedUserRole === 'admin' || normalizedUserRole === 'superadmin') {
                // Admin/Superadmin can access everything
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
        const normalizedUserRole = userRole ? String(userRole).toLowerCase() : ''
        if (normalizedUserRole === 'admin' || normalizedUserRole === 'superadmin') {
            return next({ name: 'admin-dashboard' })
        }
        if (normalizedUserRole === 'teacher') return next({ name: 'teacher-home' })
        return next({ name: 'home' })
    }

    next()
})

export default router
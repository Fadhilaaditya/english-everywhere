<script setup lang="ts">
import { 
  LayoutDashboard, 
  User, 
  Calendar, 
  GraduationCap, 
  BookOpen, 
  Languages, 
  CreditCard,
  CalendarDays,
  Settings,
  LogOut
} from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { name: 'Account', icon: User, path: '/admin/account' },
  { name: 'Appointment', icon: Calendar, path: '/admin/appointment' },
  { name: 'Applicant Data', icon: GraduationCap, path: '/admin/applicant-data', hasNotification: true },
  { name: 'Learning Materials', icon: BookOpen, path: '/admin/learning-materials' },
  { name: 'English Corner', icon: Languages, path: '/admin/english-corner' },
  { name: 'Payments', icon: CreditCard, path: '/admin/payments' },
  { name: 'Events', icon: CalendarDays, path: '/admin/events' },
]

const isActive = (path: string) => {
  if (path === '/admin' && route.path === '/admin') return true
  if (path !== '/admin' && route.path.startsWith(path)) return true
  return false
}
</script>

<template>
  <div class="h-screen w-64 bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 overflow-y-auto">
    <!-- Logo -->
    <div class="p-8 flex justify-center">
      <img src="/logo.svg" alt="English Everywhere" class="h-12 w-auto" />
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 space-y-2">
      <template v-for="item in menuItems" :key="item.name">
        <router-link 
          :to="item.path"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative"
          :class="isActive(item.path) ? 'bg-[#4FD1C5] text-white shadow-lg shadow-[#4FD1C5]/20' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'"
        >
          <component :is="item.icon" class="w-5 h-5" />
          <span class="font-medium text-sm">{{ item.name }}</span>
          
          <!-- Red Dot Notification -->
          <div 
            v-if="item.hasNotification" 
            class="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full"
          ></div>
        </router-link>
      </template>
    </nav>

    <!-- Bottom Actions -->
    <div class="p-4 mt-auto space-y-2 border-t border-gray-50">
      <router-link 
        to="/admin/settings"
        class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all"
      >
        <Settings class="w-5 h-5" />
        <span class="font-medium text-sm">Settings</span>
      </router-link>
      
      <button 
        @click="handleLogout"
        class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
      >
        <LogOut class="w-5 h-5" />
        <span class="font-medium text-sm">Logout</span>
      </button>
    </div>
  </div>
</template>

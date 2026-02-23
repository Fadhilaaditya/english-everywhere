<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Menu, X } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const isMenuOpen = ref(false)
const user = ref<any>(null)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const checkUser = () => {
    const userData = localStorage.getItem('user')
    if (userData) {
        user.value = JSON.parse(userData)
    }
}

const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    user.value = null
    router.push('/login')
}

onMounted(() => {
    checkUser()
})
</script>

<template>
  <nav class="bg-white py-3 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50">
    <div class="flex items-center">
      <img src="/logo.svg" alt="English Everywhere Logo" class="h-12 w-auto" /> 
      </div>

    <div class="hidden md:flex items-center gap-16 font-poppins text-base font-semibold text-gray-800 whitespace-nowrap">
      
      <router-link 
        to="/" 
        class="hover:text-primary transition-colors" 
        :class="{ 'font-bold text-lg text-gray-900': route.path === '/' && !route.hash }"
      >
        Homepage
      </router-link> 
      
      <router-link 
        :to="{ path: '/', hash: '#about-us' }" 
        class="hover:text-primary transition-colors" 
        :class="{ 'font-bold text-lg text-gray-900': route.hash === '#about-us' }"
      >
        About Us
      </router-link>
      <router-link to="#" class="hover:text-primary transition-colors">Daftar Kelas</router-link>
      <router-link to="/events" class="hover:text-primary transition-colors" active-class="font-bold text-lg text-gray-900">Events</router-link>
      <router-link to="/english-corner" class="hover:text-primary transition-colors" active-class="font-bold text-lg text-gray-900">English Corner</router-link>
      
      <!-- Conditionally render Payment for student -->
      <router-link 
        v-if="user?.role === 'student'" 
        to="/payment" 
        class="hover:text-primary transition-colors" 
        active-class="font-bold text-lg text-gray-900"
      >
        Payment
      </router-link>

      <div v-if="user" class="flex items-center gap-4">
          <button @click="handleLogout" class="bg-[#F4838D] hover:bg-[#F4838D]/80 text-white px-8 py-2 rounded-xl font-bold transition-colors cursor-pointer inline-block text-center">
            Logout
          </button>
      </div>
      <router-link v-else to="/login" class="bg-[#F4838D] hover:bg-[#F4838D]/80 text-white px-8 py-2 rounded-xl font-bold transition-colors cursor-pointer inline-block text-center">
        Login
      </router-link>
    </div>

    <button @click="toggleMenu" class="md:hidden text-text-dark">
      <Menu v-if="!isMenuOpen" />
      <X v-else />
    </button>

    <div 
      v-if="isMenuOpen" 
      class="border-t border-gray-100 absolute top-full left-0 w-full bg-white shadow-xl flex flex-col items-center gap-4 py-8 md:hidden font-poppins font-medium z-50"
    >
      <router-link 
        to="/" 
        class="hover:text-primary transition-colors text-lg" 
        :class="{ 'font-bold text-gray-900': route.path === '/' && !route.hash }" 
        @click="toggleMenu"
      >
        Homepage
      </router-link>
      <router-link 
        :to="{ path: '/', hash: '#about-us' }" 
        class="hover:text-primary transition-colors text-lg" 
        :class="{ 'font-bold text-gray-900': route.hash === '#about-us' }" 
        @click="toggleMenu"
      >
        About Us
      </router-link>
      <router-link to="#" class="hover:text-primary transition-colors text-lg" @click="toggleMenu">Daftar Kelas</router-link>
      <router-link to="/events" class="hover:text-primary transition-colors text-lg" active-class="font-bold text-gray-900" @click="toggleMenu">Events</router-link>
      <router-link to="/english-corner" class="hover:text-primary transition-colors text-lg" active-class="font-bold text-gray-900" @click="toggleMenu">English Corner</router-link>
       <router-link 
        v-if="user?.role === 'student'" 
        to="/payment" 
        class="hover:text-primary transition-colors text-lg" 
        active-class="font-bold text-gray-900"
        @click="toggleMenu"
      >
        Payment
      </router-link>

      <button v-if="user" @click="() => { handleLogout(); toggleMenu() }" class="bg-[#F4838D] hover:bg-[#F4838D]/80 text-white px-8 py-3 rounded-full font-bold transition-colors cursor-pointer inline-block text-center mt-2">
        Logout  
      </button>
      <router-link v-else to="/login" class="bg-[#F4838D] hover:bg-[#F4838D]/80 text-white px-8 py-3 rounded-full font-bold transition-colors cursor-pointer inline-block text-center mt-2" @click="toggleMenu">
        Login
      </router-link>
    </div>  
  </nav>
</template>
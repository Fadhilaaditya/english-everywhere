<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Menu, X } from 'lucide-vue-next'

const router = useRouter()
const isMenuOpen = ref(false)
const user = ref<any>(null)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const checkUser = () => {
    const userData = localStorage.getItem('user')
    // Kita juga bisa ambil role langsung jika disimpan terpisah, tapi via user object juga aman
    if (userData) {
        user.value = JSON.parse(userData)
    }
}

const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('role') // Hapus role juga jika ada
    user.value = null
    router.push('/login')
}

const getLinkPath = (path: string) => {
    if (user.value?.role === 'teacher') {
        return path === '/' ? '/teacher' : `/teacher${path}`
    }
    return path
}

onMounted(() => {
    checkUser()
})
</script>

<template>
  <nav class="bg-white py-3 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 shadow-sm">
    <div class="flex items-center cursor-pointer" @click="router.push(getLinkPath('/'))">
      <img src="/logo.svg" alt="English Everywhere Logo" class="h-12 w-auto" /> 
    </div>

    <div class="hidden md:flex items-center gap-8 lg:gap-16 font-poppins text-base font-semibold text-gray-800 whitespace-nowrap">
      
      <router-link :to="getLinkPath('/')" class="hover:text-primary transition-colors" exact-active-class="font-bold text-lg text-gray-900">Homepage</router-link> 
      <router-link :to="getLinkPath('/about-us')" class="hover:text-primary transition-colors" active-class="font-bold text-lg text-gray-900">About Us</router-link>
      <router-link to="#" class="hover:text-primary transition-colors">Daftar Kelas</router-link>
      <router-link :to="getLinkPath('/events')" class="hover:text-primary transition-colors" active-class="font-bold text-lg text-gray-900">Events</router-link>
      <router-link :to="getLinkPath('/english-corner')" class="hover:text-primary transition-colors" active-class="font-bold text-lg text-gray-900">English Corner</router-link>
      
      <router-link 
        v-if="user?.role === 'student'" 
        to="/payment" 
        class="hover:text-primary transition-colors" 
        active-class="font-bold text-lg text-gray-900"
      >
        Payment
      </router-link>

      <template v-if="user?.role === 'teacher'">
        <div class="h-6 w-px bg-gray-300 mx-[-20px]"></div> <router-link 
            to="/teacher/materials" 
            class="hover:text-primary transition-colors"
            active-class="font-bold text-lg text-gray-900"
        >
            Materi Ajar
        </router-link>
        <router-link 
            to="/teacher/schedule" 
           class="hover:text-primary transition-colors"
            active-class="font-bold text-lg text-gray-900"
        >
            Jadwal
        </router-link>
      </template>
      <div v-if="user" class="flex items-center gap-4">
          <button @click="handleLogout" class="bg-[#F4838D] hover:bg-[#F4838D]/80 text-white px-8 py-2 rounded-xl font-bold transition-colors cursor-pointer inline-block text-center shadow-md">
            Logout
          </button>
      </div>
      <router-link v-else to="/login" class="bg-[#F4838D] hover:bg-[#F4838D]/80 text-white px-8 py-2 rounded-xl font-bold transition-colors cursor-pointer inline-block text-center shadow-md">
        Login
      </router-link>
    </div>

    <button @click="toggleMenu" class="md:hidden text-gray-800">
      <Menu v-if="!isMenuOpen" />
      <X v-else />
    </button>

    <div 
      v-if="isMenuOpen" 
      class="border-t border-gray-100 absolute top-full left-0 w-full bg-white shadow-xl flex flex-col items-center gap-6 py-8 md:hidden font-poppins font-medium z-50 transition-all"
    >
      <router-link :to="getLinkPath('/')" class="hover:text-primary transition-colors text-lg" active-class="font-bold text-gray-900" @click="toggleMenu">Homepage</router-link>
      <router-link :to="getLinkPath('/about-us')" class="hover:text-primary transition-colors text-lg" active-class="font-bold text-gray-900" @click="toggleMenu">About Us</router-link>
      <router-link to="#" class="hover:text-primary transition-colors text-lg" @click="toggleMenu">Daftar Kelas</router-link>
      <router-link :to="getLinkPath('/events')" class="hover:text-primary transition-colors text-lg" active-class="font-bold text-gray-900" @click="toggleMenu">Events</router-link>
      <router-link :to="getLinkPath('/english-corner')" class="hover:text-primary transition-colors text-lg" active-class="font-bold text-gray-900" @click="toggleMenu">English Corner</router-link>
      
      <router-link 
        v-if="user?.role === 'student'" 
        to="/payment" 
        class="hover:text-primary transition-colors text-lg" 
        active-class="font-bold text-gray-900"
        @click="toggleMenu"
      >
        Payment
      </router-link>

      <template v-if="user?.role === 'teacher'">
        <div class="w-20 border-t border-dashed border-gray-300"></div>
        <p class="text-xs text-gray-400 uppercase font-bold">Menu Guru</p>
        <router-link to="/teacher/materials" class="text-[#00B4D8] font-bold text-lg" @click="toggleMenu">Materi Ajar</router-link>
        <router-link to="/teacher/schedule" class="text-[#00B4D8] font-bold text-lg" @click="toggleMenu">Jadwal</router-link>
        <div class="w-20 border-t border-dashed border-gray-300"></div>
      </template>

      <button v-if="user" @click="() => { handleLogout(); toggleMenu() }" class="bg-[#F4838D] hover:bg-[#F4838D]/80 text-white px-8 py-3 rounded-full font-bold transition-colors cursor-pointer inline-block text-center mt-2 shadow-md">
        Logout  
      </button>
      <router-link v-else to="/login" class="bg-[#F4838D] hover:bg-[#F4838D]/80 text-white px-8 py-3 rounded-full font-bold transition-colors cursor-pointer inline-block text-center mt-2 shadow-md" @click="toggleMenu">
        Login
      </router-link>
    </div>  
  </nav>
</template>
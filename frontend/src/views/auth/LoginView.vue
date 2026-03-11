<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-vue-next'

const router = useRouter()
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
    errorMessage.value = ''
    isLoading.value = true
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username.value,
                password: password.value
            })
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || 'Login failed')
        }

        // ==========================================
        // PERUBAHAN PENTING DI SINI
        // ==========================================
        
        // 1. Simpan Token
        localStorage.setItem('token', data.accessToken)
        
        // 2. Simpan Role (PENTING untuk Navbar!)
        localStorage.setItem('role', data.role) 

        // 3. Simpan User Data
        localStorage.setItem('user', JSON.stringify({
            id: data.id,
            username: data.username,
            fullName: data.fullName,
            role: data.role,
            studentId: data.studentId // Menambahkan ini agar PaymentView bisa membacanya
        }))
        
        // 4. Logika Redirect yang Sudah Diperbarui
        if (data.role === 'admin') {
            router.push('/admin')
        } else if (data.role === 'teacher') {
            router.push('/teacher') // <--- Redirect khusus Guru
        } else {
            router.push('/') // Redirect Siswa/Umum
        }
        
    } catch (error: any) {
        errorMessage.value = error.message
        console.error('Login error:', error)
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
  <div class="flex h-screen w-full bg-white overflow-hidden">
    <div class="hidden md:flex w-1/2 bg-white relative items-center justify-center overflow-hidden">
      <img src="https://res.cloudinary.com/dosfggbxu/image/upload/v1773216099/Eng_Ever_Design_Mask_Group_erchyw.png" alt="Login Illustration" class="w-full h-full object-cover" />
    </div>

    <div class="w-full md:w-1/2 flex flex-col items-center justify-center px-8 md:px-24 bg-white relative">
        <router-link to="/" class="absolute top-6 left-6 p-2 text-gray-500 hover:text-primary transition-colors cursor-pointer" title="Back to Home">
            <ArrowLeft class="w-6 h-6" />
            <span class="sr-only">Back to Home</span>
        </router-link>

        <div class="mb-12">
            <img src="/logo.svg" alt="English Everywhere" class="h-16 w-auto" />
        </div>

      <div class="w-full max-w-sm">
        <h1 class="text-3xl font-bold text-gray-900 mb-2 text-center">Welcome Back!</h1>
        <p class="text-gray-500 mb-8 text-center text-sm">Enter your detail to continue</p>

        <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm text-center flex items-center justify-center gap-2">
           ⚠️ {{ errorMessage }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="username" class="block text-sm font-semibold text-gray-700 mb-2">Username</label>
            <div class="relative">
                <input
                    id="username"
                    v-model="username"
                    type="text"
                    required
                    placeholder="input username"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F4838D]/50 focus:border-[#F4838D] text-gray-700 placeholder-gray-400 transition-all font-medium"
                />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="input your password"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F4838D]/50 focus:border-[#F4838D] text-gray-700 placeholder-gray-400 transition-all font-medium pr-10"
              />
              <button
                type="button"
                @click="togglePassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
              >
                <Eye v-if="!showPassword" class="w-5 h-5" />
                <EyeOff v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-[#F4838D] hover:bg-[#F4838D]/90 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer mt-4 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Loader2 v-if="isLoading" class="w-5 h-5 animate-spin" />
            <span v-if="!isLoading">Login</span>
            <span v-else>Processing...</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
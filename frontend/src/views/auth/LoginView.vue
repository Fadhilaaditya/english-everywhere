<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Eye, EyeOff, ArrowLeft } from 'lucide-vue-next'

const router = useRouter()
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
    errorMessage.value = ''
    isLoading.value = true
    
    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
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

        // Login successful
        localStorage.setItem('token', data.accessToken)
        localStorage.setItem('user', JSON.stringify({
            id: data.id,
            username: data.username,
            fullName: data.fullName,
            role: data.role
        }))
        
        // Redirect to homepage
        router.push('/')
        
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
    <!-- Left Side: Image/Decoration -->
    <div class="hidden md:flex w-1/2 bg-white relative items-center justify-center overflow-hidden">
      <img src="/login.svg" alt="Login Illustration" class="w-full h-full object-cover" />
    </div>

    <!-- Right Side: Login Form -->
    <div class="w-full md:w-1/2 flex flex-col items-center justify-center px-8 md:px-24 bg-white relative">
        <!-- Back Button -->
        <router-link to="/" class="absolute top-6 left-6 p-2 text-gray-500 hover:text-primary transition-colors cursor-pointer" title="Back to Home">
            <ArrowLeft class="w-6 h-6" />
            <span class="sr-only">Back to Home</span>
        </router-link>

        <!-- Logo -->
        <div class="mb-12">
            <img src="/logo.svg" alt="English Everywhere" class="h-16 w-auto" />
        </div>

      <div class="w-full max-w-sm">
        <h1 class="text-3xl font-bold text-gray-900 mb-2 text-center">Welcome Back!</h1>
        <p class="text-gray-500 mb-8 text-center text-sm">Enter your detail to continue</p>

        <!-- Error Alert -->
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
            {{ errorMessage }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Username Input -->
          <div>
            <label for="username" class="block text-sm font-semibold text-gray-700 mb-2">Username</label>
            <div class="relative">
                <input
                    id="username"
                    v-model="username"
                    type="text"
                    placeholder="input username"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-700 placeholder-gray-400 transition-all font-medium"
                />
                 <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                    <!-- Icon placeholder if needed -->
                </div>
            </div>
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="input your password"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-gray-700 placeholder-gray-400 transition-all font-medium"
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

          <!-- Login Button -->
          <button
            type="submit"
            class="w-full bg-[#F4838D] hover:bg-[#F4838D]/90 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer mt-4"
          >
            Login
          </button>
        </form>
      </div>
      
      <!-- Decorative Bottom Right (Optional, part of page design roughly) -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import { onMounted, onUnmounted, watch } from 'vue'
import NavBar from './views/user/components/NavBar.vue'
import Footer from './views/user/components/Footer.vue'

const route = useRoute()
const router = useRouter()

let logoutTimer: any = null

const startLogoutTimer = () => {
  if (logoutTimer) clearTimeout(logoutTimer)
  
  // Only start timer if user is logged in
  if (localStorage.getItem('token')) {
    logoutTimer = setTimeout(() => {
      logoutUser()
    }, 3600000) // 1 hour in ms
  }
}

const logoutUser = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

const resetTimer = () => {
  startLogoutTimer()
}

onMounted(() => {
  // Listen for user activity
  window.addEventListener('mousemove', resetTimer)
  window.addEventListener('keypress', resetTimer)
  window.addEventListener('mousedown', resetTimer)
  window.addEventListener('touchstart', resetTimer)
  
  startLogoutTimer()
})

onUnmounted(() => {
  window.removeEventListener('mousemove', resetTimer)
  window.removeEventListener('keypress', resetTimer)
  window.removeEventListener('mousedown', resetTimer)
  window.removeEventListener('touchstart', resetTimer)
  if (logoutTimer) clearTimeout(logoutTimer)
})

// Reset timer on route change
watch(() => route.path, () => {
  resetTimer()
})
</script>

<template>
  <div class="font-sans antialiased text-gray-900 bg-white">
    <NavBar v-if="!route.meta.hideLayout" />
    <RouterView />
    <Footer v-if="!route.meta.hideLayout" />
  </div>
</template>

<style scoped></style>

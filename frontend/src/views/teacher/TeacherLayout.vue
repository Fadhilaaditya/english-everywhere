<script setup lang="ts">
import NavBar from '../user/components/NavBar.vue' // Menggunakan Navbar User yang sudah ada
import Footer from '../user/components/Footer.vue' // Menggunakan Footer User yang sudah ada
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <NavBar />

    <main class="flex-grow bg-gray-50 py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>

      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
<script setup lang="ts">
import { ref } from 'vue'
import { Menu, X } from 'lucide-vue-next'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <nav class="bg-white py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 shadow-sm">
    <!-- Logo -->
    <div class="flex items-center">
      <div class="text-secondary font-quicksand font-bold text-xl flex items-center gap-2">
        <!-- Placeholder for Logo -->
        <span class="text-2xl">English Everywhere</span>
      </div>
    </div>

    <!-- Desktop Menu -->
    <div class="hidden md:flex items-center gap-8 font-poppins text-sm font-medium text-text-dark">
      <a href="#" class="hover:text-primary transition-colors">Homepage</a>
      <a href="#" class="hover:text-primary transition-colors">About Us</a>
      <a href="#" class="hover:text-primary transition-colors">Daftar Kelas</a>
      <a href="#" class="hover:text-primary transition-colors">Events</a>
      <a href="#" class="hover:text-primary transition-colors">English Corner</a>
      <button class="bg-primary hover:bg-orange-500 text-white px-6 py-2 rounded-full font-bold transition-colors cursor-pointer">
        Login
      </button>
    </div>

    <!-- Mobile Menu Button -->
    <button @click="toggleMenu" class="md:hidden text-text-dark">
      <Menu v-if="!isMenuOpen" />
      <X v-else />
    </button>

    <!-- Mobile Menu -->
    <div v-if="isMenuOpen" class="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center gap-4 py-6 md:hidden font-poppins font-medium">
      <a href="#" class="hover:text-primary transition-colors">Homepage</a>
      <a href="#" class="hover:text-primary transition-colors">About Us</a>
      <a href="#" class="hover:text-primary transition-colors">Daftar Kelas</a>
      <a href="#" class="hover:text-primary transition-colors">Events</a>
      <a href="#" class="hover:text-primary transition-colors">English Corner</a>
      <button class="bg-primary hover:bg-orange-500 text-white px-6 py-2 rounded-full font-bold transition-colors cursor-pointer">
        Login
      </button>
    </div>
  </nav>
</template>

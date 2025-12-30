<script setup lang="ts">
import { ref } from 'vue'
import { Search } from 'lucide-vue-next'
import UpcomingEvents from './_components/UpcomingEvents.vue'
import PastEvent from './_components/PastEvent.vue'

const searchQuery = ref('')
</script>

<template>
  <div class="px-8 md:px-20 lg:px-32 py-16 md:py-24 max-w-[1440px] mx-auto min-h-screen bg-bg-light font-poppins relative overflow-hidden">
    <!-- Decorative Hexagons (Right Side) -->
    <img src="/hex.svg" class="absolute top-60 right-10 translate-x-1/4 hidden lg:block pointer-events-none w-[150px] h-[150px]" alt="Hexagon Outline" />

    <!-- Header Section -->
    <div class="text-center mb-20 relative z-10">
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-12 tracking-wide leading-tight">
        LET'S HAVE FUN AND LEARN ENGLISH
      </h1>

      <!-- Search Bar -->
      <div class="relative max-w-3xl mx-auto">
        <div class="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none">
          <Search class="h-6 w-6 text-gray-400" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="search event"
          class="block w-full pl-16 pr-6 py-5 rounded-full bg-white border-none shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 text-base"
        />
      </div>
    </div>

    <!-- Upcoming Events Component -->
    <UpcomingEvents :searchQuery="searchQuery" />

    <!-- Past Events Component -->
    <PastEvent :searchQuery="searchQuery" />

    <!-- Decorative Hexagons (Left Side) -->
    <img src="/hex.svg" class="absolute bottom-20 left-10 -translate-x-1/4 hidden lg:block pointer-events-none w-[150px] h-[150px]" alt="Hexagon Outline" />
  </div>
</template>

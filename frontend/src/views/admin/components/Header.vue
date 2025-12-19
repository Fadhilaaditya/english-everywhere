<script setup lang="ts">
import { ref } from 'vue'
import { Search, Calendar } from 'lucide-vue-next'

const currentDate = new Date().toLocaleDateString('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})

const user = JSON.parse(localStorage.getItem('user') || '{}')
</script>

<template>
  <header class="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8">
    <!-- Search Bar -->
    <div class="relative w-96">
      <input 
        type="text"
        placeholder="Search"
        class="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 transition-all"
      />
      <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
    </div>

    <!-- Right Side -->
    <div class="flex items-center gap-8">
      <!-- Date -->
      <div class="flex items-center gap-2 text-gray-500">
        <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <Calendar class="w-4 h-4" />
        </div>
        <span class="text-sm font-medium">{{ currentDate }}</span>
      </div>

      <!-- User Profile -->
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
            <!-- Placeholder avatar using UI Avatars if no image -->
            <img 
                :src="`https://ui-avatars.com/api/?name=${user.fullName || 'Admin'}&background=random`" 
                alt="Profile" 
                class="w-full h-full object-cover"
            />
        </div>
        <div class="flex flex-col">
            <span class="text-sm font-bold text-gray-900">{{ user.fullName || 'Jane Doe' }}</span>
            <span class="text-xs text-gray-500">{{ user.role || 'Admin' }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

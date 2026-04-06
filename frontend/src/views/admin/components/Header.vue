<script setup lang="ts">
import { ref } from 'vue'
import { Calendar, Menu } from 'lucide-vue-next'

const currentDate = new Date().toLocaleDateString('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})

const user = JSON.parse(localStorage.getItem('user') || '{}')

defineEmits(['toggleSidebar'])
</script>

<template>
  <header class="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
    <div class="flex items-center gap-4">
      <!-- Mobile Menu Button -->
      <button 
        @click="$emit('toggleSidebar')" 
        class="p-2 -ml-2 hover:bg-gray-100 rounded-lg lg:hidden"
      >
        <Menu class="w-6 h-6 text-gray-600" />
      </button>

      <!-- Search Bar -->
    </div>

    <!-- Right Side -->
    <div class="flex items-center gap-4 lg:gap-8">
      <!-- Date -->
      <div class="hidden md:flex items-center gap-2 text-gray-500">
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
        <div class="hidden md:flex flex-col">
            <span class="text-sm font-bold text-gray-900">{{ user.fullName || 'Admin' }}</span>
            <span class="text-xs text-gray-500">{{ user.role || 'Admin' }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

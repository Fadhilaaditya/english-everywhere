<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { cloudinaryOptimize, cloudinaryResponsiveSrcset } from '@/utils/imageUtils'

interface Program {
  id: number
  title: string
  desc: string | null
  image: string | null
  category: string
}

import api from '@/api'

const activeFilter = ref('REGULAR')
const programs = ref<Program[]>([])
const isLoading = ref(true)
const loadError = ref(false)
const failedImages = ref<Set<number>>(new Set())
const originalImages = ref<Set<number>>(new Set())

const fetchPrograms = async () => {
  isLoading.value = true
  loadError.value = false
  try {
    const response = await api.get<Program[]>('/programs/home')
    programs.value = response.data
    failedImages.value = new Set()
    originalImages.value = new Set()
  } catch (error) {
    loadError.value = true
    console.error('Error fetching programs:', error)
  } finally {
    isLoading.value = false
  }
}

const handleImageError = (program: Program) => {
  if (!originalImages.value.has(program.id) && cloudinaryResponsiveSrcset(program.image)) {
    originalImages.value = new Set([...originalImages.value, program.id])
  } else {
    failedImages.value = new Set([...failedImages.value, program.id])
  }
}

const filteredPrograms = computed(() => {
  return programs.value.filter(program => 
    program.category?.toUpperCase() === activeFilter.value?.toUpperCase()
  )
})

onMounted(() => {
  fetchPrograms()
})
</script>

<template>
  <section id="programs" class="py-16 px-4 md:px-32 bg-[#FF9213] relative">
    <!-- Decorative Stars -->
    <div class="absolute top-10 left-5 text-white opacity-80">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
    </div>
     <div class="absolute top-20 left-10 text-white opacity-60">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
    </div>

    <div class="max-w-6xl mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <h2 class="text-3xl font-bold text-white text-center md:text-left">OUR PROGRAMS</h2>
        <!-- Debug Info (Optional) -->
        <span class="hidden">Programs: {{ programs.length }}</span>
        
        <div class="flex gap-2 flex-wrap justify-center">
          <button 
            @click="activeFilter = 'REGULAR'"
            :class="[
              'px-6 py-2 rounded-full font-bold text-sm transition-colors cursor-pointer',
              activeFilter === 'REGULAR' ? 'bg-white text-primary' : 'bg-transparent border border-white text-white hover:bg-white/10'
            ]"
          >
            REGULAR
          </button>
          <button 
            @click="activeFilter = 'INTENSIVE'"
            :class="[
              'px-6 py-2 rounded-full font-bold text-sm transition-colors cursor-pointer',
              activeFilter === 'INTENSIVE' ? 'bg-white text-primary' : 'bg-transparent border border-white text-white hover:bg-white/10'
            ]"
          >
            INTENSIVE
          </button>
        </div>
      </div>

      <div v-if="isLoading" role="status" aria-label="Loading programs" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="item in 3" :key="item" aria-hidden="true" class="rounded-xl bg-white overflow-hidden shadow-lg motion-safe:animate-pulse">
          <div class="h-[198px] bg-gray-100"></div>
          <div class="p-6 space-y-3"><div class="h-6 w-2/3 rounded bg-gray-100"></div><div class="h-4 rounded bg-gray-100"></div><div class="h-4 w-4/5 rounded bg-gray-100"></div></div>
        </div>
        <span class="sr-only">Loading programs...</span>
      </div>
      <div v-else-if="!loadError" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        <div 
            v-for="program in filteredPrograms" 
            :key="program.id" 
            @click="$router.push({ path: '/appointment' })"
            class="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow w-full cursor-pointer transform hover:-translate-y-1 duration-300 h-full flex flex-col"
        >
          <div class="h-[198px] w-full flex items-center justify-center bg-white overflow-hidden">
            <img 
              v-if="program.image && !failedImages.has(program.id)"
              :src="originalImages.has(program.id) || !cloudinaryResponsiveSrcset(program.image) ? program.image : cloudinaryOptimize(program.image, { width: 900 })"
              :srcset="originalImages.has(program.id) ? undefined : cloudinaryResponsiveSrcset(program.image)"
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 65vw, 600px"
              :alt="program.title" 
              class="max-h-full max-w-full object-contain flex-shrink-0 scale-173 transition-transform duration-500 hover:scale-160" 
              loading="lazy"
              decoding="async"
              @error="handleImageError(program)"
            />
            <span v-else class="text-sm text-gray-400">Image unavailable</span>
          </div>
          
          <div class="p-6 flex flex-col flex-grow">
            <h3 class="font-bold text-lg text-text-dark mb-1 h-[50px] flex items-center leading-tight">{{ program.title }}</h3>
            <p class="text-sm text-text-dark font-poppins flex-grow">{{ program.desc }}</p>
          </div>
        </div>
      </div>

      <!-- No Programs Feedback -->
      <div v-if="!isLoading && loadError" role="alert" class="text-center py-20 text-white">
        <p>Failed to load programs.</p>
        <button type="button" class="mt-3 underline font-bold" @click="fetchPrograms">Try again</button>
      </div>
      <div v-else-if="!isLoading && filteredPrograms.length === 0" class="text-center py-20 bg-white/10 rounded-2xl border-2 border-dashed border-white/30">
        <p class="text-white font-medium text-lg">No programs available in this category yet.</p>
      </div>
    </div>
  </section>
</template>

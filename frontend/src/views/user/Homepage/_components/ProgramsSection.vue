<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

interface Program {
  id: number
  title: string
  price: string
  desc: string
  image: string
  category: string
}

const activeFilter = ref('REGULAR')
const programs = ref<Program[]>([])

const fetchPrograms = async () => {
  try {
    const response = await fetch('http://127.0.0.1:3001/api/programs')
    if (!response.ok) throw new Error('Failed to fetch programs')
    programs.value = await response.json()
    console.log('Fetched programs:', programs.value)
  } catch (error) {
    console.error('Error fetching programs:', error)
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

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        <div 
            v-for="program in filteredPrograms" 
            :key="program.id" 
            @click="$router.push({ path: '/appointment' })"
            class="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow w-full cursor-pointer transform hover:-translate-y-1 duration-300 h-full flex flex-col"
        >
          <img :src="program.image" :alt="program.title" class="h-[198px] w-full object-cover flex-shrink-0" />
          
          <div class="p-6 flex flex-col flex-grow">
            <h3 class="font-bold text-lg text-text-dark mb-1 h-[50px] flex items-center leading-tight">{{ program.title }}</h3>
            <p class="text-xs text-gray-500 mb-3">{{ program.price }}</p>
            <p class="text-sm text-text-dark font-poppins flex-grow">{{ program.desc }}</p>
          </div>
        </div>
      </div>

      <!-- No Programs Feedback -->
      <div v-if="filteredPrograms.length === 0" class="text-center py-20 bg-white/10 rounded-2xl border-2 border-dashed border-white/30">
        <p class="text-white font-medium text-lg">No programs available in this category yet.</p>
      </div>
    </div>
  </section>
</template>

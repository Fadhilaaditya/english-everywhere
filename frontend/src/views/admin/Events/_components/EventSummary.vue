<script setup lang="ts">
import { ref, onMounted } from 'vue'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const stats = ref([
  { label: 'Total Events', value: 0, color: 'text-gray-900' },
  { label: 'Upcoming', value: 0, color: 'text-[#4FD1C5]' },
  { label: 'Past Events', value: 0, color: 'text-gray-500' },
])

const fetchSummary = async () => {
    try {
        const response = await fetch(`${API_URL}/events/summary`);
        if (!response.ok) throw new Error('Failed to fetch summary');
        const data = await response.json();
        
        stats.value = [
            { label: 'Total Events', value: data.total, color: 'text-gray-900' },
            { label: 'Upcoming', value: data.upcoming, color: 'text-[#4FD1C5]' },
            { label: 'Past Events', value: data.past, color: 'text-gray-500' },
        ]
    } catch (error) {
        console.error('Error fetching summary:', error);
    }
}

onMounted(() => {
    fetchSummary();
})
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-white border border-gray-100 rounded-2xl md:rounded-[32px] overflow-hidden mb-6 md:mb-8 shadow-sm w-full">
    <div 
      v-for="(stat, index) in stats" 
      :key="index" 
      class="p-4 md:p-8 flex flex-col gap-1 md:gap-2 relative"
      :class="[
        index < stats.length - 1 ? 'border-b sm:border-b-0 sm:border-r border-gray-100' : '',
        index === 1 ? 'sm:border-r-0 lg:border-r border-gray-100' : ''
      ]"
    >
      <span class="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">{{ stat.label }}</span>
      <span class="text-2xl md:text-4xl font-bold" :class="stat.color">{{ stat.value }}</span>
    </div>
  </div>
</template>

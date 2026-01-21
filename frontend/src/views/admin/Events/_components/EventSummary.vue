<script setup lang="ts">
import { ref, onMounted } from 'vue'

const stats = ref([
  { label: 'Total Events', value: 0 },
  { label: 'Upcoming Events', value: 0 },
  { label: 'Past Events', value: 0 },
])

const fetchSummary = async () => {
    try {
        const response = await fetch('http://localhost:3001/api/events/summary');
        if (!response.ok) throw new Error('Failed to fetch summary');
        const data = await response.json();
        
        stats.value = [
            { label: 'Total Events', value: data.total },
            { label: 'Upcoming Events', value: data.upcoming },
            { label: 'Past Events', value: data.past },
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
  <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden flex divide-x divide-gray-200 w-fit shadow-sm mb-8">
    <div v-for="(stat, index) in stats" :key="index" class="p-6 w-64">
      <h3 class="text-gray-500 text-sm font-medium mb-2">{{ stat.label }}</h3>
      <p class="text-3xl font-bold text-gray-900">{{ stat.value }}</p>
    </div>
  </div>
</template>

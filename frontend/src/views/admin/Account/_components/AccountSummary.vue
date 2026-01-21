<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const stats = ref([
  { label: 'Total Account', value: '0' },
  { label: 'Total Student', value: '0' },
  { label: 'Total Teacher', value: '0' },
])

const fetchStats = async () => {
    try {
        const response = await fetch('http://localhost:3001/api/users/stats')
        if (response.ok) {
            const data = await response.json()
            stats.value = [
                { label: 'Total Account', value: String(data.totalAccounts || 0) },
                { label: 'Total Student', value: String(data.totalStudents || 0) },
                { label: 'Total Teacher', value: String(data.totalTeachers || 0) },
            ]
        }
    } catch (e) {
        console.error('Failed to fetch stats', e)
    }
}

let intervalId: any = null

onMounted(() => {
    fetchStats()
    // Poll every 3 seconds for real-time updates
    intervalId = setInterval(fetchStats, 3000)
})

onUnmounted(() => {
    if (intervalId) clearInterval(intervalId)
})
</script>

<template>
  <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden flex divide-x divide-gray-200 w-fit shadow-sm">
    <div v-for="(stat, index) in stats" :key="index" class="p-6 w-64">
      <h3 class="text-gray-500 text-sm font-medium mb-2">{{ stat.label }}</h3>
      <p class="text-3xl font-bold text-gray-900">{{ stat.value }}</p>
    </div>
  </div>
</template>

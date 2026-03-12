<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
const bookings = ref<any[]>([])

const fetchBookings = async () => {
    try {
        const response = await fetch(`${API_URL}/programs/bookings/all`)
        if (response.ok) {
            bookings.value = await response.json()
        }
    } catch (e) {
        console.error('Failed to fetch bookings', e)
    }
}

const stats = computed(() => {
    const tableRelevantBookings = bookings.value.filter(b => ['ACCEPTED', 'BOOKED'].includes(b.status))
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD
    
    const scheduledToday = tableRelevantBookings.filter(b => {
        return b.schedule?.date === today
    }).length

    return [
        { 
            label: 'Total Applicants', 
            value: tableRelevantBookings.length, 
            color: 'text-gray-900'
        },
        { 
            label: 'Scheduled Today', 
            value: scheduledToday, 
            color: 'text-orange-500'
        }
    ]
})

let pollingInterval: any = null

onMounted(() => {
    fetchBookings()
    pollingInterval = setInterval(fetchBookings, 3000)
})

onUnmounted(() => {
    if (pollingInterval) clearInterval(pollingInterval)
})
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 bg-white border border-gray-100 rounded-2xl md:rounded-[32px] overflow-hidden mb-6 md:mb-8 shadow-sm w-full">
    <div
      v-for="(item, index) in stats"
      :key="item.label"
      class="p-4 md:p-8 flex flex-col gap-1 md:gap-2 relative"
      :class="[
        index < stats.length - 1 ? 'border-b sm:border-b-0 sm:border-r border-gray-100' : '',
        index === 1 ? 'sm:border-r-0 lg:border-r border-gray-100' : ''
      ]"
    >
      <span class="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">{{ item.label }}</span>
      <span class="text-2xl md:text-4xl font-bold" :class="item.color">{{ item.value }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const totalApplicants = ref(0)

const fetchApplicantsCount = async () => {
    try {
        const response = await fetch('http://localhost:3001/api/programs/bookings/all?status=BOOKED')
        if (response.ok) {
            const data = await response.json()
            totalApplicants.value = data.length
        }
    } catch (e) {
        console.error('Failed to fetch applicant count', e)
    }
}

let pollingInterval: any = null

onMounted(() => {
    fetchApplicantsCount()
    // Poll every 1 seconds
    pollingInterval = setInterval(fetchApplicantsCount, 1000)
})

onUnmounted(() => {
    if (pollingInterval) clearInterval(pollingInterval)
})
</script>

<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-6 w-64 shadow-sm">
    <h3 class="text-gray-500 text-sm font-medium mb-2">Total Applicant</h3>
    <p class="text-3xl font-bold text-gray-900">{{ totalApplicants }}</p>
  </div>
</template>

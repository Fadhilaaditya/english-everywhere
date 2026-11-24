<script setup lang="ts">
import { computed } from 'vue'
import { useBookingSummary } from '@/services/BookingSummaryService'

const { summary, error, refresh } = useBookingSummary()

const stats = computed(() => {
    return [
        { 
            label: 'Total Applicants', 
            value: summary.value?.totalApplicants ?? '—',
            color: 'text-gray-900'
        },
        { 
            label: 'Scheduled Today', 
            value: summary.value?.scheduledToday ?? '—',
            color: 'text-orange-500'
        }
    ]
})

</script>

<template>
 <div>
  <p v-if="error" role="alert" class="mb-2 text-sm text-red-600">Failed to load applicant summary. <button class="underline" @click="refresh">Try again</button></p>
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
 </div>
</template>

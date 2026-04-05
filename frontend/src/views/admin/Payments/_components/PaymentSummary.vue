<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  totalTransactions: number
  transactionsToday: number
  jatuhTempoCount: number
  tertundaCount: number
}>()

const summaryItems = computed(() => [
  { label: 'Total Transaction', value: props.totalTransactions.toString(), color: 'text-gray-900' },
  { label: 'Total Transaction Today', value: props.transactionsToday.toString(), color: 'text-gray-900' },
  { label: 'Overdue Payment', value: props.jatuhTempoCount.toString(), color: 'text-red-500' },
  { label: 'Pending Transaction', value: props.tertundaCount.toString(), color: 'text-yellow-500' }
])
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-white border border-gray-100 rounded-2xl md:rounded-[32px] overflow-hidden mb-6 md:mb-8 shadow-sm">
    <div 
      v-for="(item, index) in summaryItems" 
      :key="item.label"
      class="p-4 md:p-8 flex flex-col gap-1 md:gap-2 relative"
      :class="[
        index < summaryItems.length - 1 ? 'border-b sm:border-b-0 sm:border-r border-gray-100' : '',
        index === 1 ? 'sm:border-r-0 lg:border-r border-gray-100' : ''
      ]"
    >
      <span class="text-xs md:text-sm font-medium text-gray-500">{{ item.label }}</span>
      <span class="text-2xl md:text-4xl font-bold" :class="item.color">{{ item.value }}</span>
    </div>
  </div>
</template>

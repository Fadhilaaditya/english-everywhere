<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  stats: {
    totalAccounts: number
    totalTransactions: number
    overduePayments: number
    pendingPayments: number
    pendingAppointments: number
  }
}>()

const summaryItems = computed(() => [
  { label: 'Total Account', value: props.stats.totalAccounts.toString(), color: 'text-gray-900' },
  { label: 'Appointment Pending', value: (props.stats.pendingAppointments || 0).toString(), color: 'text-gray-900' },
  { label: 'Pembayaran Jatuh Tempo', value: props.stats.overduePayments.toString(), color: 'text-red-500' },
  { label: 'Transaksi Tertunda', value: props.stats.pendingPayments.toString(), color: 'text-yellow-500' },
])
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-4 bg-white rounded-2xl border border-gray-200 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-gray-200 shadow-sm">
    <div v-for="(stat, index) in summaryItems" :key="index" class="p-6">
      <h3 class="text-gray-500 text-sm font-medium mb-1 uppercase tracking-wider text-[10px] font-bold">{{ stat.label }}</h3>
      <p class="text-3xl font-bold font-poppins" :class="stat.color">{{ stat.value }}</p>
    </div>
  </div>
</template>

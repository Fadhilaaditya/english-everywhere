<script setup lang="ts">
const stats = [
  { label: 'Total Account', value: '120', color: 'text-gray-900' },
  { label: 'Total Transaksi', value: '11', color: 'text-gray-900' },
  { label: 'Pembayaran Jatuh Tempo', value: '2', color: 'text-red-500' },
  { label: 'Transaksi Tertunda', value: '9', color: 'text-yellow-500' },
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-4 bg-white rounded-2xl border border-gray-200 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-gray-200 shadow-sm">
    <div v-for="(stat, index) in stats" :key="index" class="p-6">
      <h3 class="text-gray-500 text-sm font-medium mb-1">{{ stat.label }}</h3>
      <p class="text-3xl font-bold" :class="stat.color">{{ stat.value }}</p>
    </div>
  </div>
</template>

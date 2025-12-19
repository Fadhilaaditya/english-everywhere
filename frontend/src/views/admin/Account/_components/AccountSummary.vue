<script setup lang="ts">
const stats = [
  { label: 'Total Account', value: '120' },
  { label: 'Total Student', value: '100' },
  { label: 'Total Teacher', value: '20' },
]
</script>

<template>
  <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden flex divide-x divide-gray-200 w-fit shadow-sm">
    <div v-for="(stat, index) in stats" :key="index" class="p-6 w-64">
      <h3 class="text-gray-500 text-sm font-medium mb-2">{{ stat.label }}</h3>
      <p class="text-3xl font-bold text-gray-900">{{ stat.value }}</p>
    </div>
  </div>
</template>

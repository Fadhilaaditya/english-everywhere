<script setup lang="ts">
const transactions = [
  { name: 'Eka Supriyanto', plan: 'Business English Intermediate', amount: 'Rp 450.000' },
  { name: 'Lil Jamal', plan: 'Business English Intermediate', amount: 'Rp 750.000' },
]
</script>

<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-6 h-full shadow-sm">
    <h3 class="text-lg font-bold text-gray-900 mb-6">Last Transaction</h3>
    
    <div class="divide-y divide-gray-100">
      <div v-for="(trx, index) in transactions" :key="index" class="py-4 first:pt-0 last:pb-0">
        <div class="flex justify-between items-start mb-1">
          <h4 class="font-bold text-gray-900">{{ trx.name }}</h4>
          <span class="font-bold text-gray-900">{{ trx.amount }}</span>
        </div>
        <p class="text-sm text-gray-500 line-through">{{ trx.plan }}</p>
      </div>
    </div>
  </div>
</template>

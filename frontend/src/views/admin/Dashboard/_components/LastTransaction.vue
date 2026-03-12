<script setup lang="ts">
const props = defineProps<{
    transactions: any[]
}>()
</script>

<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-6 h-full shadow-sm">
    <h3 class="text-lg font-bold text-gray-900 mb-6 font-poppins">Last Transaction</h3>
    
    <div class="overflow-y-auto pr-2 custom-scrollbar" style="max-height: 350px;">
      <div class="divide-y divide-gray-100">
        <div v-for="(trx, index) in transactions" :key="index" class="py-4 first:pt-0 last:pb-0">
          <div class="flex justify-between items-start mb-1 gap-4">
            <h4 class="font-bold text-gray-900 text-sm">{{ trx.name }}</h4>
            <span class="font-bold text-[#4FD1C5] text-sm whitespace-nowrap">{{ trx.amount }}</span>
          </div>
          <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{{ trx.plan }}</p>
        </div>

        <div v-if="transactions.length === 0" class="py-8 text-center text-sm text-gray-400 italic font-medium">
            No recent successful transactions
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E2E8F0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #CBD5E0;
}
</style>

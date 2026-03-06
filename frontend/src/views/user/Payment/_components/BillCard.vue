<script setup lang="ts">
import { Clock, AlertCircle } from 'lucide-vue-next'

defineProps<{
    bill: {
        id: number
        title: string
        status: string // 'Late' | 'Due' | 'Pending'
        statusLabel: string // 'Telat 1 Bulan'
        dueDate: string
        denda: string
        potongan: string
        amount: string
    }
}>()

defineEmits(['pay', 'approve'])
</script>

<template>
  <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <!-- Header -->
    <div class="flex justify-between items-start mb-6">
        <div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">{{ bill.title }}</h3>
            <span 
                class="px-3 py-1 rounded-full text-xs font-bold text-white inline-flex items-center gap-1"
                :class="[
                    bill.status === 'Late' ? 'bg-[#f54d42]' : '',
                    bill.status === 'Due' ? 'bg-yellow-400' : '',
                    bill.status === 'Pending' ? 'bg-orange-400' : ''
                ]"
            >
                {{ bill.statusLabel }}
            </span>
        </div>
        <span class="text-xs font-medium text-gray-400">No Invoice: EE/{{ bill.id }}/{{ new Date().getFullYear() }}</span>
    </div>

    <!-- Details Grid -->
    <div class="grid grid-cols-4 gap-4 mb-6 text-sm">
        <div>
            <span class="block text-gray-400 text-xs mb-1">Jatuh Tempo</span>
            <span class="font-bold text-gray-800">{{ bill.dueDate }}</span>
        </div>
        <div>
            <span class="block text-gray-400 text-xs mb-1">Tagihan</span>
            <span class="font-bold text-gray-900">{{ bill.amount }}</span>
        </div>
    </div>

    <!-- Divider -->
    <div class="border-t border-gray-50 pt-4 flex justify-end gap-2">
        <button 
            v-if="bill.status === 'Pending'"
            @click="$emit('approve', bill)"
            class="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors text-xs"
        >
            Simulasi Admin: Approve
        </button>

        <button 
            :disabled="bill.status === 'Pending'"
            @click="$emit('pay', bill)"
            class="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {{ bill.status === 'Pending' ? 'Menunggu Verifikasi' : 'Bayar Sekarang' }}
        </button>
    </div>
  </div>
</template>

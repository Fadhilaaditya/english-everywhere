<script setup lang="ts">
import { ref } from 'vue'
import { Pencil, Trash2, Plus } from 'lucide-vue-next'
import CreatePaymentModal from './CreatePaymentModal.vue'

const isModalOpen = ref(false)

const handleSuccess = (message: string) => {
    isModalOpen.value = false
    // In a real app, we would re-fetch the payment list here
    alert(message)
}

const payments = ref([
  {
    id: '001/XIV',
    name: 'Siti Aminah',
    material: 'Business English Intermediate',
    deadline: '29/09/2025',
    amount: '9.999.999',
    status: 'Pending'
  },
  {
    id: '001/XIV',
    name: 'Tono Susanto',
    material: 'Business English Intermediate',
    deadline: '29/09/2025',
    amount: '800.000',
    status: 'Success'
  }
])

const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'success':
      return 'bg-[#70ffd4] text-white'
    case 'pending':
      return 'bg-[#ffda70] text-white'
    default:
      return 'bg-gray-100 text-gray-500'
  }
}
</script>

<template>
  <div class="bg-white rounded-3xl p-6 border border-gray-50 shadow-sm">
    <div class="flex justify-between items-center mb-8">
        <h2 class="text-xl font-bold text-gray-900">List Payments</h2>
        <button 
            @click="isModalOpen = true"
            class="bg-[#4FD1C5] hover:bg-[#3dbdb0] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-[#4FD1C5]/20 font-medium active:scale-95"
        >
            Create Bill
            <Plus class="w-5 h-5" />
        </button>
    </div>

    <div class="overflow-x-auto">
        <table class="w-full text-left">
            <thead>
                <tr class="bg-gray-50/50 text-gray-700">
                    <th class="py-5 px-6 font-semibold text-sm">Transaction ID</th>
                    <th class="py-5 px-6 font-semibold text-sm">Name User</th>
                    <th class="py-5 px-6 font-semibold text-sm">Material</th>
                    <th class="py-5 px-6 font-semibold text-sm text-center">Deadline</th>
                    <th class="py-5 px-6 font-semibold text-sm text-center">Amount</th>
                    <th class="py-5 px-6 font-semibold text-sm text-center">Status</th>
                    <th class="py-5 px-6 font-semibold text-sm text-center">Action</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
                <tr 
                    v-for="payment in payments" 
                    :key="payment.id + payment.name"
                    class="hover:bg-gray-50/30 transition-colors"
                >
                    <td class="py-6 px-6 text-gray-900 font-medium text-sm">{{ payment.id }}</td>
                    <td class="py-6 px-6 text-gray-900 font-medium text-sm">{{ payment.name }}</td>
                    <td class="py-6 px-6 text-gray-900 font-medium text-sm">{{ payment.material }}</td>
                    <td class="py-6 px-6 text-gray-900 font-medium text-sm text-center">{{ payment.deadline }}</td>
                    <td class="py-6 px-6 text-gray-900 font-bold text-sm text-center">{{ payment.amount }}</td>
                    <td class="py-6 px-6 text-center">
                        <span 
                            class="px-5 py-1.5 rounded-full text-sm font-semibold inline-block min-w-[100px]"
                            :class="getStatusClass(payment.status)"
                        >
                            {{ payment.status }}
                        </span>
                    </td>
                    <td class="py-6 px-6">
                        <div class="flex items-center justify-center gap-3">
                             <button 
                                class="p-2 rounded-xl text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all active:scale-95"
                            >
                                <Pencil class="w-5 h-5" />
                            </button>
                            <button 
                                class="p-2 rounded-xl text-red-400 border border-red-100 hover:bg-red-50 transition-all active:scale-95"
                            >
                                <Trash2 class="w-5 h-5" />
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Modals -->
    <CreatePaymentModal 
        :is-open="isModalOpen"
        @close="isModalOpen = false"
        @success="handleSuccess"
    />
  </div>
</template>

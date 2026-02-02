<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Pencil, Trash2, Plus, ChevronDown, ChevronUp, FileText, CheckCircle } from 'lucide-vue-next'
import CreateBillModal from './CreateBillModal.vue'

const isCreateModalOpen = ref(false)

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

const expandedRows = ref<Set<string>>(new Set())

const toggleRow = (id: string) => {
    if (expandedRows.value.has(id)) {
        expandedRows.value.delete(id)
    } else {
        expandedRows.value.add(id)
    }
}

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

// Mock details data (now reactive to support status updates)
const mockInstallments = reactive([
    { id: 1, date: 'Apr 1, 2020', label: '1st Payment', amount: 'Rp 200.000', status: 'PAID', statusColor: 'text-green-500' },
    { id: 2, date: 'May 1, 2020', label: '2nd Payment', amount: 'Rp 300.000', status: 'PAID', statusColor: 'text-green-500' },
    { id: 3, date: 'Jun 1, 2020', label: '3rd Payment', amount: 'Rp 500.000', status: 'DRAFT', statusColor: 'text-orange-500' },
])

const approvePayment = (id: number) => {
    const installment = mockInstallments.find(item => item.id === id)
    if (installment) {
        installment.status = 'PAID'
        installment.statusColor = 'text-green-500'
    }
}

const handleCreateBill = (data: any) => {
    console.log('Bill Created:', data)
    // Here you would send data to backend
}
</script>

<template>
  <div class="bg-white rounded-3xl p-6 border border-gray-50 shadow-sm">
    <div class="flex justify-between items-center mb-8">
        <h2 class="text-xl font-bold text-gray-900">List Payments</h2>
        <button 
            @click="isCreateModalOpen = true"
            class="bg-[#4FD1C5] hover:bg-[#3dbdb0] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-[#4FD1C5]/20 font-medium"
        >
            Create Bill
            <Plus class="w-5 h-5" />
        </button>
    </div>

    <!-- Modal -->
    <CreateBillModal 
        :is-open="isCreateModalOpen"
        @close="isCreateModalOpen = false"
        @submit="handleCreateBill"
    />

    <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse border-spacing-0">
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
                <template v-for="payment in payments" :key="payment.id + payment.name">
                    <tr 
                        class="hover:bg-gray-50/30 transition-colors"
                        :class="{'bg-gray-50': expandedRows.has(payment.id + payment.name)}"
                    >
                        <td class="py-6 px-6 text-gray-900 font-medium text-sm border-b-0">{{ payment.id }}</td>
                        <td class="py-6 px-6 text-gray-900 font-medium text-sm border-b-0">{{ payment.name }}</td>
                        <td class="py-6 px-6 text-gray-900 font-medium text-sm border-b-0">{{ payment.material }}</td>
                        <td class="py-6 px-6 text-gray-900 font-medium text-sm text-center border-b-0">{{ payment.deadline }}</td>
                        <td class="py-6 px-6 text-gray-900 font-bold text-sm text-center border-b-0">{{ payment.amount }}</td>
                        <td class="py-6 px-6 text-center border-b-0">
                            <span 
                                class="px-5 py-1.5 rounded-full text-sm font-semibold inline-block min-w-[100px]"
                                :class="getStatusClass(payment.status)"
                            >
                                {{ payment.status }}
                            </span>
                        </td>
                        <td class="py-6 px-6 border-b-0">
                            <div class="flex items-center justify-center gap-3">
                                <button 
                                    class="p-2 rounded-xl text-red-400 border border-red-100 hover:bg-red-50 transition-all active:scale-95"
                                >
                                    <Trash2 class="w-5 h-5" />
                                </button>
                                <button 
                                    @click="toggleRow(payment.id + payment.name)"
                                    class="p-2 rounded-xl text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all active:scale-95"
                                    :class="{'bg-gray-100': expandedRows.has(payment.id + payment.name)}"
                                >
                                    <ChevronUp v-if="expandedRows.has(payment.id + payment.name)" class="w-5 h-5" />
                                    <ChevronDown v-else class="w-5 h-5" />
                                </button>
                            </div>
                        </td>
                    </tr>
                    <!-- Detail Row -->
                    <tr v-if="expandedRows.has(payment.id + payment.name)">
                        <td colspan="7" class="p-0 border-t-0">
                            <div class="bg-gray-50 px-8 pb-8 pt-2 border-b border-gray-100">
                                <div class="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                                    <!-- Headers -->
                                    <div class="flex items-center border-b border-gray-100 pb-4 mb-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
                                        <div class="w-1/5">Tempo</div>
                                        <div class="w-1/5">Termin</div>
                                        <div class="w-1/5 text-center">Jumlah Cicilan</div>
                                        <div class="w-1/5 text-center">Status</div>
                                        <div class="w-1/5 text-right">Action</div>
                                    </div>
                                    
                                    <div class="space-y-4">
                                        <div v-for="item in mockInstallments" :key="item.id" class="flex items-center border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                                            <div class="w-1/5 text-sm text-gray-900 font-medium">{{ item.date }}</div>
                                            <div class="w-1/5 text-sm text-gray-500">{{ item.label }}</div>
                                            <div class="w-1/5 text-center text-sm font-bold text-gray-900">{{ item.amount }}</div>
                                            <div class="w-1/5 text-center">
                                                <span class="text-xs font-bold uppercase" :class="item.statusColor">{{ item.status }}</span>
                                            </div>
                                            <div class="w-1/5 flex justify-end">
                                                <button 
                                                    v-if="item.status === 'DRAFT'"
                                                    @click="approvePayment(item.id)"
                                                    class="text-sm text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition-colors shadow-sm shadow-blue-200"
                                                >
                                                    Approve
                                                </button>
                                                <span v-else class="text-sm text-green-600 font-medium flex items-center gap-1">
                                                    <CheckCircle class="w-4 h-4" />
                                                    Approved
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
  </div>
</template>

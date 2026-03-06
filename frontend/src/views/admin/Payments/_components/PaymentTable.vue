<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { Pencil, Trash2, Plus, ChevronDown, ChevronUp, FileText, CheckCircle, Search, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import CreateBillModal from './CreateBillModal.vue'

const isCreateModalOpen = ref(false)

const payments = ref([
  { id: '001/XIV', name: 'Siti Aminah', material: 'Business English Intermediate', deadline: '29/09/2025', amount: '9.999.999', status: 'Pending' },
  { id: '002/XIV', name: 'Tono Susanto', material: 'Business English Intermediate', deadline: '29/09/2025', amount: '800.000', status: 'Success' },
  { id: '003/XIV', name: 'Budi Santoso', material: 'TOEFL Preparation', deadline: '15/10/2025', amount: '1.200.000', status: 'Pending' },
  { id: '004/XIV', name: 'Rina Wati', material: 'General English', deadline: '20/10/2025', amount: '1.500.000', status: 'Success' },
  { id: '005/XIV', name: 'Joko Susilio', material: 'Business English', deadline: '25/10/2025', amount: '900.000', status: 'Pending' },
  { id: '006/XIV', name: 'Ani Lestari', material: 'IELTS Preparation', deadline: '01/11/2025', amount: '2.000.000', status: 'Success' },
  { id: '007/XIV', name: 'Agus Setiawan', material: 'Conversation Class', deadline: '10/11/2025', amount: '750.000', status: 'Pending' },
  { id: '008/XIV', name: 'Dewi Saputri', material: 'Grammar Focus', deadline: '15/11/2025', amount: '500.000', status: 'Success' },
  { id: '009/XIV', name: 'Eko Prasetyo', material: 'Writing Lab', deadline: '20/11/2025', amount: '1.100.000', status: 'Pending' },
  { id: '010/XIV', name: 'Lia Herlina', material: 'Public Speaking', deadline: '25/11/2025', amount: '1.800.000', status: 'Success' },
  { id: '011/XIV', name: 'Hadi Wijaya', material: 'Academic English', deadline: '01/12/2025', amount: '2.500.000', status: 'Pending' },
  { id: '012/XIV', name: 'Sari Indah', material: 'Vocabulary Builder', deadline: '05/12/2025', amount: '600.000', status: 'Success' },
])

const expandedRows = ref<Set<string>>(new Set())

const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

const filteredPayments = computed(() => {
    let result = payments.value
    if (searchQuery.value) {
        result = result.filter(p => 
            p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            p.id.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
    }
    return result
})

const totalPages = computed(() => Math.ceil(filteredPayments.value.length / itemsPerPage))

const paginatedPayments = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredPayments.value.slice(start, end)
})

watch(searchQuery, () => {
    currentPage.value = 1
})

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
  <div class="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 border border-gray-50 shadow-sm">
    <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 md:mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center gap-4">
            <h2 class="text-lg md:text-xl font-bold text-gray-900">List Payments</h2>
            <!-- Search Input -->
            <div class="relative w-full sm:w-64">
                <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    v-model="searchQuery"
                    type="text" 
                    placeholder="Search name or ID..."
                    class="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-[#4FD1C5] focus:ring-4 focus:ring-[#4FD1C5]/10 rounded-xl outline-none text-sm transition-all font-medium"
                >
            </div>
        </div>
        <button 
            @click="isCreateModalOpen = true"
            class="w-full md:w-auto bg-[#4FD1C5] hover:bg-[#3dbdb0] text-white px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#4FD1C5]/20 font-medium"
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

    <div class="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
        <table class="w-full text-left border-collapse border-spacing-0 min-w-[800px] md:min-w-0">
            <thead>
                <tr class="bg-gray-50/50 text-gray-700">
                    <th class="py-4 md:py-5 px-4 md:px-6 font-semibold text-xs md:text-sm">Transaction ID</th>
                    <th class="py-4 md:py-5 px-4 md:px-6 font-semibold text-xs md:text-sm">User Name</th>
                    <th class="py-4 md:py-5 px-4 md:px-6 font-semibold text-xs md:text-sm">Material</th>
                    <th class="py-4 md:py-5 px-4 md:px-6 font-semibold text-xs md:text-sm text-center">Deadline</th>
                    <th class="py-4 md:py-5 px-4 md:px-6 font-semibold text-xs md:text-sm text-center">Amount</th>
                    <th class="py-4 md:py-5 px-4 md:px-6 font-semibold text-xs md:text-sm text-center">Status</th>
                    <th class="py-4 md:py-5 px-4 md:px-6 font-semibold text-xs md:text-sm text-center">Action</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
                <template v-for="payment in paginatedPayments" :key="payment.id + payment.name">
                    <tr 
                        class="hover:bg-gray-50/30 transition-colors"
                        :class="{'bg-gray-50': expandedRows.has(payment.id + payment.name)}"
                    >
                        <td class="py-4 md:py-6 px-4 md:px-6 text-gray-900 font-medium text-xs md:text-sm border-b-0">{{ payment.id }}</td>
                        <td class="py-4 md:py-6 px-4 md:px-6 text-gray-900 font-medium text-xs md:text-sm border-b-0">{{ payment.name }}</td>
                        <td class="py-4 md:py-6 px-4 md:px-6 text-gray-900 font-medium text-xs md:text-sm border-b-0">{{ payment.material }}</td>
                        <td class="py-4 md:py-6 px-4 md:px-6 text-gray-900 font-medium text-xs md:text-sm text-center border-b-0">{{ payment.deadline }}</td>
                        <td class="py-4 md:py-6 px-4 md:px-6 text-gray-900 font-bold text-xs md:text-sm text-center border-b-0">{{ payment.amount }}</td>
                        <td class="py-4 md:py-6 px-4 md:px-6 text-center border-b-0">
                            <span 
                                class="px-3 md:px-5 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-semibold inline-block min-w-[80px] md:min-w-[100px]"
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

    <!-- Pagination -->
    <div class="flex flex-col sm:flex-row items-center justify-between mt-6 md:mt-8 border-t border-gray-50 pt-6 gap-4">
        <div class="text-xs md:text-sm text-gray-500 order-2 sm:order-1">
            Showing <span class="font-bold text-gray-900">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to 
            <span class="font-bold text-gray-900">{{ Math.min(currentPage * itemsPerPage, filteredPayments.length) }}</span> of 
            <span class="font-bold text-gray-900">{{ filteredPayments.length }}</span> results
        </div>
        <div class="flex items-center gap-2 order-1 sm:order-2">
            <button 
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="p-2 rounded-xl border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                <ChevronLeft class="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <div class="flex items-center gap-1">
                <button 
                    v-for="page in totalPages" 
                    :key="page"
                    @click="currentPage = page"
                    class="w-8 h-8 md:w-10 md:h-10 rounded-xl text-xs md:text-sm font-bold transition-all"
                    :class="currentPage === page ? 'bg-[#4FD1C5] text-white shadow-lg shadow-[#4FD1C5]/20' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'"
                >
                    {{ page }}
                </button>
            </div>
            <button 
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="p-2 rounded-xl border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                <ChevronRight class="w-4 h-4 md:w-5 md:h-5" />
            </button>
        </div>
    </div>
  </div>
</template>
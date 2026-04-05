<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { Pencil, Trash2, Plus, ChevronDown, ChevronUp, FileText, CheckCircle, Search, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import CreateBillModal from './CreateBillModal.vue'
import PaymentService from '@/services/PaymentService'

const emit = defineEmits(['update-stats'])

const isModalOpen = ref(false)

const handleSuccess = (message: string) => {
    isModalOpen.value = false
    // In a real app, we would re-fetch the payment list here
    alert(message)
}

// Real Payments Data from backend
const payments = ref<any[]>([])
const loading = ref(true)

const fetchPayments = async () => {
    loading.value = true
    try {
        const result = await PaymentService.getAllPayments();
        const rawData = result.data;
        payments.value = buildTableData(rawData);
        calculateStats(rawData);
    } catch (error) {
        console.error("Failed to load payments", error)
    } finally {
        loading.value = false
    }
}

const calculateStats = (rawPayments: any[]) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    let totalTransactions = rawPayments.length
    let transactionsToday = 0
    let jatuhTempoCount = 0
    let tertundaCount = 0

    rawPayments.forEach(p => {
        const createdAt = new Date(p.createdAt)
        createdAt.setHours(0, 0, 0, 0)
        if (createdAt.getTime() === today.getTime()) {
            transactionsToday++
        }

        if (p.status?.toLowerCase() === 'pending') {
            const deadlineDate = new Date(p.deadline)
            deadlineDate.setHours(0, 0, 0, 0)
            
            let isOverdue = deadlineDate < today

            // Check installments for overdue items
            if (!isOverdue && p.installments && p.installments.length > 0) {
                isOverdue = p.installments.some((inst: any) => {
                    if (inst.status?.toLowerCase() === 'pending') {
                        const instDueDate = new Date(inst.dueDate)
                        instDueDate.setHours(0, 0, 0, 0)
                        return instDueDate < today
                    }
                    return false
                })
            }

            if (isOverdue) {
                jatuhTempoCount++
            } else {
                tertundaCount++
            }
        }
    })

    emit('update-stats', {
        totalTransactions,
        transactionsToday,
        jatuhTempoCount,
        tertundaCount
    })
}

onMounted(() => {
    fetchPayments()
})

const buildTableData = (rawPayments: any[]) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return rawPayments.map(p => {
        let displayStatus = p.status
        if (p.status?.toLowerCase() === 'pending') {
            const deadlineDate = new Date(p.deadline)
            deadlineDate.setHours(0, 0, 0, 0)

            let isOverdue = deadlineDate < today

            // Check installments for overdue items
            if (!isOverdue && p.installments && p.installments.length > 0) {
                isOverdue = p.installments.some((inst: any) => {
                    if (inst.status?.toLowerCase() === 'pending') {
                        const instDueDate = new Date(inst.dueDate)
                        instDueDate.setHours(0, 0, 0, 0)
                        return instDueDate < today
                    }
                    return false
                })
            }

            if (isOverdue) {
                displayStatus = 'Overdue'
            } else {
                displayStatus = 'Pending'
            }
        }

        return {
            id: p.transactionId,
            _rawId: p.id,
            name: p.student?.name || '-',
            material: p.program?.title || '-',
            deadline: p.deadline,
            publishDate: p.publishDate,
            amount: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(p.amount),
            status: displayStatus,
            paymentType: p.paymentType,
            installments: (p.installments || []).map((inst: any) => {
                let instStatus = inst.status
                if (instStatus?.toLowerCase() === 'pending') {
                    const instDueDate = new Date(inst.dueDate)
                    instDueDate.setHours(0, 0, 0, 0)
                    if (instDueDate < today) {
                        instStatus = 'Overdue'
                    }
                }
                return {
                    ...inst,
                    status: instStatus
                }
            })
        }
    })
}

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
  switch (status?.toLowerCase()) {
    case 'success':
      return 'bg-[#4FD1C5] text-white shadow-sm shadow-[#4FD1C5]/20'
    case 'overdue':
      return 'bg-red-500 text-white shadow-sm shadow-red-100'
    case 'pending':
      return 'bg-[#F6AD55] text-white shadow-sm shadow-orange-100'
    case 'failed':
      return 'bg-red-500 text-white'
    default:
      return 'bg-gray-100 text-gray-400'
  }
}

const isApproveModalOpen = ref(false)
const pendingApproveId = ref<number | null>(null)
const pendingApproveIsInstallment = ref(false)

const openApproveConfirm = (rawId: number, isInstallment: boolean = false) => {
    pendingApproveId.value = rawId;
    pendingApproveIsInstallment.value = isInstallment;
    isApproveModalOpen.value = true;
}

const executeApprove = async () => {
    if (pendingApproveId.value === null) return;
    try {
        await PaymentService.approvePayment(pendingApproveId.value, pendingApproveIsInstallment.value);
        await fetchPayments();
    } catch (err) {
        console.error("Approval failed", err)
        alert('Failed to approve payment');
    } finally {
        isApproveModalOpen.value = false;
        pendingApproveId.value = null;
    }
}

const isDeleteModalOpen = ref(false)
const pendingDeleteId = ref<number | null>(null)

const openDeleteConfirm = (rawId: number) => {
    pendingDeleteId.value = rawId;
    isDeleteModalOpen.value = true;
}

const executeDelete = async () => {
    if (pendingDeleteId.value === null) return;
    try {
        await PaymentService.deletePayment(pendingDeleteId.value);
        await fetchPayments();
    } catch (error) {
        console.error("Failed to delete payment", error);
        alert("Failed to delete bill");
    } finally {
        isDeleteModalOpen.value = false;
        pendingDeleteId.value = null;
    }
}

const handleCreateBill = async (data: any) => {
    try {
        await PaymentService.createPayment(data);
        isCreateModalOpen.value = false;
        await fetchPayments();
    } catch (error) {
        console.error("Created bill failed", error)
        alert('Failed to create bill');
    }
}
</script>

<template>
  <div class="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 border border-gray-50 shadow-sm">
    <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 md:mb-8">
        <h2 class="text-lg md:text-xl font-bold text-gray-900">List Payments</h2>
        
        <div class="flex flex-col sm:flex-row sm:items-center gap-4 w-full md:w-auto">
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
            
            <button 
                @click="isCreateModalOpen = true"
                class="w-full md:w-auto bg-[#4FD1C5] hover:bg-[#3dbdb0] text-white px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#4FD1C5]/20 font-medium"
            >
                Create Bill
                <Plus class="w-5 h-5" />
            </button>
        </div>
    </div>

    <!-- Modal Create Bill -->
    <CreateBillModal 
        :is-open="isCreateModalOpen"
        @close="isCreateModalOpen = false"
        @submit="handleCreateBill"
    />

    <!-- Modal Approval Confirmation -->
    <div v-if="isApproveModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" @click.self="isApproveModalOpen = false">
        <div class="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl text-center transform transition-all scale-100 opacity-100">
            <h3 class="text-xl font-bold text-gray-900 mb-2">Confirm Approval</h3>
            <p class="text-gray-600 mb-8 text-sm">Are you sure you want to approve this bill?</p>
            <div class="flex justify-center gap-4">
                <button 
                    @click="isApproveModalOpen = false"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    @click="executeApprove"
                    class="w-full px-4 py-2.5 rounded-xl bg-[#4FD1C5] text-white font-bold hover:bg-[#3dbdb0] transition-colors shadow-lg shadow-[#4FD1C5]/20"
                >
                    Confirm
                </button>
            </div>
        </div>
    </div>

    <!-- Modal Delete Confirmation -->
    <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" @click.self="isDeleteModalOpen = false">
        <div class="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl text-center transform transition-all scale-100 opacity-100">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 class="h-6 w-6 text-red-600" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Delete Bill?</h3>
            <p class="text-gray-600 mb-8 text-sm">Deleted bills cannot be recovered. Are you sure?</p>
            <div class="flex justify-center gap-4">
                <button 
                    @click="isDeleteModalOpen = false"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    @click="executeDelete"
                    class="w-full px-4 py-2.5 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                >
                    Delete
                </button>
            </div>
        </div>
    </div>

    <div class="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
        <table class="w-full text-left border-collapse border-spacing-0 min-w-[800px] md:min-w-0">
            <thead>
                <tr class="bg-gray-50/50 text-gray-700">
                    <th class="py-4 md:py-5 px-4 md:px-6 font-semibold text-xs md:text-sm">Transaction ID</th>
                    <th class="py-4 md:py-5 px-4 md:px-6 font-semibold text-xs md:text-sm">Student Name</th>
                    <th class="py-4 md:py-5 px-4 md:px-6 font-semibold text-xs md:text-sm">Specific Level</th>
                    <th class="py-4 md:py-5 px-4 md:px-6 font-semibold text-xs md:text-sm text-center">Deadline</th>
                    <th class="py-4 md:py-5 px-4 md:px-6 font-semibold text-xs md:text-sm text-center">Send Date</th>
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
                        <td class="py-4 md:py-6 px-4 md:px-6 text-gray-900 font-medium text-xs md:text-sm text-center border-b-0">{{ payment.publishDate }}</td>
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
                                    @click="openDeleteConfirm(payment._rawId)"
                                    class="p-2 rounded-xl text-red-400 border border-red-100 hover:bg-red-50 transition-all active:scale-95"
                                >
                                    <Trash2 class="w-5 h-5" />
                                </button>
                                <button 
                                    v-if="payment.paymentType === 'Lunas' && (payment.status === 'Pending' || payment.status === 'Overdue')"
                                    @click="openApproveConfirm(payment._rawId, false)"
                                    class="p-2 rounded-xl text-green-500 border border-green-200 hover:bg-green-50 z-10 block"
                                    title="Approve Lunas"
                                >
                                    <CheckCircle class="w-5 h-5" />
                                </button>
                                <button 
                                    v-if="payment.installments && payment.installments.length > 0"
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
                        <td colspan="8" class="p-0 border-t-0">
                            <div class="bg-gray-50 px-8 pb-8 pt-2 border-b border-gray-100">
                                <div class="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                                    <!-- Headers -->
                                    <div class="flex items-center border-b border-gray-100 pb-4 mb-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
                                        <div class="w-1/6">Due Date</div>
                                        <div class="w-1/6">Send Date</div>
                                        <div class="w-1/6">Term</div>
                                        <div class="w-1/6 text-center">Amount</div>
                                        <div class="w-1/6 text-center">Status</div>
                                        <div class="w-1/6 text-right">Action</div>
                                    </div>
                                    
                                    <div class="space-y-4">
                                        <div v-for="item in payment.installments" :key="item.id" class="flex items-center border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                                            <div class="w-1/6 text-sm text-gray-900 font-medium">{{ item.dueDate }}</div>
                                            <div class="w-1/6 text-sm text-gray-400 italic">{{ item.publishDate }}</div>
                                            <div class="w-1/6 text-sm text-gray-500">Installment {{ item.installmentNumber }}</div>
                                            <div class="w-1/6 text-center text-sm font-bold text-gray-900">{{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.amount) }}</div>
                                            <div class="w-1/6 text-center">
                                                <span 
                                                    class="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block min-w-[80px]"
                                                    :class="getStatusClass(item.status)"
                                                >
                                                    {{ item.status }}
                                                </span>
                                            </div>
                                            <div class="w-1/6 flex justify-end">
                                                <button 
                                                    v-if="item.status === 'Pending' || item.status === 'Overdue'"
                                                    @click="openApproveConfirm(item.id, true)"
                                                    class="text-sm text-white bg-[#4FD1C5] hover:bg-[#3dbdb0] px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition-colors shadow-sm shadow-blue-200"
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

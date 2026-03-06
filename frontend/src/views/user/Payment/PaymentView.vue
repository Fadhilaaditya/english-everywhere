<script setup lang="ts">
import { ref, computed } from 'vue'
import BillCard from './_components/BillCard.vue'
import PaymentModal from './_components/PaymentModal.vue'

// Mock Data Bills (Unpaid)
const unpaidBills = ref([
    {
        id: 1,
        title: 'Nama Tagihan',
        status: 'Late',
        statusLabel: 'Telat 1 Bulan',
        dueDate: '29 September 2025',
        denda: 'Tidak Ada',
        potongan: 'Tidak Ada',
        amount: 'Rp 1.500.000',
        amountRaw: 1500000
    },
    {
        id: 2,
        title: 'Nama Tagihan',
        status: 'Late',
        statusLabel: 'Telat 1 Bulan',
        dueDate: '29 September 2025',
        denda: 'Tidak Ada',
        potongan: 'Tidak Ada',
        amount: 'Rp 1.500.000',
        amountRaw: 1500000
    },
    {
        id: 3,
        title: 'Nama Tagihan',
        status: 'Late',
        statusLabel: 'Telat 1 Bulan',
        dueDate: '29 September 2025',
        denda: 'Tidak Ada',
        potongan: 'Tidak Ada',
        amount: 'Rp 1.500.000',
        amountRaw: 1500000
    }
])

// Mock History (Paid)
const paymentHistory = ref([
    {
        id: 101,
        title: 'Business English Intermediate',
        date: 'Bukti Pembayaran',
        amount: 'Rp 450.000'
    },
    {
        id: 102,
        title: 'Business English Intermediate',
        date: 'Bukti Pembayaran',
        amount: 'Rp 450.000'
    },
    {
        id: 103,
        title: 'Business English Intermediate',
        date: 'Bukti Pembayaran',
        amount: 'Rp 450.000'
    }
])

const totalUnpaidRaw = computed(() => unpaidBills.value.reduce((acc, curr) => acc + curr.amountRaw, 0))
const totalUnpaidFormatted = computed(() => 'Rp ' + totalUnpaidRaw.value.toLocaleString('id-ID'))

// Modal Logic
const isModalOpen = ref(false)
const selectedBill = ref<any>(null)

const handlePay = (bill: any) => {
    selectedBill.value = bill
    isModalOpen.value = true
}

const handleConfirmPayment = (bill: any) => {
    const target = unpaidBills.value.find(b => b.id === bill.id)
    if (target) {
        target.status = 'Pending'
        target.statusLabel = 'Menunggu Konfirmasi Admin'
    }
}

const handleSimulateAdminApprove = (bill: any) => {
    // 1. Remove from unpaidBills
    unpaidBills.value = unpaidBills.value.filter(b => b.id !== bill.id)
    
    // 2. Add to history
    paymentHistory.value.unshift({
        id: new Date().getTime(),
        title: bill.title,
        date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
        amount: bill.amount
    })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 font-poppins">
    <div class="container mx-auto px-4 py-8">
        
        <!-- Total Banner -->
        <div class="bg-[#f54d42] rounded-3xl p-8 text-white mb-12 shadow-lg relative overflow-hidden">
            <div class="relative z-10">
                <h2 class="text-xl font-medium opacity-90 mb-2">Total Tagihan yang belum di bayar</h2>
                <div class="text-5xl font-bold">{{ totalUnpaidFormatted }}</div>
            </div>
            <!-- Decorative circle -->
            <div class="absolute -right-10 -bottom-20 w-64 h-64 bg-white opacity-10 rounded-full blur-2xl"></div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left Column: Bill List -->
            <div class="lg:col-span-2 space-y-6">
                <h2 class="text-xl font-bold text-gray-900 mb-6">Rincian Tagihan</h2>
                
                <div class="space-y-4">
                    <BillCard 
                        v-for="bill in unpaidBills" 
                        :key="bill.id" 
                        :bill="bill" 
                        @pay="handlePay"
                        @approve="handleSimulateAdminApprove"
                    />
                </div>
            </div>

            <!-- Right Column: History -->
            <div class="lg:col-span-1">
                <h2 class="text-xl font-bold text-gray-900 mb-6">History Pembayaran</h2>
                
                <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h3 class="font-bold text-sm text-gray-800 mb-4">Pembayaran Course</h3>
                    
                    <div class="space-y-6">
                        <div v-for="item in paymentHistory" :key="item.id" class="border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                            <div class="flex justify-between items-start mb-1">
                                <h4 class="text-sm font-medium text-gray-600 line-through decoration-gray-400">{{ item.title }}</h4>
                                <span class="text-sm font-bold text-gray-900 decoration-none">{{ item.amount }}</span>
                            </div>
                            <button class="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                                {{ item.date }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Payment Modal -->
    <PaymentModal 
        :is-open="isModalOpen"
        :bill="selectedBill"
        @close="isModalOpen = false"
        @confirm="handleConfirmPayment"
    />
  </div>
</template>
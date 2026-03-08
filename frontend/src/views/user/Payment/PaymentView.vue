<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import BillCard from './_components/BillCard.vue'
import PaymentModal from './_components/PaymentModal.vue'
import PaymentService from '@/services/PaymentService'

// Simulating logged-in user student ID for now (adjust as per actual auth implementation)
const currentStudentId = ref<number | null>(null);

// Get it from localStorage if available
onMounted(async () => {
    const userString = localStorage.getItem('user');
    if (userString) {
        try {
            const user = JSON.parse(userString);
            // student profile ID
            // For now hardcoding to ID 28 (Adit) based on SQL dump if not found
            // In a real app we fetch the student profile by user ID
            currentStudentId.value = user?.student?.id || user?.studentId || 28;
            await fetchBills();
        } catch(e) {
            console.error('Failed to parse user', e)
            currentStudentId.value = 28;
            await fetchBills();
        }
    } else {
        currentStudentId.value = 28;
        await fetchBills();
    }
})

// Unpaid Bills
const unpaidBills = ref<any[]>([])

// Paid History
const paymentHistory = ref<any[]>([])

const fetchBills = async () => {
    if (!currentStudentId.value) return;

    try {
        const res = await PaymentService.getUserPayments(currentStudentId.value);
        const allPayments = res.data;
        
        unpaidBills.value = [];
        paymentHistory.value = [];

        allPayments.forEach((p: any) => {
            const courseTitle = p.program?.title || `Tagihan #${p.id}`;
            const formatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' });
            
            if (p.paymentType === 'Lunas') {
                if (p.status === 'Success') {
                    paymentHistory.value.push({
                        id: p.id,
                        title: courseTitle,
                        date: new Date(p.paymentDate || p.updatedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
                        amount: formatter.format(p.amount)
                    });
                } else {
                    unpaidBills.value.push({
                        id: p.id,
                        isInstallment: false,
                        title: courseTitle,
                        status: p.status === 'Pending' ? (p.updatedAt !== p.createdAt ? 'Menunggu Konfirmasi Admin' : 'Belum Dibayar') : p.status,
                        statusLabel: p.status === 'Pending' ? (p.updatedAt !== p.createdAt ? 'Menunggu Konfirmasi' : 'Segera Bayar') : p.status,
                        dueDate: new Date(p.deadline).toLocaleDateString('id-ID'),
                        denda: 'Tidak Ada',
                        potongan: 'Tidak Ada',
                        amount: formatter.format(p.amount),
                        amountRaw: Number(p.amount)
                    });
                }
            } else if (p.paymentType === 'Cicilan' && p.installments) {
                // If the entire payment is success, all installments are success too
                p.installments.forEach((inst: any) => {
                    if (inst.status === 'Success') {
                        paymentHistory.value.push({
                            id: inst.id,
                            title: `${courseTitle} - Cicilan ${inst.installmentNumber}`,
                            date: new Date(inst.paymentDate || inst.updatedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
                            amount: formatter.format(inst.amount)
                        });
                    } else {
                         unpaidBills.value.push({
                            id: inst.id,
                            isInstallment: true,
                            title: `${courseTitle} - Cicilan ${inst.installmentNumber}`,
                            status: inst.status === 'Pending' ? (inst.updatedAt !== inst.createdAt ? 'Menunggu Konfirmasi Admin' : 'Belum Dibayar') : inst.status,
                            statusLabel: inst.status === 'Pending' ? (inst.updatedAt !== inst.createdAt ? 'Menunggu Konfirmasi' : 'Segera Bayar') : inst.status,
                            dueDate: new Date(inst.dueDate).toLocaleDateString('id-ID'),
                            denda: 'Tidak Ada',
                            potongan: 'Tidak Ada',
                            amount: formatter.format(inst.amount),
                            amountRaw: Number(inst.amount)
                        });
                    }
                });
            }
        });
        
    } catch (e) {
        console.error("Gagal mengambil tagihan", e)
    }
}

const totalUnpaidRaw = computed(() => unpaidBills.value.reduce((acc, curr) => acc + curr.amountRaw, 0))
const totalUnpaidFormatted = computed(() => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalUnpaidRaw.value))

// Modal Logic
const isModalOpen = ref(false)
const selectedBill = ref<any>(null)

const handlePay = (bill: any) => {
    selectedBill.value = bill
    isModalOpen.value = true
}

const handleConfirmPayment = async (bill: any) => {
    try {
        await PaymentService.confirmPayment(bill.id, bill.isInstallment);
        await fetchBills();
    } catch (e) {
        console.error("Konfirmasi gagal", e);
        alert('Gagal mengkonfirmasi pembayaran');
    }
}

// Keep simulate for backward compatibility testing, but the real logic uses confirm payment via modal
const handleSimulateAdminApprove = async (bill: any) => {
    try {
        await PaymentService.approvePayment(bill.id, bill.isInstallment);
        await fetchBills();
    } catch (e) {
        console.error("Approve simulasi gagal", e)
    }
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
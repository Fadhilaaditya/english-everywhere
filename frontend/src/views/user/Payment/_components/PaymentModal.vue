<script setup lang="ts">
import { ref } from 'vue'
import { X, CreditCard, Banknote, Copy, CheckCircle } from 'lucide-vue-next'

const props = defineProps<{
    isOpen: boolean
    bill: any
}>()

const emit = defineEmits(['close'])

const selectedMethod = ref<'va' | 'cash' | null>(null)

const handleClose = () => {
    selectedMethod.value = null
    emit('close')
}

// Mock VA Number
const vaNumber = '880123456789'
const copied = ref(false)

const copyVA = () => {
    navigator.clipboard.writeText(vaNumber)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
}

const ADMIN_FEE = 4000

const payWithMidtrans = async () => {
    try {
        const totalAmount = props.bill.amountRaw + ADMIN_FEE
        
        const response = await fetch('http://localhost:3001/api/payments/charge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                orderId: 'ORDER-' + new Date().getTime(),
                amount: totalAmount,
                items: [
                    {
                        id: props.bill.id,
                        price: props.bill.amountRaw,
                        quantity: 1,
                        name: props.bill.title
                    },
                    {
                        id: 'ADMIN-FEE',
                        price: ADMIN_FEE,
                        quantity: 1,
                        name: 'Biaya Layanan'
                    }
                ],
                customerDetails: {
                    first_name: "Siti",
                    last_name: "Aminah",
                    email: "siti@example.com",
                    phone: "081234567890"
                }
            })
        })
        
        const data = await response.json()
        if (data.token) {
            // @ts-ignore
            window.snap.pay(data.token, {
                onSuccess: function(result: any){
                    alert("Payment success!");
                    emit('close');
                },
                onPending: function(result: any){
                    alert("Wating your payment!");
                    emit('close'); 
                },
                onError: function(result: any){
                    alert("Payment failed!");
                },
                onClose: function(){
                    alert('You closed the popup without finishing the payment');
                }
            })
        }
    } catch (error) {
        console.error("Payment Error:", error)
        alert("Failed to initiate payment")
    }
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="handleClose">
    <div class="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl relative">
        <!-- Close Button -->
        <button @click="handleClose" class="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors">
            <X class="w-6 h-6" />
        </button>

        <!-- Header -->
        <div class="p-8 pb-0 text-center">
            <h2 class="text-xl font-bold text-gray-900 mb-2">Pilih Metode Pembayaran</h2>
        </div>

        <div class="p-6 space-y-6">
            <!-- Initial Selection -->
            <div v-if="!selectedMethod" class="space-y-4">
                <div class="bg-gray-50 p-4 rounded-xl space-y-2 mb-6">
                     <p class="text-sm text-gray-500">Rincian Pembayaran:</p>
                     <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Tagihan</span>
                        <span class="font-bold text-gray-900">{{ bill?.amount }}</span>
                     </div>
                     <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Biaya Layanan</span>
                        <span class="font-bold text-gray-900">Rp 4.000</span>
                     </div>
                     <div class="border-t border-gray-200 pt-2 flex justify-between text-base">
                        <span class="font-bold text-gray-900">Total</span>
                        <span class="font-bold text-[#f54d42]">{{ 'Rp ' + (bill?.amountRaw + 4000).toLocaleString('id-ID') }}</span>
                     </div>
                </div>

                <p class="text-sm text-gray-500 mb-2">Silahkan pilih metode pembayaran:</p>
                
                <button 
                    @click="payWithMidtrans"
                    class="w-full p-4 rounded-xl border border-gray-200 hover:border-[#4FD1C5] hover:bg-[#4FD1C5]/5 flex items-center gap-4 group transition-all"
                >
                    <div class="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <CreditCard class="w-6 h-6" />
                    </div>
                    <div class="text-left">
                        <h3 class="font-bold text-gray-900">Virtual Account / Online</h3>
                        <p class="text-xs text-gray-500">BCA, Mandiri, BNI, BRI (Midtrans)</p>
                    </div>
                </button> <!-- ... Cash button ... -->

            <button 
                @click="selectedMethod = 'cash'"
                class="w-full p-4 rounded-xl border border-gray-200 hover:border-[#4FD1C5] hover:bg-[#4FD1C5]/5 flex items-center gap-4 group transition-all"
            >
                <div class="w-12 h-12 rounded-full bg-green-50 text-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Banknote class="w-6 h-6" />
                </div>
                <div class="text-left">
                    <h3 class="font-bold text-gray-900">Cash / Tunai</h3>
                    <p class="text-xs text-gray-500">Bayar langsung di kantor</p>
                </div>
            </button>
        </div>

        <!-- Virtual Account Display (Mock) -->
        <div v-else-if="selectedMethod === 'va'" class="text-center space-y-6">
            <div class="space-y-2">
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wide">Total Pembayaran</span>
                <div class="text-3xl font-bold text-[#f54d42]">{{ bill?.amount }}</div>
            </div>

            <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-500">BCA Virtual Account</span>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg" alt="BCA" class="h-4 opacity-70">
                </div>
                <div class="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                    <span class="font-mono text-lg font-bold text-gray-900 tracking-wider">{{ vaNumber }}</span>
                    <button 
                        @click="copyVA"
                        class="text-gray-400 hover:text-[#4FD1C5] transition-colors"
                        :title="copied ? 'Copied' : 'Copy'"
                    >
                        <CheckCircle v-if="copied" class="w-5 h-5 text-green-500" />
                        <Copy v-else class="w-5 h-5" />
                    </button>
                </div>
                <p class="text-xs text-gray-400 mt-2 text-left">Pembayaran akan diverifikasi otomatis.</p>
            </div>

            <button @click="selectedMethod = null" class="text-sm text-gray-500 hover:text-gray-900 underline">
                Ganti Metode Pembayaran
            </button>
        </div>

        <!-- Cash Display -->
        <div v-else-if="selectedMethod === 'cash'" class="text-center space-y-6">
            <div class="space-y-2">
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wide">Total Pembayaran</span>
                <div class="text-3xl font-bold text-[#f54d42]">{{ bill?.amount }}</div>
            </div>

            <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Banknote class="w-8 h-8" />
            </div>
            
            <div class="space-y-2">
                <h3 class="font-bold text-gray-900">Instruksi Pembayaran Cash</h3>
                <p class="text-sm text-gray-500 leading-relaxed px-4">
                    Untuk pembayaran cash bisa langsung menghubungi admin pada nomor berikut atau mengunjungi alamat dibawah ini.
                </p>
            </div>

            <div class="bg-gray-50 rounded-xl p-4 text-left space-y-3 text-sm">
                <div class="flex justify-between">
                    <span class="text-gray-500">WhatsApp Admin:</span>
                    <span class="font-bold text-gray-900">+62 812-3456-7890</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-500">Alamat Kantor:</span>
                    <span class="font-bold text-gray-900 text-right w-1/2">Jl. Contoh No. 123, Jakarta Selatan</span>
                </div>
            </div>

             <button @click="selectedMethod = null" class="text-sm text-gray-500 hover:text-gray-900 underline">
                Ganti Metode Pembayaran
            </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X, Copy, CheckCircle } from 'lucide-vue-next'

const props = defineProps<{
    isOpen: boolean
    bill: any
}>()

const emit = defineEmits(['close', 'confirm'])

const handleClose = () => {
    emit('close')
}

// Bank Account
const accountNumber = '1640008820187'
const copied = ref(false)
const isQRZoomed = ref(false)

const copyAccount = () => {
    navigator.clipboard.writeText(accountNumber)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
}

const handleConfirm = () => {
    // Notify parent to change status to Pending
    emit('confirm', props.bill)
    // The link will open in a new tab because of target="_blank"
    handleClose()
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="handleClose">
    <div class="bg-white rounded-3xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl relative">
        <!-- Close Button -->
        <button @click="handleClose" class="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors z-[60] bg-white/80 rounded-full p-1 backdrop-blur-sm">
            <X class="w-6 h-6" />
        </button>        <!-- Scrollable content wrapper -->
        <div class="overflow-y-auto flex-1 p-0 custom-scrollbar">
            <!-- Header -->
            <div class="p-8 pb-0 text-center">
                <h2 class="text-xl font-bold text-gray-900 mb-2">Instruksi Pembayaran</h2>
            </div>

            <div class="p-6 space-y-6">
                <!-- Total Pembayaran -->
                <div class="text-center space-y-2">
                    <span class="text-xs font-bold text-gray-400 uppercase tracking-wide">Total Pembayaran</span>
                    <div class="text-3xl font-bold text-[#f54d42]">{{ bill?.amount }}</div>
                </div>

                <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p class="text-sm text-gray-600 mb-4 border-b border-gray-200 pb-3">
                        Silakan lakukan transfer ke rekening bank di bawah ini:
                    </p>
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-gray-500">Bank Mandiri</span>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg" alt="Mandiri" class="h-3 opacity-70">
                    </div>
                    <div class="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                        <div>
                            <span class="font-mono text-lg font-bold text-gray-900 tracking-wider">{{ accountNumber }}</span>
                            <div class="text-xs text-gray-500 mt-1">a.n. English Everywhere</div>
                        </div>
                        <button 
                            @click="copyAccount"
                            class="text-gray-400 hover:text-[#4FD1C5] transition-colors"
                            :title="copied ? 'Copied' : 'Copy'"
                        >
                            <CheckCircle v-if="copied" class="w-5 h-5 text-green-500" />
                            <Copy v-else class="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <!-- OR Divider -->
                <div class="flex items-center gap-3 py-2">
                    <div class="flex-1 h-px bg-gray-100"></div>
                    <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Atau via QRIS</span>
                    <div class="flex-1 h-px bg-gray-100"></div>
                </div>

                <!-- QRIS Section -->
                <div class="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center space-y-4">
                    <div class="flex items-center justify-center gap-2 mb-1">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg" alt="QRIS" class="h-5">
                    </div>
                    <div class="relative group inline-block cursor-zoom-in" @click="isQRZoomed = true">
                        <div class="absolute -inset-1 bg-gradient-to-r from-[#4FD1C5] to-[#f54d42] rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
                        <div class="relative bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                            <img 
                                src="https://res.cloudinary.com/dosfggbxu/image/upload/v1776498728/QRIS_berj0h.jpg" 
                                alt="QRIS Code" 
                                class="w-80 h-80 object-contain mx-auto transition-transform duration-500 rounded-lg"
                            >
                        </div>
                        <!-- Zoom Hint -->
                        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div class="bg-black/50 text-white text-[10px] font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                                Click to expand
                            </div>
                        </div>
                    </div>
                    <p class="text-[10px] text-gray-500 font-medium">Scan kode QR di atas menggunakan aplikasi m-banking atau e-wallet Anda.</p>
                </div>

                <div class="space-y-3">
                    <h3 class="font-bold text-gray-900 text-sm">Konfirmasi Pembayaran</h3>
                    <p class="text-sm text-gray-500 leading-relaxed">
                        Setelah melakukan transfer, harap lakukan konfirmasi melalui admin di nomor <span class="font-bold text-gray-700">+62 899-7626-888</span> atau klik tombol di bawah ini.
                    </p>
                </div>

                <a 
                    href="https://wa.me/628997626888?text=Halo%20Admin,%20saya%20sudah%20melakukan%20pembayaran" 
                    target="_blank"
                    @click="handleConfirm"
                    class="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white py-4 px-4 rounded-xl font-bold transition-colors mb-6"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 fill-current" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Konfirmasi Pembayaran via WhatsApp
                </a>
            </div>
        </div>
    </div>

    <!-- Full Screen QRIS Overlay -->
    <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
    >
        <div v-if="isQRZoomed" class="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-10" @click="isQRZoomed = false">
            <button class="absolute top-6 right-6 text-white/50 hover:text-white transition-colors" @click="isQRZoomed = false">
                <X class="w-8 h-8" />
            </button>
            <div class="relative max-w-2xl w-full aspect-square bg-white rounded-3xl p-6 md:p-12 shadow-2xl overflow-hidden" @click.stop>
                <img 
                    src="https://res.cloudinary.com/dosfggbxu/image/upload/v1776498728/QRIS_berj0h.jpg" 
                    alt="QRIS Code Full" 
                    class="w-full h-full object-contain"
                >
            </div>
            <div class="mt-8 text-center">
                <p class="text-white text-lg font-bold">English Everywhere QRIS</p>
                <p class="text-white/60 text-sm mt-1">Scan to pay now</p>
                <button @click="isQRZoomed = false" class="mt-6 px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-bold transition-all backdrop-blur-sm border border-white/20">
                    Close Preview
                </button>
            </div>
        </div>
    </transition>
  </div>
</template>
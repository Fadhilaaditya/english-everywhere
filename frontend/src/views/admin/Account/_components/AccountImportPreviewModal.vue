<script setup lang="ts">
import { X, CheckCircle2, AlertCircle } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps<{
    isOpen: boolean
    data: any[]
    isImporting: boolean
}>()

const emit = defineEmits(['close', 'confirm'])

const isValid = (user: any) => {
    return user.fullName && user.username && user.role
}

const tableHeaders = [
    { label: 'Nama Lengkap', key: 'fullName' },
    { label: 'Username', key: 'username' },
    { label: 'Role', key: 'role' },
    { label: 'Email', key: 'email' },
    { label: 'Program', key: 'course' }
]

const close = () => {
    emit('close')
}

const confirm = () => {
    emit('confirm')
}
</script>

<template>
    <div v-if="isOpen" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <!-- Header -->
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div>
                    <h3 class="text-xl font-bold text-gray-800">Preview Import Akun</h3>
                    <p class="text-sm text-gray-500 mt-0.5">Tinjau data sebelum disimpan ke database</p>
                </div>
                <button @click="close" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X class="w-5 h-5 text-gray-400" />
                </button>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-auto px-6 py-4">
                <div class="overflow-x-auto ring-1 ring-gray-100 rounded-xl">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-gray-50 border-b border-gray-100">
                                <th class="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th v-for="header in tableHeaders" :key="header.key" class="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    {{ header.label }}
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr v-for="(user, index) in data" :key="index" class="hover:bg-gray-50/50 transition-colors">
                                <td class="px-4 py-3">
                                    <CheckCircle2 v-if="isValid(user)" class="w-5 h-5 text-green-500" />
                                    <div v-else class="flex items-center gap-1.5 text-red-500">
                                        <AlertCircle class="w-5 h-5" />
                                        <span class="text-[10px] font-medium uppercase">Data Error</span>
                                    </div>
                                </td>
                                <td v-for="header in tableHeaders" :key="header.key" class="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                                    {{ user[header.key] || '-' }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                <div class="text-sm text-gray-500">
                    Total: <span class="font-bold text-gray-700">{{ data.length }}</span> data ditemukan
                </div>
                <div class="flex gap-3">
                    <button 
                        @click="close"
                        class="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        Batal
                    </button>
                    <button 
                        @click="confirm"
                        :disabled="isImporting"
                        class="bg-[#4FD1C5] hover:bg-[#3dbdb0] text-white px-6 py-2 rounded-lg font-bold transition-all shadow-lg shadow-[#4FD1C5]/20 disabled:opacity-50"
                    >
                        {{ isImporting ? 'Memproses...' : 'Konfirmasi Import' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.animate-in {
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>

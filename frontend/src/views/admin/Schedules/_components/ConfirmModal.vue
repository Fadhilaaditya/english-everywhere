<script setup lang="ts">
import { AlertTriangle, X } from 'lucide-vue-next'

defineProps<{
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
  isLoading?: boolean
}>()

const emit = defineEmits(['close', 'confirm'])
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[120] flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/50" @click="emit('close')"></div>

    <!-- Modal Content -->
    <div class="relative bg-white rounded-xl w-full max-w-sm shadow-xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
        <div class="p-6">
            <div class="flex items-center gap-4 mb-4">
                <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0" v-if="type === 'danger'">
                    <AlertTriangle class="w-5 h-5 text-red-600" />
                </div>
                <div class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0" v-else-if="type === 'warning'">
                    <AlertTriangle class="w-5 h-5 text-amber-600" />
                </div>
                 <div class="w-10 h-10 rounded-full bg-[#4FD1C5] flex items-center justify-center flex-shrink-0" v-else>
                    <AlertTriangle class="w-5 h-5 text-white" />
                </div>

                <div>
                    <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
                </div>
            </div>
            
            <p class="text-gray-600 mb-6 ml-14 text-sm">{{ message }}</p>

            <div class="flex justify-end gap-3">
                <button 
                    @click="emit('close')"
                    class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors text-sm"
                    :disabled="isLoading"
                >
                    {{ cancelText || 'Cancel' }}
                </button>
                <button 
                    @click="emit('confirm')"
                    class="px-4 py-2 text-white rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
                    :class="[
                        type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 
                        type === 'warning' ? 'bg-amber-500 hover:bg-amber-600' : 
                        'bg-[#4FD1C5] hover:bg-[#3dbdb0]',
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    ]"
                    :disabled="isLoading"
                >
                    <span v-if="isLoading">Processing...</span>
                    <span>{{ confirmText || 'Confirm' }}</span>
                </button>
            </div>
        </div>
    </div>
  </div>
</template>

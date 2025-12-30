<script setup lang="ts">
import { X, AlertTriangle } from 'lucide-vue-next'

defineProps<{
  isOpen: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}>()

defineEmits(['close', 'confirm'])
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/50 transition-opacity" @click="$emit('close')"></div>

    <!-- Modal Content -->
    <div class="relative bg-white rounded-2xl w-full max-w-md shadow-xl p-6 transform transition-all scale-100 opacity-100">
        <!-- Close Button -->
        <button 
            @click="$emit('close')"
            class="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
            <X class="w-5 h-5" />
        </button>

        <div class="text-center">
            <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle class="w-8 h-8 text-red-500" />
            </div>
            
            <h3 class="text-xl font-bold text-gray-900 mb-2">{{ title || 'Are you sure?' }}</h3>
            <p class="text-gray-500 mb-8">{{ message || 'This action cannot be undone.' }}</p>

            <div class="grid grid-cols-2 gap-4">
                <button 
                    @click="$emit('close')"
                    class="w-full py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                    {{ cancelText || 'Cancel' }}
                </button>
                <button 
                    @click="$emit('confirm')"
                    class="w-full py-2.5 rounded-lg bg-[#FF6B6B] text-white font-medium hover:bg-[#ff5252] transition-colors shadow-lg shadow-[#FF6B6B]/20"
                >
                    {{ confirmText || 'Confirm' }}
                </button>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X, AlertTriangle, CheckCircle, Info, HelpCircle } from 'lucide-vue-next'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  isOpen: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info' | 'primary'
}>(), {
    type: 'danger'
})

defineEmits(['close', 'confirm'])

const styles = computed(() => {
    switch (props.type) {
        case 'primary':
            return {
                iconBg: 'bg-teal-50',
                iconColor: 'text-teal-500',
                btnBg: 'bg-[#4FD1C5]',
                btnHover: 'hover:bg-[#3dbdb0]',
                btnShadow: 'shadow-[#4FD1C5]/20',
                icon: CheckCircle
            }
        case 'warning':
            return {
                iconBg: 'bg-amber-50',
                iconColor: 'text-amber-500',
                btnBg: 'bg-amber-500',
                btnHover: 'hover:bg-amber-600',
                btnShadow: 'shadow-amber-500/20',
                icon: AlertTriangle
            }
        case 'info':
            return {
                iconBg: 'bg-blue-50',
                iconColor: 'text-blue-500',
                btnBg: 'bg-blue-500',
                btnHover: 'hover:bg-blue-600',
                btnShadow: 'shadow-blue-500/20',
                icon: Info
            }
        case 'danger':
        default:
            return {
                iconBg: 'bg-red-50',
                iconColor: 'text-red-500',
                btnBg: 'bg-[#FF6B6B]',
                btnHover: 'hover:bg-[#ff5252]',
                btnShadow: 'shadow-[#FF6B6B]/20',
                icon: AlertTriangle
            }
    }
})
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
            <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" :class="styles.iconBg">
                <component :is="styles.icon" class="w-8 h-8" :class="styles.iconColor" />
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
                    class="w-full py-2.5 rounded-lg text-white font-medium transition-colors shadow-lg"
                    :class="[styles.btnBg, styles.btnHover, styles.btnShadow]"
                >
                    {{ confirmText || 'Confirm' }}
                </button>
            </div>
        </div>
    </div>
  </div>
</template>

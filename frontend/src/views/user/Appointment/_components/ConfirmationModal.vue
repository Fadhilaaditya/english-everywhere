<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/50" @click="$emit('cancel')"></div>

    <!-- Modal Content -->
    <div class="relative bg-white rounded-xl shadow-xl w-full max-w-md p-8 text-center animate-fade-in">
        <!-- Icon -->
        <div class="mx-auto w-16 h-16 bg-[#52D3C4] rounded-full flex items-center justify-center mb-6">
            <AlertTriangle class="w-8 h-8 text-white" />
        </div>

        <h3 class="text-2xl font-bold text-gray-900 mb-2">Confirm Appointment Details</h3>
        <p class="text-gray-600 mb-8">Are the details for this appointment correct?</p>

        <div class="flex gap-4">
            <button 
                @click="$emit('cancel')"
                class="flex-1 py-3 px-4 border border-[#FF6B6B] text-[#FF6B6B] font-medium rounded-lg hover:bg-red-50 transition-colors"
            >
                Cancel
            </button>
            <button 
                @click="$emit('confirm')"
                class="flex-1 py-3 px-4 bg-[#52D3C4] text-white font-medium rounded-lg hover:bg-[#52D3C4]/90 transition-colors"
            >
                Confirm
            </button>
        </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

<script setup lang="ts">
import { CalendarSearch, X } from 'lucide-vue-next'

defineProps<{
  isOpen: boolean
  title: string
  message: string
}>()

defineEmits(['close'])
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/40" @click="$emit('close')"></div>

    <!-- Modal Content -->
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center animate-pop-in">
        <!-- Close Button -->
        <button 
            @click="$emit('close')" 
            class="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
            <X class="w-5 h-5 text-gray-400" />
        </button>

        <!-- Icon -->
        <div class="mx-auto w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-6">
            <CalendarSearch class="w-10 h-10 text-[#4FD1C5]" />
        </div>

        <h3 class="text-xl font-bold text-gray-900 mb-3">{{ title }}</h3>
        <p class="text-gray-500 leading-relaxed mb-8">
            {{ message }}
        </p>

        <button 
            @click="$emit('close')"
            class="w-full py-4 bg-[#4FD1C5] text-white font-bold rounded-xl hover:bg-[#3dbdb0] transition-all shadow-lg shadow-[#4FD1C5]/30 active:scale-95"
        >
            Got it, thanks!
        </button>
    </div>
  </div>
</template>

<style scoped>
.animate-pop-in {
  animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>

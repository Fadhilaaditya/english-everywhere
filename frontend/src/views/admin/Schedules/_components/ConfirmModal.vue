<script setup lang="ts">
import { AlertTriangle, Info, AlertCircle, Loader2 } from 'lucide-vue-next'

// Definisi Props
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
  <div v-if="isOpen" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="emit('close')"></div>

    <div
      class="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl transition-all scale-in"
    >
      <div class="flex flex-col items-center text-center">
        <div
          class="p-4 rounded-3xl mb-6"
          :class="{
            'bg-red-50 text-red-500': type === 'danger',
            'bg-amber-50 text-amber-500': type === 'warning',
            'bg-blue-50 text-blue-500': type === 'info',
          }"
        >
          <AlertTriangle v-if="type === 'danger'" class="w-10 h-10" />
          <AlertCircle v-else-if="type === 'warning'" class="w-10 h-10" />
          <Info v-else class="w-10 h-10" />
        </div>

        <h3 class="text-xl font-black text-gray-800 mb-2">{{ title }}</h3>
        <p class="text-sm text-gray-500 font-medium leading-relaxed mb-8">
          {{ message }}
        </p>

        <div class="grid grid-cols-2 gap-3 w-full">
          <button
            @click="emit('close')"
            :disabled="isLoading"
            class="py-4 px-6 rounded-2xl bg-gray-50 text-gray-400 font-black text-xs uppercase hover:bg-gray-100 transition-all disabled:opacity-50"
          >
            {{ cancelText || 'Batal' }}
          </button>
          <button
            @click="emit('confirm')"
            :disabled="isLoading"
            class="py-4 px-6 rounded-2xl font-black text-xs uppercase text-white shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            :class="{
              'bg-red-500 hover:bg-red-600 shadow-red-100': type === 'danger',
              'bg-amber-500 hover:bg-amber-600 shadow-amber-100': type === 'warning',
              'bg-[#4CC9C0] hover:bg-[#3db3aa] shadow-teal-100': type === 'info' || !type,
            }"
          >
            <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
            <span>{{ confirmText || 'Konfirmasi' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scale-in {
  animation: scaleIn 0.2s ease-out;
}
@keyframes scaleIn {
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

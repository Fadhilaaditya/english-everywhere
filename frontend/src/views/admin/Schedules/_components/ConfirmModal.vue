<script setup lang="ts">
import { AlertCircle, X } from 'lucide-vue-next'

defineProps<{
  show: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
}>()

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-[120] flex items-center justify-center p-4"
  >
    <!-- Backdrop -->
    <div 
      class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
      @click="emit('cancel')"
    ></div>

    <div
      class="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 overflow-hidden transform transition-all"
    >
      <!-- Close Button -->
      <button 
        @click="emit('cancel')"
        class="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X class="w-5 h-5" />
      </button>

      <div class="flex items-start gap-4 mb-6">
        <div class="flex-shrink-0 w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
          <AlertCircle class="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h3 class="text-xl font-bold text-gray-900 mb-1">
            {{ title }}
          </h3>
          <p class="text-gray-500 text-sm leading-relaxed">
            {{ message }}
          </p>
        </div>
      </div>

      <div class="flex justify-end gap-3 mt-8">
        <button
          @click="emit('cancel')"
          class="px-6 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-all text-sm"
        >
          {{ cancelText || 'Cancel' }}
        </button>
        <button
          @click="emit('confirm')"
          class="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-sm shadow-red-600/20 text-sm"
        >
          {{ confirmText || 'Delete' }}
        </button>
      </div>
    </div>
  </div>
</template>

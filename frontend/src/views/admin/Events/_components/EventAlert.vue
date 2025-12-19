<script setup lang="ts">
import { computed } from 'vue'
import { AlertTriangle } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
  type: 'create' | 'update' | 'delete'
}>()

const emit = defineEmits(['close', 'confirm'])

const config = computed(() => {
    switch (props.type) {
        case 'create':
            return {
                title: 'Confirm Create Event',
                message: 'Are you sure you want to create this event?',
                iconClass: 'bg-[#4FD1C5]',
                confirmBtnClass: 'bg-[#4FD1C5] hover:bg-[#3dbdb0] shadow-[#4FD1C5]/30'
            }
        case 'update':
            return {
                title: 'Confirm Update Event',
                message: 'Are you sure you want to update this event?',
                iconClass: 'bg-[#4FD1C5]',
                confirmBtnClass: 'bg-[#4FD1C5] hover:bg-[#3dbdb0] shadow-[#4FD1C5]/30'
            }
        case 'delete':
            return {
                title: 'Confirm Delete Event',
                message: 'Are you sure you want to delete this event?',
                iconClass: 'bg-[#FF4D4F]',
                confirmBtnClass: 'bg-[#FF6B6B] hover:bg-[#e05e5e] shadow-[#FF6B6B]/30'
            }
    }
})
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>

    <!-- Alert Content -->
    <div class="relative bg-white rounded-2xl w-full max-w-sm p-8 text-center shadow-xl">
        
        <!-- Icon -->
        <div class="mx-auto rounded-full flex items-center justify-center mb-6 w-20 h-20" :class="config.iconClass">
            <AlertTriangle class="w-10 h-10 text-white" />
        </div>

        <h3 class="text-xl font-bold text-gray-900 mb-2">{{ config.title }}</h3>
        <p class="text-gray-600 mb-8">{{ config.message }}</p>

        <div class="flex gap-4">
            <button 
                @click="$emit('close')"
                class="flex-1 py-2.5 rounded-lg border border-[#FF6B6B] text-[#FF6B6B] font-medium hover:bg-red-50 transition-colors"
            >
                Cancel
            </button>
            <button 
                @click="$emit('confirm')"
                class="flex-1 py-2.5 rounded-lg text-white font-medium transition-colors shadow-lg"
                :class="config.confirmBtnClass"
            >
                Confirm
            </button>
        </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
  date: Date | string
  events: any[]
}>()

const emit = defineEmits(['close', 'clickEvent'])

const formatDate = (dateVal: Date | string) => {
    const d = new Date(dateVal)
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

const getStatusLabel = (event: any) => {
    const s = (event.status || event.type || '').toLowerCase()
    if (s === 'success' || s === 'completed') return 'Completed'
    if (s === 'pending' || s === 'waiting') return 'Pending'
    return 'Scheduled'
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[105] flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/50" @click="emit('close')"></div>

    <!-- Modal Content -->
    <div class="relative bg-white rounded-lg shadow-xl w-full max-w-[280px] overflow-hidden animate-in fade-in zoom-in duration-200">
        <!-- Header -->
        <div class="flex items-center justify-between p-3 border-b border-gray-100 bg-gray-50">
            <h3 class="font-medium text-gray-900 text-sm">{{ formatDate(date) }}</h3>
            <button @click="emit('close')" class="p-1 hover:bg-gray-200 rounded-full transition-colors">
                <X class="w-4 h-4 text-gray-500" />
            </button>
        </div>
        
        <!-- List -->
        <div class="p-3 space-y-2 max-h-[60vh] overflow-y-auto">
             <button 
                v-for="event in events" 
                :key="event.id"
                @click="emit('clickEvent', event)"
                class="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-white shadow-sm hover:opacity-90 transition-opacity"
                :class="{
                    'bg-[#00B027]': event.status?.toUpperCase() === 'SUCCESS',
                    'bg-[#EB7A52]': event.status?.toUpperCase() === 'PENDING',
                    'bg-[#BCC1C9]': !['SUCCESS', 'PENDING'].includes(event.status?.toUpperCase())
                }"
            >
                {{ event.startTime.slice(0, 5) }} 
                <span class="ml-1">({{ event.className || 'Schedule' }})</span>
                <div class="text-[10px] opacity-90 truncate italic">
                    {{ event.teacherName || 'Teacher' }}
                </div>
            </button>
        </div>
        
        <!-- Footer Info -->
        <div class="p-2 text-center bg-gray-50 border-t border-gray-100">
            <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                Click to view or edit
            </p>
        </div>
    </div>
  </div>
</template>

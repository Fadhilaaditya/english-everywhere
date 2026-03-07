<script setup lang="ts">
import { X, CalendarOff } from 'lucide-vue-next'

defineProps<{
  isOpen: boolean
  date: Date | string
  events: any[]
}>()

const emit = defineEmits(['close', 'click-event'])

const formatDate = (dateVal: Date | string) => {
    const d = new Date(dateVal)
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

const getStatusLabel = (event: any) => {
    const s = (event.status || event.type || '').toLowerCase()
    if (s === 'available') return 'Available'
    if (s === 'waiting' || s === 'pending') return 'Waiting'
    if (s === 'booked' || s === 'taken') return 'Booked'
    return s
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>
    <div class="relative bg-white rounded-lg shadow-xl w-full max-w-[280px] overflow-hidden animate-in fade-in zoom-in duration-200">
        <!-- Header -->
        <div class="flex items-center justify-between p-3 border-b border-gray-100 bg-gray-50">
            <h3 class="font-medium text-gray-900 text-sm">{{ formatDate(date) }}</h3>
            <button @click="$emit('close')" class="p-1 hover:bg-gray-200 rounded-full transition-colors">
                <X class="w-4 h-4 text-gray-500" />
            </button>
        </div>
        
        <!-- List -->
        <div class="p-3 space-y-2 max-h-[60vh] overflow-y-auto">
             <template v-if="events && events.length > 0">
                 <button 
                    v-for="event in events" 
                    :key="event.id"
                    @click="$emit('click-event', event)"
                    class="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-white shadow-sm hover:opacity-90 transition-opacity"
                    :class="{
                        'bg-[#BCC1C9]': event.status === 'taken' || event.status === 'booked' || event.type === 'BOOKED',
                        'bg-[#0FB728]': event.status === 'available' || event.type === 'AVAILABLE',
                        'bg-[#E67E22]': event.status === 'waiting' || event.type === 'PENDING'
                    }"
                >
                    {{ event.time }} 
                    <span v-if="event.name">({{ event.name }})</span>
                    <span v-else>({{ getStatusLabel(event) }})</span>
                </button>
             </template>
             <div v-else class="py-12 px-4 text-center">
                 <CalendarOff class="w-12 h-12 text-gray-200 mx-auto mb-4" />
                 <p class="text-sm font-bold text-gray-900 mb-1 leading-tight">No appointment schedule</p>
                 <p class="text-xs text-gray-500">Please choose a date with <span class="text-[#0FB728] font-bold underline">green indicator</span>.</p>
             </div>
        </div>
    </div>
  </div>
</template>

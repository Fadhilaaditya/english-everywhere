<script setup lang="ts">
import { Clock, MapPin, CheckCircle2 } from 'lucide-vue-next'

const props = defineProps<{
  item: {
    id: number
    day: string
    month: string
    time: string
    subject: string
    room: string
    attendanceLink?: string
    link?: string
    status: string
  }
}>()
</script>

<template>
  <div 
    class="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 transition-all hover:shadow-md"
  >
    <div class="flex items-start gap-6 mb-6">
      <div class="text-center min-w-[70px] bg-[#F1F3F9] p-4 rounded-3xl flex flex-col justify-center items-center h-20">
        <span class="block text-2xl font-black text-[#2D3748] leading-none">{{ item.month.split(' ')[0] }}</span>
        <span class="text-[10px] uppercase font-bold text-gray-400 mt-1">{{ item.month.split(' ')[1] }}</span>
      </div>
      
      <div class="flex-1">
        <div class="flex justify-between items-start">
            <h4 class="text-lg font-bold text-[#2D3748] leading-tight">{{ item.subject }}</h4>
            <div v-if="item.status === 'Completed'" class="p-1 bg-green-50 rounded-full">
                <CheckCircle2 class="w-5 h-5 text-green-500" />
            </div>
        </div>
        
        <div class="space-y-2 mt-4">
          <div class="flex items-center gap-2 text-sm text-gray-500">
            <Clock class="w-4 h-4 text-[#4CC9C0]" />
            {{ item.time }}
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-500">
            <MapPin class="w-4 h-4 text-[#4CC9C0]" />
            {{ item.room }}
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="pt-4 border-t border-gray-100 flex gap-3">
        <button 
            v-if="item.status === 'Completed'"
            disabled
            class="w-full py-3 px-6 rounded-2xl bg-[#F0FFF4] text-[#38A169] text-sm font-bold border border-[#C6F6D5]"
        >
            Selesai
        </button>
        <a 
            v-else
            :href="item.attendanceLink || '#'"
            target="_blank"
            rel="noopener noreferrer"
            class="w-full py-3 px-6 rounded-2xl bg-[#4CC9C0] text-white text-sm font-bold shadow-lg shadow-[#4CC9C0]/20 hover:bg-[#3db8af] transition-colors text-center inline-block"
        >
          Link Absensi & Course Report
        </a>
    </div>

    <!-- Meeting Link (If available) -->
    <div v-if="item.link" class="pt-3">
        <a 
            :href="item.link"
            target="_blank"
            rel="noopener noreferrer"
            class="w-full py-3 px-6 rounded-2xl bg-white border-2 border-[#4CC9C0] text-[#4CC9C0] text-sm font-bold hover:bg-[#f0fbfb] transition-colors text-center block"
        >
            Link Report Card
        </a>
    </div>
  </div>
</template>

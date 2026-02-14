<script setup lang="ts">
import { X, Clock, User, Calendar as CalendarIcon, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
  date: Date | string
  events: any[]
}>()

const emit = defineEmits(['close', 'clickEvent'])

// Helper format tanggal untuk header modal
const formatFullDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[105] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="emit('close')"></div>

    <div
      class="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
    >
      <div class="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
        <div>
          <h3 class="font-black text-gray-800 text-xl uppercase tracking-tighter">Detail Jadwal</h3>
          <div class="flex items-center gap-2 text-gray-400 mt-1">
            <CalendarIcon class="w-3.5 h-3.5" />
            <span class="text-[10px] font-black uppercase tracking-widest">{{
              formatFullDate(date)
            }}</span>
          </div>
        </div>
        <button
          @click="emit('close')"
          class="p-3 hover:bg-white rounded-full transition-all text-gray-400 hover:text-gray-600 shadow-sm"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-6 space-y-4">
        <div
          v-for="event in events"
          :key="event.id"
          @click="emit('clickEvent', event)"
          class="group bg-gray-50/50 p-5 rounded-[2rem] border border-transparent hover:border-[#4CC9C0] hover:bg-white hover:shadow-xl transition-all cursor-pointer flex items-center justify-between"
        >
          <div class="flex items-center gap-5">
            <div
              class="p-4 bg-white rounded-2xl shadow-sm group-hover:bg-[#4CC9C0] group-hover:text-white transition-colors"
            >
              <Clock class="w-5 h-5" />
            </div>
            <div>
              <h4 class="font-black text-gray-800 text-sm uppercase">
                {{ event.className || 'Kelas Umum' }}
              </h4>
              <div class="flex items-center gap-4 mt-1">
                <div class="flex items-center gap-1.5">
                  <User class="w-3 h-3 text-gray-400" />
                  <span class="text-[10px] font-bold text-gray-400 uppercase">{{
                    event.teacherName || 'Guru'
                  }}</span>
                </div>
                <div class="flex items-center gap-1.5 text-[#4CC9C0]">
                  <span class="text-[10px] font-black uppercase"
                    >{{ event.startTime.slice(0, 5) }} - {{ event.endTime.slice(0, 5) }}</span
                  >
                </div>
              </div>
            </div>
          </div>
          <ChevronRight
            class="w-5 h-5 text-gray-200 group-hover:text-[#4CC9C0] transition-all transform group-hover:translate-x-1"
          />
        </div>
      </div>

      <div class="p-6 text-center border-t border-gray-50 bg-gray-50/30">
        <p class="text-[9px] font-black text-gray-300 uppercase tracking-widest">
          Klik salah satu jadwal untuk melihat detail atau mengubah
        </p>
      </div>
    </div>
  </div>
</template>

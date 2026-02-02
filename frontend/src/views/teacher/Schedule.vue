<script setup lang="ts">
import { ref } from 'vue'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, CheckCircle2 } from 'lucide-vue-next'

// Mock data jadwal (Hanya Baca)
const classes = ref([
  { 
    id: 1, 
    day: 12, 
    month: 'Jan', 
    time: '09:00 - 10:30', 
    subject: 'Grammar Master', 
    room: 'Zoom Room A',
    status: 'completed' 
  },
  { 
    id: 2, 
    day: 14, 
    month: 'Jan', 
    time: '13:00 - 14:30', 
    subject: 'Speaking Club', 
    room: 'Zoom Room B',
    status: 'upcoming'
  },
  { 
    id: 3, 
    day: 15, 
    month: 'Jan', 
    time: '10:00 - 11:30', 
    subject: 'IELTS Prep Writing', 
    room: 'Offline Class 2',
    status: 'upcoming'
  },
])

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const currentMonth = ref('January 2026')
</script>

<template>
  <div class="p-8 bg-[#F8F9FA] min-h-screen font-sans">
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-3">
        <div class="p-3 bg-white rounded-2xl shadow-sm">
          <CalendarIcon class="w-6 h-6 text-[#4CC9C0]" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Jadwal Mengajar</h1>
          <p class="text-gray-500 text-sm">Lihat jadwal mengajar Anda yang telah ditetapkan.</p>
        </div>
      </div>
      <div class="hidden md:block px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl">
        <p class="text-xs text-blue-600 font-medium text-center italic">
          *Hubungi admin untuk perubahan jadwal
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-50">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-xl font-bold text-gray-800">{{ currentMonth }}</h2>
          <div class="flex gap-2">
            <button class="p-2 hover:bg-gray-100 rounded-full transition"><ChevronLeft class="w-5 h-5" /></button>
            <button class="p-2 hover:bg-gray-100 rounded-full transition"><ChevronRight class="w-5 h-5" /></button>
          </div>
        </div>

        <div class="grid grid-cols-7 gap-2 mb-4">
          <div v-for="day in daysOfWeek" :key="day" class="text-center text-sm font-bold text-gray-400 py-2">
            {{ day }}
          </div>
        </div>
        
        <div class="grid grid-cols-7 gap-2">
          <div 
            v-for="n in 31" 
            :key="n" 
            class="aspect-square flex items-center justify-center rounded-2xl text-sm font-medium transition"
            :class="[
              n === 12 || n === 14 || n === 15 
                ? 'bg-[#4CC9C0] text-white shadow-lg shadow-[#4CC9C0]/30' 
                : 'text-gray-600'
            ]"
          >
            {{ n }}
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <h3 class="text-lg font-bold text-gray-800 px-2 flex items-center justify-between">
          Sesi Mendatang
          <span class="text-xs font-normal text-gray-400">{{ classes.filter(c => c.status === 'upcoming').length }} Sesi</span>
        </h3>
        
        <div 
          v-for="item in classes" 
          :key="item.id" 
          class="relative bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-50 overflow-hidden"
          :class="{'opacity-60': item.status === 'completed'}"
        >
          <div v-if="item.status === 'completed'" class="absolute top-0 right-0 p-2">
            <CheckCircle2 class="w-5 h-5 text-green-500" />
          </div>

          <div class="flex items-start gap-4">
            <div class="text-center min-w-[60px] bg-[#F1F3F9] px-3 py-2 rounded-2xl">
              <span class="block text-xl font-black text-gray-700">{{ item.day }}</span>
              <span class="text-[10px] uppercase font-bold text-gray-500">{{ item.month }}</span>
            </div>
            
            <div class="flex-1">
              <h4 class="font-bold text-gray-800 leading-tight">{{ item.subject }}</h4>
              
              <div class="space-y-1.5 mt-3">
                <div class="flex items-center gap-2 text-xs text-gray-500">
                  <Clock class="w-3.5 h-3.5 text-[#4CC9C0]" />
                  {{ item.time }}
                </div>
                <div class="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin class="w-3.5 h-3.5 text-[#4CC9C0]" />
                  {{ item.room }}
                </div>
              </div>

              <button 
                v-if="item.status === 'upcoming'"
                class="mt-4 w-full py-2 bg-[#4CC9C0] text-white text-xs font-bold rounded-lg hover:bg-[#3db3aa] transition"
              >
                Masuk Kelas
              </button>
              <span v-else class="mt-4 block text-center text-xs font-bold text-green-600 bg-green-50 py-2 rounded-lg">
                Selesai
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
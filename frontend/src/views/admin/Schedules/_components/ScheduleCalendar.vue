<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-vue-next'

/**
 * Props & Emits
 * Menggunakan v-model:currentDate agar sinkron dengan Parent
 */
const props = defineProps<{
  currentDate: Date
  schedules: any[]
  isLoading: boolean
}>()

const emit = defineEmits(['update:currentDate', 'dayClick', 'eventClick'])

// --- Navigasi Bulan ---
const changeMonth = (offset: number) => {
  const newDate = new Date(
    props.currentDate.getFullYear(),
    props.currentDate.getMonth() + offset,
    1,
  )
  // Mengirim perubahan kembali ke file induk
  emit('update:currentDate', newDate)
}

// Format Tampilan Bulan (Contoh: FEBRUARI 2026)
const currentMonthDisplay = computed(() => {
  return props.currentDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' }).toUpperCase()
})

// --- Logika Grid Kalender ---
const weekDays = ['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB', 'MIN']

const calendarDays = computed(() => {
  const year = props.currentDate.getFullYear()
  const month = props.currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const lastDate = new Date(year, month + 1, 0).getDate()

  // Menentukan offset agar Senin adalah hari pertama (0)
  let startDay = firstDay === 0 ? 6 : firstDay - 1

  const days = []
  const prevMonthLastDay = new Date(year, month, 0).getDate()

  // Hari dari bulan sebelumnya
  for (let i = startDay - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevMonthLastDay - i),
      isCurrentMonth: false,
    })
  }
  // Hari bulan saat ini
  for (let i = 1; i <= lastDate; i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    })
  }
  // Hari bulan berikutnya sampai kotak berjumlah 42
  while (days.length < 42) {
    const nextDate = days.length - (startDay + lastDate) + 1
    days.push({
      date: new Date(year, month + 1, nextDate),
      isCurrentMonth: false,
    })
  }
  return days
})

// Fungsi memfilter jadwal berdasarkan hari
const getEventsForDay = (date: Date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const searchStr = `${y}-${m}-${d}`
  return props.schedules.filter((s) => s.date?.startsWith(searchStr))
}
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-8">
      <div class="flex items-center gap-4 bg-gray-50 p-2 rounded-3xl border border-gray-100">
        <button
          @click="changeMonth(-1)"
          class="p-2 hover:bg-white hover:shadow-md rounded-2xl transition-all text-gray-600"
        >
          <ChevronLeft class="w-6 h-6" />
        </button>

        <h2
          class="text-xl font-black text-gray-800 uppercase tracking-tighter px-4 min-w-[220px] text-center"
        >
          {{ currentMonthDisplay }}
        </h2>

        <button
          @click="changeMonth(1)"
          class="p-2 hover:bg-white hover:shadow-md rounded-2xl transition-all text-gray-600"
        >
          <ChevronRight class="w-6 h-6" />
        </button>
      </div>

      <div v-if="isLoading" class="flex items-center gap-2 text-[#4CC9C0]">
        <Loader2 class="w-4 h-4 animate-spin" />
        <span class="text-[10px] font-black uppercase">Syncing...</span>
      </div>
    </div>

    <div class="border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
      <div class="grid grid-cols-7 bg-gray-50/50 border-b border-gray-100">
        <div
          v-for="day in weekDays"
          :key="day"
          class="py-5 text-center text-[10px] font-black text-gray-400"
        >
          {{ day }}
        </div>
      </div>

      <div class="grid grid-cols-7">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          @click="emit('dayClick', day)"
          class="min-h-[140px] border-r border-b border-gray-50 p-4 transition-all hover:bg-gray-50/50 cursor-pointer relative"
          :class="{ 'opacity-30 bg-gray-50/20': !day.isCurrentMonth }"
        >
          <span
            class="text-sm font-black"
            :class="day.isCurrentMonth ? 'text-gray-700' : 'text-gray-300'"
          >
            {{ day.date.getDate() }}
          </span>

          <div class="mt-3 space-y-1.5">
            <div
              v-for="event in getEventsForDay(day.date).slice(0, 2)"
              :key="event.id"
              @click.stop="emit('eventClick', event)"
              class="px-3 py-2 rounded-xl text-[9px] font-black text-white bg-[#4CC9C0] truncate shadow-sm hover:brightness-95 transition-all uppercase"
            >
              {{ event.startTime.slice(0, 5) }} • {{ event.teacher?.user?.fullName?.split(' ')[0] }}
            </div>

            <div
              v-if="getEventsForDay(day.date).length > 2"
              class="text-[9px] text-center font-black text-gray-400 pt-1 uppercase"
            >
              +{{ getEventsForDay(day.date).length - 2 }} Lainnya
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Menghilangkan border pada sisi kanan grid agar rapi */
.grid-cols-7 > div:nth-child(7n) {
  border-right: none;
}
</style>

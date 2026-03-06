<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  currentDate: Date
  schedules: any[]
  isLoading: boolean
  programs: any[]
  selectedCourseId: number | null
  teachers: any[]
}>()

const emit = defineEmits(['update:currentDate', 'update:selectedCourseId', 'dayClick', 'eventClick'])

const goToToday = () => {
  emit('update:currentDate', new Date())
}

// --- Navigasi Bulan ---
const changeMonth = (offset: number) => {
  const newDate = new Date(
    props.currentDate.getFullYear(),
    props.currentDate.getMonth() + offset,
    1,
  )
  emit('update:currentDate', newDate)
}

const prevMonth = () => changeMonth(-1)
const nextMonth = () => changeMonth(1)

// Format Tampilan Bulan (Contoh: February 2026)
const currentMonthDisplay = computed(() => {
  return props.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
})

// --- Logika Grid Kalender ---
const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

const calendarDays = computed(() => {
  const year = props.currentDate.getFullYear()
  const month = props.currentDate.getMonth()
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)

  const startDayDetails = firstDayOfMonth.getDay()
  const startDay = startDayDetails === 0 ? 6 : startDayDetails - 1

  const days: { date: Date; isCurrentMonth: boolean }[] = []
  const prevMonthLastDay = new Date(year, month, 0).getDate()

  // Hari dari bulan sebelumnya
  for (let i = startDay - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevMonthLastDay - i),
      isCurrentMonth: false,
    })
  }
  // Hari bulan saat ini
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    })
  }
  // Hari bulan berikutnya sampai kotak berjumlah 42
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: new Date(year, month + 1, i),
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
  <div class="bg-white p-6 rounded-lg">
    <div class="flex justify-between items-end mb-8">
      <div class="flex items-end gap-6">
        <div class="flex flex-col gap-2">
          <label class="text-sm text-gray-600 font-medium">Course</label>
          <div class="relative">
            <select 
              :value="selectedCourseId"
              @change="emit('update:selectedCourseId', parseInt(($event.target as HTMLSelectElement).value))"
              class="appearance-none border border-gray-300 rounded-lg px-4 py-2 w-64 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#4FD1C5] bg-white cursor-pointer"
            >
              <option v-for="program in programs" :key="program.id" :value="program.id">
                {{ program.title }}
              </option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>

        <button 
          @click="goToToday" 
          class="border border-gray-300 rounded-lg px-8 py-2 text-gray-700 font-medium hover:bg-gray-50 transition-colors h-[42px]"
        >
          Today
        </button>

        <div class="flex items-center gap-4 ml-4 h-[42px]">
          <button @click="prevMonth" class="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft class="w-6 h-6 text-gray-900" />
          </button>
          <button @click="nextMonth" class="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronRight class="w-6 h-6 text-gray-900" />
          </button>
        </div>
      </div>
      <h2 class="text-2xl font-bold text-gray-900">{{ currentMonthDisplay }}</h2>
    </div>

    <div class="border border-gray-200 rounded-lg overflow-hidden">
      <div class="grid grid-cols-7 border-b border-gray-200">
        <div
          v-for="day in weekDays"
          :key="day"
          class="py-3 px-4 border-r border-gray-200 last:border-r-0 bg-gray-50 text-xs font-semibold text-gray-500 uppercase"
        >
          {{ day }}
        </div>
      </div>

      <div class="grid grid-cols-7">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          @click="emit('dayClick', day)"
          class="min-h-[140px] border-r border-b border-gray-200 last:border-r-0 relative p-2 transition-colors hover:bg-gray-50/30 cursor-pointer"
          :class="{ '!bg-gray-50/50 opacity-50': !day.isCurrentMonth }"
        >
          <span class="text-lg font-medium text-gray-900 block mb-2">{{ day.date.getDate() }}</span>
          <div class="space-y-1.5">
            <button
              v-for="event in getEventsForDay(day.date).slice(0, 2)"
              :key="event.id"
              @click.stop="emit('eventClick', event)"
              class="w-full text-left px-2 py-1 rounded text-xs font-medium text-white shadow-sm hover:opacity-80 transition-opacity bg-[#4FD1C5]"
            >
              {{ event.startTime.slice(0, 5) }} • {{ event.teacher?.user?.fullName?.split(' ')[0] }}
            </button>

            <div
              v-if="getEventsForDay(day.date).length > 2"
              class="text-xs text-gray-500 font-medium px-2 hover:text-gray-700 hover:bg-gray-100 rounded cursor-pointer mt-1"
            >
              +{{ getEventsForDay(day.date).length - 2 }} more
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

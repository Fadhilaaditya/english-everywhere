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
  selectedTeacherId: number | null
}>()

const emit = defineEmits(['update:currentDate', 'update:selectedCourseId', 'update:selectedTeacherId', 'dayClick', 'eventClick'])

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
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-8">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
       <div class="flex flex-wrap items-center gap-4">
            <!-- Prev/Next Controls -->
            <div class="flex bg-gray-100 rounded-xl p-1.5 border border-gray-200/50 shadow-inner">
                <button @click="prevMonth" class="p-2 hover:bg-white rounded-lg transition-all shadow-sm group active:scale-95">
                    <ChevronLeft class="w-5 h-5 text-gray-600 group-hover:text-[#4FD1C5]" />
                </button>
                <button @click="nextMonth" class="p-2 hover:bg-white rounded-lg transition-all shadow-sm group active:scale-95">
                    <ChevronRight class="w-5 h-5 text-gray-600 group-hover:text-[#4FD1C5]" />
                </button>
            </div>
            <!-- Month Title -->
            <h2 class="text-xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter">{{ currentMonthDisplay }}</h2>
       </div>

        <div class="flex flex-wrap items-center gap-4">
          <!-- Course Selector -->
          <div class="relative group">
            <select 
              :value="selectedCourseId || ''"
              @change="emit('update:selectedCourseId', ($event.target as HTMLSelectElement).value ? parseInt(($event.target as HTMLSelectElement).value) : null)"
              class="appearance-none border-2 border-gray-100 rounded-xl px-6 py-2.5 pr-12 text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-[#4FD1C5]/10 focus:border-[#4FD1C5] bg-gray-50/30 cursor-pointer transition-all hover:bg-gray-100/50"
            >
              <option value="">All Programs</option>
              <option v-for="program in programs" :key="program.id" :value="program.id">
                {{ program.title }}
              </option>
            </select>
            <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 group-hover:text-[#4FD1C5]">
               <ChevronDown class="w-4 h-4" />
            </div>
          </div>

          <!-- Teacher Selector -->
          <div class="relative group">
            <select 
              :value="selectedTeacherId || ''"
              @change="emit('update:selectedTeacherId', ($event.target as HTMLSelectElement).value ? parseInt(($event.target as HTMLSelectElement).value) : null)"
              class="appearance-none border-2 border-gray-100 rounded-xl px-6 py-2.5 pr-12 text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-[#4FD1C5]/10 focus:border-[#4FD1C5] bg-gray-50/30 cursor-pointer transition-all hover:bg-gray-100/50"
            >
              <option value="">All Teachers</option>
              <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                {{ teacher.user?.fullName || teacher.id }}
              </option>
            </select>
            <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 group-hover:text-[#4FD1C5]">
               <ChevronDown class="w-4 h-4" />
            </div>
          </div>

          <!-- Today Button -->
          <button 
            @click="goToToday"
            class="px-6 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm font-black text-gray-600 hover:bg-white hover:shadow-md hover:text-[#4FD1C5] transition-all active:scale-95"
          >
            Today
          </button>
       </div>
    </div>

    <!-- Calendar Grid -->
    <div class="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <!-- Days Header -->
          <div class="grid grid-cols-7 border-b border-gray-200 bg-gray-50/80 backdrop-blur-sm">
            <div 
              v-for="day in weekDays" 
              :key="day" 
              class="py-4 text-center text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest border-r border-gray-200 last:border-r-0"
            >
                {{ day }}
            </div>
          </div>

          <div class="grid grid-cols-7 bg-white">
            <div 
                v-for="(day, index) in calendarDays" 
                :key="index"
                @click="emit('dayClick', day)"
                class="min-h-[100px] sm:min-h-[140px] p-2 sm:p-3 border-b border-r border-gray-200 last:border-r-0 relative group transition-all hover:bg-gray-50/50 cursor-pointer"
                :class="{ 'opacity-40 bg-gray-50/30': !day.isCurrentMonth }"
            >
                <div class="flex justify-between items-start mb-2 sm:mb-3">
                    <span 
                        class="text-xs sm:text-lg font-black w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-all"
                        :class="[
                          day.date.toDateString() === new Date().toDateString() 
                          ? 'bg-[#4FD1C5] text-white shadow-lg shadow-[#4FD1C5]/30' 
                          : 'text-gray-900 group-hover:text-[#4FD1C5]'
                        ]"
                    >
                        {{ day.date.getDate() }}
                    </span>
                </div>

                <!-- Events -->
                <div class="space-y-1.5">
                    <div 
                        v-for="(event, eIndex) in getEventsForDay(day.date).slice(0, 3)" 
                        :key="eIndex"
                        @click.stop="emit('eventClick', event)"
                        class="text-[10px] sm:text-xs px-2 py-1.5 rounded-lg font-bold text-white shadow-sm transition-all truncate border border-white/10 hover:brightness-105 active:scale-95"
                        :class="[
                            event.status?.toUpperCase() === 'SUCCESS' ? 'bg-[#00B027]' :
                            event.status?.toUpperCase() === 'PENDING' ? 'bg-[#EB7A52]' : 'bg-[#BCC1C9]'
                        ]"
                    >
                        <span class="sm:inline hidden">{{ event.startTime.slice(0, 5) }} •</span>
                        {{ (event.teacher?.user?.fullName || event.teacherName || '').split(' ')[0] }}
                    </div>
                     
                    <!-- More Badge -->
                    <div 
                        v-if="getEventsForDay(day.date).length > 3"
                        class="text-[9px] sm:text-xs text-gray-400 font-bold px-2 py-1 hover:text-[#4FD1C5] hover:bg-[#4FD1C5]/5 rounded-lg cursor-pointer transition-all inline-block w-full"
                    >
                        +{{ getEventsForDay(day.date).length - 3 }} more
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

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import DayDetailsModal from './DayDetailsModal.vue'
import CustomDropdown from '@/components/CustomDropdown.vue'

const props = defineProps<{
  currentDate: Date
  schedules: any[]
  isLoading: boolean
  programs: any[]
  selectedCourseId: number | null
  teachers: any[]
  selectedTeacherId: number | null
}>()

const emit = defineEmits(['update:currentDate', 'update:selectedCourseId', 'update:selectedTeacherId', 'dayClick', 'eventClick', 'todayClick'])

const isDayModalOpen = ref(false)
const selectedDayDate = ref<Date | string>('')
const selectedDayEvents = ref<any[]>([])

const openDayModal = (date: Date) => {
    selectedDayDate.value = date
    selectedDayEvents.value = getEventsForDay(date)
    isDayModalOpen.value = true
}

const goToToday = () => {
  const today = new Date()
  emit('update:currentDate', today)
  emit('todayClick', { date: today })
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

const programOptions = computed(() => [
  { id: null, title: 'All Programs' },
  ...props.programs.map(p => ({ id: p.id, title: p.title || p.name }))
])

const teacherOptions = computed(() => [
  { id: null, fullName: 'All Teachers' },
  ...props.teachers.map(t => ({ id: t.id, fullName: t.user?.fullName || `Teacher ${t.id}` }))
])
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-2 md:p-6">
    <!-- Header -->
    <div class="flex flex-row items-center justify-between mb-4 md:mb-8 gap-2">
       <div class="flex items-center gap-2">
            <!-- Prev/Next Controls -->
            <div class="flex bg-gray-100 rounded-lg p-1">
                <button @click="prevMonth" class="p-1 sm:p-2 hover:bg-white rounded-md transition-all shadow-sm group active:scale-95">
                    <ChevronLeft class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-[#4FD1C5]" />
                </button>
                <button @click="nextMonth" class="p-1 sm:p-2 hover:bg-white rounded-md transition-all shadow-sm group active:scale-95">
                    <ChevronRight class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-[#4FD1C5]" />
                </button>
            </div>
            <!-- Month Title -->
            <h2 class="text-sm sm:text-lg md:text-2xl font-bold text-gray-900 uppercase tracking-wide">{{ currentMonthDisplay }}</h2>
       </div>

        <div class="hidden lg:flex flex-wrap items-center gap-4">
          <!-- Course Selector -->
          <div class="w-48">
            <CustomDropdown
              :model-value="selectedCourseId"
              :options="programOptions"
              label-key="title"
              value-key="id"
              placeholder="All Programs"
              @update:model-value="emit('update:selectedCourseId', $event)"
            />
          </div>

          <!-- Teacher Selector -->
          <div class="w-48">
            <CustomDropdown
              :model-value="selectedTeacherId"
              :options="teacherOptions"
              label-key="fullName"
              value-key="id"
              placeholder="All Teachers"
              @update:model-value="emit('update:selectedTeacherId', $event)"
            />
          </div>

          <!-- Today Button -->
          <button 
            @click="goToToday"
            class="px-6 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
          >
            Today
          </button>
       </div>

       <!-- Mobile Today Button -->
        <button 
            @click="goToToday"
            class="lg:hidden px-3 py-1 bg-gray-100 rounded text-xs font-bold text-gray-600"
        >
            Today
        </button>
    </div>

    <!-- Filters for Mobile (Visible when not lg) -->
    <div class="lg:hidden grid grid-cols-2 gap-2 mb-4">
        <CustomDropdown
          :model-value="selectedCourseId"
          :options="programOptions"
          label-key="title"
          value-key="id"
          placeholder="Programs"
          class="!py-1.5 !px-2 text-[10px]"
          @update:model-value="emit('update:selectedCourseId', $event)"
        />
        <CustomDropdown
          :model-value="selectedTeacherId"
          :options="teacherOptions"
          label-key="fullName"
          value-key="id"
          placeholder="Teachers"
          class="!py-1.5 !px-2 text-[10px]"
          @update:model-value="emit('update:selectedTeacherId', $event)"
        />
    </div>

    <!-- Calendar Grid -->
    <div class="border border-gray-200 rounded-lg overflow-hidden">
          <!-- Days Header -->
          <div class="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
            <div 
              v-for="day in weekDays" 
              :key="day" 
              class="py-2 sm:py-3 text-center text-[10px] sm:text-xs font-bold text-gray-500 uppercase border-r border-gray-200 last:border-r-0"
            >
                {{ day }}
            </div>
          </div>

          <div class="grid grid-cols-7 bg-white">
            <div 
                v-for="(day, index) in calendarDays" 
                :key="index"
                @click="emit('dayClick', day)"
                class="min-h-[80px] sm:min-h-[120px] p-1 sm:p-2 border-b border-r border-gray-200 last:border-r-0 relative group transition-colors cursor-pointer"
                :class="{ 'opacity-50 bg-gray-50/50': !day.isCurrentMonth, 'hover:bg-[#F0FFF4]': day.isCurrentMonth }"
            >
                <div class="flex justify-end sm:justify-between items-start mb-1 sm:mb-2">
                    <span 
                        class="text-xs sm:text-lg font-medium w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full transition-all"
                        :class="[
                          day.date.toDateString() === new Date().toDateString() 
                          ? 'bg-[#52D3C4] text-white' 
                          : 'text-gray-900 group-hover:text-[#4FD1C5]'
                        ]"
                    >
                        {{ day.date.getDate() }}
                    </span>
                </div>

                <!-- Events -->
                <div class="space-y-1">
                    <!-- MOBILE VIEW: Condensed -->
                    <div class="md:hidden flex flex-col items-center">
                        <template v-if="getEventsForDay(day.date).length > 0">
                             <div 
                                class="text-[10px] px-1 py-0.5 rounded font-bold w-full text-center truncate mb-0.5 text-white"
                                :class="[
                                    getEventsForDay(day.date)[0]?.status?.toUpperCase() === 'SUCCESS' ? 'bg-[#00B027]' :
                                    getEventsForDay(day.date)[0]?.status?.toUpperCase() === 'PENDING' ? 'bg-[#EB7A52]' : 'bg-[#BCC1C9]'
                                ]"
                                @click.stop="emit('eventClick', getEventsForDay(day.date)[0])"
                             >
                                {{ getEventsForDay(day.date)[0]?.startTime.slice(0, 5) }}
                             </div>
                             <span 
                                v-if="getEventsForDay(day.date).length > 1" 
                                @click.stop="openDayModal(day.date)"
                                class="text-[9px] text-gray-500 font-bold cursor-pointer hover:bg-gray-100 px-1 rounded"
                             >
                                +{{ getEventsForDay(day.date).length - 1 }}
                             </span>
                        </template>
                    </div>

                    <!-- DESKTOP VIEW: Detailed list -->
                    <div class="hidden md:block space-y-1">
                        <div 
                            v-for="(event, eIndex) in getEventsForDay(day.date).slice(0, 2)" 
                            :key="eIndex"
                            @click.stop="emit('eventClick', event)"
                            class="text-[10px] px-2 py-1 rounded-md font-medium text-white shadow-sm transition-opacity truncate"
                            :class="[
                                event.status?.toUpperCase() === 'SUCCESS' ? 'bg-[#00B027] hover:opacity-90' :
                                event.status?.toUpperCase() === 'PENDING' ? 'bg-[#EB7A52] hover:opacity-90' : 'bg-[#BCC1C9] hover:opacity-90'
                            ]"
                        >
                            {{ event.startTime.slice(0, 5) }} • {{ (event.teacher?.user?.fullName || event.teacherName || '').split(' ')[0] }}
                        </div>
                         
                        <!-- More Badge -->
                        <div 
                            v-if="getEventsForDay(day.date).length > 2"
                            @click.stop="openDayModal(day.date)"
                            class="text-[10px] text-gray-500 font-medium px-1 hover:text-gray-700 hover:bg-gray-100 rounded cursor-pointer mt-0.5 text-center"
                        >
                            +{{ getEventsForDay(day.date).length - 2 }} more
                        </div>
                    </div>
                </div>
            </div>
          </div>
      </div>

      <DayDetailsModal 
        :is-open="isDayModalOpen"
        :date="selectedDayDate"
        :events="selectedDayEvents"
        @close="isDayModalOpen = false"
        @click-event="(e) => { isDayModalOpen = false; emit('eventClick', e) }"
      />
  </div>
</template>

<style scoped>
/* Menghilangkan border pada sisi kanan grid agar rapi */
.grid-cols-7 > div:nth-child(7n) {
  border-right: none;
}
</style>

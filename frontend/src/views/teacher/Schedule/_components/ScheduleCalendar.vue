<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  classes: any[]
  currentDate: Date
  selectedDate: string
}>()

const emit = defineEmits(['prev', 'next', 'today', 'select'])

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

const currentMonth = computed(() => months[props.currentDate.getMonth()])
const currentYear = computed(() => props.currentDate.getFullYear())

const daysInMonth = computed(() => {
    const year = props.currentDate.getFullYear()
    const month = props.currentDate.getMonth()
    return new Date(year, month + 1, 0).getDate()
})

const firstDayOfMonth = computed(() => {
    const year = props.currentDate.getFullYear()
    const month = props.currentDate.getMonth()
    let day = new Date(year, month, 1).getDay()
    return day === 0 ? 6 : day - 1
})

const calendarDays = computed(() => {
    const days = []
    const prevMonthDays = new Date(props.currentDate.getFullYear(), props.currentDate.getMonth(), 0).getDate()
    for (let i = firstDayOfMonth.value - 1; i >= 0; i--) {
        days.push({
            date: prevMonthDays - i,
            isCurrentMonth: false,
            fullDate: getFullDate(props.currentDate.getFullYear(), props.currentDate.getMonth() - 1, prevMonthDays - i)
        })
    }
    for (let i = 1; i <= daysInMonth.value; i++) {
         days.push({
            date: i,
            isCurrentMonth: true,
            fullDate: getFullDate(props.currentDate.getFullYear(), props.currentDate.getMonth(), i)
        })
    }
    const remainingCells = 42 - days.length
    for (let i = 1; i <= remainingCells; i++) {
         days.push({
            date: i,
            isCurrentMonth: false,
             fullDate: getFullDate(props.currentDate.getFullYear(), props.currentDate.getMonth() + 1, i)
        })
    }
    return days
})

const getFullDate = (year: number, month: number, day: number) => {
    const d = new Date(year, month, day)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const da = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${da}`
}

const isToday = (fullDate: string) => {
    const today = new Date()
    return fullDate === getFullDate(today.getFullYear(), today.getMonth(), today.getDate())
}

const isPastDate = (fullDate: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const parts = fullDate.split('-').map(Number)
    const y = parts[0] || 0
    const m = parts[1] || 1
    const d = parts[2] || 1
    const checkDate = new Date(y, m - 1, d)
    return checkDate < today
}

const getEventsForDay = (date: string) => {
    return props.classes.filter(c => c.date === date)
}
</script>

<template>
  <div class="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-4 md:p-8">
    <!-- Header -->
    <div class="flex flex-row items-center justify-between mb-8 gap-2">
       <div class="flex items-center gap-4">
            <div class="flex bg-gray-100 rounded-xl p-1">
                <button @click="emit('prev')" class="p-2 hover:bg-white rounded-lg transition-all shadow-sm">
                    <ChevronLeft class="w-5 h-5 text-gray-600" />
                </button>
                <button @click="emit('next')" class="p-2 hover:bg-white rounded-lg transition-all shadow-sm">
                    <ChevronRight class="w-5 h-5 text-gray-600" />
                </button>
            </div>
            <h2 class="text-xl md:text-2xl font-bold text-gray-800 uppercase tracking-tight">{{ currentMonth }} {{ currentYear }}</h2>
       </div>
      
      <button 
        @click="emit('today')"
        class="hidden md:block px-6 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
      >
        Today
      </button>
       <!-- Mobile Today Button -->
        <button 
            @click="emit('today')"
            class="md:hidden px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600"
        >
            Today
        </button>
    </div>

    <!-- Calendar Grid -->
    <div class="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <!-- Days Header -->
          <div class="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
            <div v-for="day in weekDays" :key="day" class="py-4 text-center text-xs font-bold text-gray-400 uppercase border-r border-gray-100 last:border-r-0">
                {{ day }}
            </div>
          </div>

          <div class="grid grid-cols-7 bg-white">
            <div 
                v-for="(day, index) in calendarDays" 
                :key="index"
                @click="emit('select', day.fullDate)"
                class="min-h-[100px] sm:min-h-[140px] p-2 border-b border-r border-gray-100 last:border-r-0 relative group hover:opacity-90 transition-all cursor-pointer flex flex-col items-center justify-center text-center"
                :class="[
                    !day.isCurrentMonth ? 'bg-gray-50/30 text-gray-300' : '',
                    day.fullDate === props.selectedDate ? 'ring-2 ring-inset ring-[#2D3748] z-10' : '',
                    getEventsForDay(day.fullDate).length > 0 
                        ? (isPastDate(day.fullDate) ? 'bg-[#4CC9C0]/20 text-[#4CC9C0]' : 'bg-[#4CC9C0] text-white shadow-inner') 
                        : 'bg-white text-gray-700'
                ]"
            >
                <div class="flex flex-col items-center justify-center gap-1">
                    <span 
                        class="text-lg sm:text-2xl font-bold transition-all"
                        :class="[
                           isToday(day.fullDate) && getEventsForDay(day.fullDate).length === 0 ? 'text-[#4CC9C0] underline decoration-2' : ''
                        ]"
                    >
                        {{ day.date }}
                    </span>

                    <!-- Tiny indicator if there are events -->
                    <div v-if="getEventsForDay(day.fullDate).length > 0" class="flex flex-col gap-0.5">
                        <span class="text-[10px] sm:text-xs font-bold leading-tight uppercase opacity-90">
                            {{ getEventsForDay(day.fullDate).length }} {{ getEventsForDay(day.fullDate).length > 1 ? 'Classes' : 'Class' }}
                        </span>
                    </div>
                </div>
            </div>
          </div>
      </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>

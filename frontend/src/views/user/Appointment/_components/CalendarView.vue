<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import FormAppointmentModal from './FormAppointmentModal.vue'

const currentDate = ref(new Date())
const isModalOpen = ref(false)
const selectedDate = ref('')
const selectedTime = ref('')

// Mock events data matching the design
const events: Record<string, { type: 'API_AVAILABLE' | 'AVAILABLE' | 'PENDING', time: string }[]> = {
  '2025-09-08': [
    { type: 'AVAILABLE', time: '9:00' },
    { type: 'AVAILABLE', time: '13:00' }
  ],
  '2025-09-11': [
    { type: 'PENDING', time: '13:00' },
    { type: 'PENDING', time: '13:00' }
  ],
  '2025-09-17': [
      { type: 'PENDING', time: '21:00' }
  ],
  '2025-09-18': [
      { type: 'AVAILABLE', time: '13:00' },
      { type: 'PENDING', time: '19:00' }
  ],
  '2025-09-24': [
      { type: 'AVAILABLE', time: '13:00' }
  ],
  '2025-09-21': [
       { type: 'PENDING', time: '13:00' },
       { type: 'PENDING', time: '13:00' }
  ]
}

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

const currentMonth = computed(() => months[currentDate.value.getMonth()])
const currentYear = computed(() => currentDate.value.getFullYear())

const daysInMonth = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    return new Date(year, month + 1, 0).getDate()
})

const firstDayOfMonth = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    // 0 = Sunday, 1 = Monday. We want 0 = Monday.
    let day = new Date(year, month, 1).getDay()
    return day === 0 ? 6 : day - 1
})

const calendarDays = computed(() => {
    const days = []
    
    // Previous month days
    const prevMonthDays = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 0).getDate()
    for (let i = firstDayOfMonth.value - 1; i >= 0; i--) {
        days.push({
            date: prevMonthDays - i,
            isCurrentMonth: false,
            fullDate: getFullDate(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, prevMonthDays - i)
        })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth.value; i++) {
         days.push({
            date: i,
            isCurrentMonth: true,
            fullDate: getFullDate(currentDate.value.getFullYear(), currentDate.value.getMonth(), i)
        })
    }
    
    // Next month days to fill grid (42 cells total for 6 rows max)
    const remainingCells = 42 - days.length
    for (let i = 1; i <= remainingCells; i++) {
         days.push({
            date: i,
            isCurrentMonth: false,
             fullDate: getFullDate(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, i)
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

const prevMonth = () => {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const goToToday = () => {
    currentDate.value = new Date()
}

const handleEventClick = (date: string, time: string, type: string) => {
    if (type === 'AVAILABLE') {
        selectedDate.value = date
        selectedTime.value = time
        isModalOpen.value = true
    }
}

const handleModalSubmit = (data: any) => {
    console.log('Appointment Data:', data)
    alert('Appointment booked successfully! (Mock)')
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-4">
        <h2 class="text-2xl font-bold text-gray-900">{{ currentMonth }} {{ currentYear }}</h2>
         <div class="flex items-center gap-1">
            <button @click="prevMonth" class="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <ChevronLeft class="w-6 h-6 text-gray-600" />
            </button>
            <button @click="nextMonth" class="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <ChevronRight class="w-6 h-6 text-gray-600" />
            </button>
         </div>
      </div>
      
      <button 
        @click="goToToday"
        class="px-6 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Today
      </button>
    </div>

    <!-- Calendar Grid -->
    <div class="border border-gray-200 rounded-lg overflow-hidden">
        <!-- Days Header -->
        <div class="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
            <div 
                v-for="day in weekDays" 
                :key="day"
                class="py-3 px-4 text-xs font-bold text-gray-500 uppercase border-r border-gray-200 last:border-r-0"
            >
                {{ day }}
            </div>
        </div>

        <!-- Calendar Body -->
        <div class="grid grid-cols-7 bg-white">
            <div 
                v-for="(day, index) in calendarDays" 
                :key="index"
                class="min-h-[120px] p-2 border-b border-r border-gray-200 last:border-r-0 relative group hover:bg-gray-50 transition-colors"
                :class="{ 
                    'text-gray-900': day.isCurrentMonth, 
                    'text-gray-400 bg-gray-50/50': !day.isCurrentMonth,
                    'border-l-0': index % 7 === 0 // fix left border
                }"
            >
                <div class="flex justify-between items-start mb-2">
                    <span 
                        class="text-lg font-medium w-8 h-8 flex items-center justify-center rounded-full"
                         :class="{ 'bg-primary text-white': day.fullDate === getFullDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) }"
                    >
                        {{ day.date }}
                    </span>
                </div>

                <!-- Events -->
                <div class="space-y-1">
                    <div 
                        v-for="(event, eIndex) in events[day.fullDate] || []" 
                        :key="eIndex"
                        @click.stop="handleEventClick(day.fullDate, event.time, event.type)"
                        class="text-[10px] px-2 py-1 rounded-md font-medium text-white shadow-sm transition-opacity"
                        :class="{
                            'bg-[#00B027] hover:opacity-90 cursor-pointer': event.type === 'AVAILABLE',
                            'bg-[#EB7A52] cursor-not-allowed': event.type === 'PENDING'
                        }"
                    >
                        {{ event.time }} ({{ event.type === 'AVAILABLE' ? 'Available' : 'Pending' }})
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <FormAppointmentModal 
        :is-open="isModalOpen"
        :selected-date="selectedDate"
        :selected-time="selectedTime"
        @close="isModalOpen = false"
        @submit="handleModalSubmit"
    />
  </div>
</template>

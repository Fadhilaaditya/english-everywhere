<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import AppointmentModal from './AppointmentModal.vue'

const currentDate = ref(new Date(2025, 8, 1)) // September 2025
const selectedCourse = ref('Hi Kids!')

const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

// Mock data matching the screenshot
const appointments = [
    { id: 1, date: '2025-09-02', time: '13:00', name: 'Bima', status: 'taken' },
    { id: 2, date: '2025-09-09', time: '9:00', status: 'available' },
    { id: 3, date: '2025-09-09', time: '13:00', status: 'available' },
    { id: 4, date: '2025-09-11', time: '13:00', status: 'available' },
    { id: 5, date: '2025-09-11', time: '13:00', status: 'available' }, // Duplicate visual in screenshot?
    { id: 6, date: '2025-09-16', time: '21:00', status: 'available' },
    { id: 7, date: '2025-09-18', time: '08:00', name: 'Yoga', status: 'waiting' },
    { id: 8, date: '2025-09-18', time: '15:00', name: 'Budi', status: 'waiting' },
    { id: 9, date: '2025-09-24', time: '13:00', status: 'available' },
    { id: 10, date: '2025-09-21', time: '13:00', status: 'available' },
    { id: 11, date: '2025-09-21', time: '16:00', status: 'available' },
    { id: 12, date: '2025-09-24', time: '13:00', status: 'available' },
]

const isModalOpen = ref(false)
const selectedAppointment = ref<any>(null)

const handleAppointmentClick = (app: any) => {
    selectedAppointment.value = app
    isModalOpen.value = true
}

const handleModalApprove = (data: any) => {
    console.log('Approved:', data)
    alert('Appointment Approved/Updated!')
    isModalOpen.value = false
    // In real app, update appointment status here
}

const currentMonthYear = computed(() => {
    return currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' })
})

const calendarDays = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    
    // First day of the month
    const firstDayOfMonth = new Date(year, month, 1)
    // Last day of the month
    const lastDayOfMonth = new Date(year, month + 1, 0)
    
    // Get day of week (0-6, 0 is Sunday)
    // Adjust to Monday start (0=Mon, 6=Sun)
    let startDayDetails = firstDayOfMonth.getDay()
    let startDay = startDayDetails === 0 ? 6 : startDayDetails - 1
    
    const days = []
    
    // Previous month filler
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startDay - 1; i >= 0; i--) {
        days.push({
            date: new Date(year, month - 1, prevMonthLastDay - i),
            isCurrentMonth: false
        })
    }
    
    // Current month days
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        days.push({
            date: new Date(year, month, i),
            isCurrentMonth: true
        })
    }
    
    // Next month filler
    const remainingDays = 42 - days.length // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
        days.push({
            date: new Date(year, month + 1, i),
            isCurrentMonth: false
        })
    }
    
    return days
})

const getAppointmentsForDay = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return appointments.filter(app => app.date === dateString)
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
</script>

<template>
  <div class="bg-white p-6 rounded-lg">
    <!-- Controls -->
    <!-- Controls -->
    <div class="flex justify-between items-end mb-8">
        <div class="flex items-end gap-6">
            <div class="flex flex-col gap-2">
                <label class="text-sm text-gray-600 font-medium">Course</label>
                <div class="relative">
                     <select 
                        v-model="selectedCourse" 
                        class="appearance-none border border-gray-300 rounded-lg px-4 py-2 w-64 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#4FD1C5] bg-white cursor-pointer"
                    >
                        <option>Hi Kids!</option>
                        <option>Get Smart</option>
                    </select>
                    <!-- Custom Arrow for Select -->
                    <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
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

        <h2 class="text-2xl font-bold text-gray-900">{{ currentMonthYear }}</h2>
    </div>

    <!-- Calendar Grid -->
    <div class="border border-gray-200 rounded-lg overflow-hidden">
        <!-- Weekday Headers -->
        <div class="grid grid-cols-7 border-b border-gray-200">
            <div 
                v-for="day in weekDays" 
                :key="day"
                class="py-3 px-4 border-r border-gray-200 last:border-r-0 bg-gray-50 text-xs font-semibold text-gray-500 uppercase"
            >
                {{ day }}
            </div>
        </div>

        <!-- Days -->
        <div class="grid grid-cols-7">
            <div 
                v-for="(day, index) in calendarDays" 
                :key="index"
                class="min-h-[140px] border-r border-b border-gray-200 last:border-r-0 relative p-2 transition-colors hover:bg-gray-50/30"
                :class="{'!bg-gray-50/50 opacity-50': !day.isCurrentMonth, 'bg-blue-50/10': day.isCurrentMonth && day.date.getDate() === 9}"
            >
                <!-- Day Number -->
                <span class="text-lg font-medium text-gray-900 block mb-2">{{ day.date.getDate() }}</span>
                
                <!-- Appointments -->
                <div class="space-y-1.5">
                    <button 
                        v-for="app in getAppointmentsForDay(day.date)" 
                        :key="app.id"
                        @click="handleAppointmentClick(app)"
                        class="w-full text-left px-2 py-1 rounded text-xs font-medium text-white shadow-sm hover:opacity-80 transition-opacity"
                        :class="{
                            'bg-[#BCC1C9]': app.status === 'taken',
                            'bg-[#0FB728]': app.status === 'available',
                            'bg-[#E67E22]': app.status === 'waiting'
                        }"
                    >
                        {{ app.time }} {{ app.name ? `(${app.name})` : '' }}
                    </button>
                </div>

                <!-- Active Day Indicator (Mock for day 9 in screenshot) -->
                 <div v-if="day.isCurrentMonth && day.date.getDate() === 9" class="absolute inset-0 border-2 border-blue-500 pointer-events-none"></div>
            </div>
        </div>
    </div>

    <!-- Legend -->
    <div class="flex items-center gap-8 mt-6">
        <div class="flex items-center gap-3">
            <div class="w-12 h-4 bg-[#E67E22] rounded"></div>
            <span class="text-sm text-gray-600">Waiting for Approval</span>
        </div>
        <div class="flex items-center gap-3">
            <div class="w-12 h-4 bg-[#0FB728] rounded"></div>
            <span class="text-sm text-gray-600">Available</span>
        </div>
         <div class="flex items-center gap-3">
            <div class="w-12 h-4 bg-[#BCC1C9] rounded"></div>
            <span class="text-sm text-gray-600">Taken</span>
        </div>
    </div>

    <!-- Modal -->
    <AppointmentModal 
        :is-open="isModalOpen"
        :appointment="selectedAppointment"
        @close="isModalOpen = false"
        @approve="handleModalApprove"
    />
  </div>
</template>

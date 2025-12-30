<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import FormAppointmentModal from './FormAppointmentModal.vue'
import DayDetailsModal from './DayDetailsModal.vue'
import Toast from '@/components/Toast.vue'

const route = useRoute()
const programId = computed(() => route.query.programId)

const currentDate = ref(new Date())
const isModalOpen = ref(false)
const selectedSchedule = ref<any>(null)
const isDayModalOpen = ref(false)
const selectedDayDate = ref<string>('')
const selectedDayEvents = ref<any[]>([])

// Toast state
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')
const showToastNotification = (message: string, type: 'success' | 'error' = 'success') => {
    toastMessage.value = message
    toastType.value = type
    showToast.value = true
}

// Events state
const events = ref<Record<string, { id: number, type: 'AVAILABLE' | 'PENDING' | 'BOOKED', time: string, name?: string }[]>>({})

const fetchSchedules = async () => {
  if (!programId.value) return;

  try {
    const response = await fetch(`http://localhost:3000/api/programs/${programId.value}/schedules?t=${new Date().getTime()}`)
    if (!response.ok) throw new Error('Failed to fetch schedules')
    const data = await response.json()
    
    // Transform API data to events object matching component structure
    // API returns: [{ date: '2025-09-08', time: '09:00', status: 'AVAILABLE' }]
    const newEvents: any = {}
    data.forEach((schedule: any) => {
      const status = schedule.status ? schedule.status.trim().toUpperCase() : ''
      if (status === 'ACCEPTED') return

      if (!newEvents[schedule.date]) {
        newEvents[schedule.date] = []
      }
      newEvents[schedule.date].push({
        id: schedule.id,
        type: schedule.status, 
        time: schedule.time,
        name: schedule.applicantName
      })
    })
    events.value = newEvents
  } catch (error) {
    console.error('Error fetching schedules:', error)
  }
}

let pollingInterval: any = null

onMounted(() => {
  fetchSchedules()
  // Poll every 3 seconds for real-time updates
  pollingInterval = setInterval(fetchSchedules, 3000)
})

onUnmounted(() => {
    if (pollingInterval) clearInterval(pollingInterval)
})

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

const openDayModal = (date: string, events: any[]) => {
    selectedDayDate.value = date
    selectedDayEvents.value = events
    isDayModalOpen.value = true
}

const handleEventClick = (date: string, time: string, type: string, id: number) => {
    // Allow clicking AVAILABLE and BOOKED (for read-only view)
    if (type === 'AVAILABLE' || type === 'BOOKED') {
        selectedSchedule.value = {
            id: id,
            date: date,
            time: time,
            programName: 'Program', // ideally fetch program name too or pass it
            status: type // Pass status to modal to handle read-only state
        }
        isModalOpen.value = true
    }
}

const handleModalSubmit = async (payload: any) => {
    if (!programId.value || !selectedSchedule.value) return

    try {
        const response = await fetch(`http://localhost:3000/api/programs/${programId.value}/schedules/${selectedSchedule.value.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })

        if (!response.ok) {
            const err = await response.json()
            throw new Error(err.message || 'Failed to book')
        }

        showToastNotification('Registration successful! Waiting for admin approval.')
        isModalOpen.value = false
        fetchSchedules() // Refresh calendar
    } catch (e: any) {
        showToastNotification(e.message, 'error')
    }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-4">
        <h2 class="text-2xl font-bold text-gray-900 w-64">{{ currentMonth }} {{ currentYear }}</h2>
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
                        v-for="(event, eIndex) in (events[day.fullDate] || []).slice(0, 1)" 
                        :key="eIndex"
                        @click.stop="handleEventClick(day.fullDate, event.time, event.type, event.id)"
                        class="text-[10px] px-2 py-1 rounded-md font-medium text-white shadow-sm transition-opacity"
                        :class="{
                            'bg-[#00B027] hover:opacity-90 cursor-pointer': event.type === 'AVAILABLE',
                            'bg-[#EB7A52] cursor-not-allowed': event.type === 'PENDING',
                            'bg-[#BCC1C9] hover:opacity-90 cursor-pointer': event.type === 'BOOKED'
                        }"
                    >
                        {{ event.time }} 
                        <span v-if="event.name">({{ event.name }})</span>
                        <span v-else>({{ event.type === 'AVAILABLE' ? 'Available' : event.type === 'PENDING' ? 'Waiting' : 'Booked' }})</span>
                    </div>
                     <!-- Show +N more if there are additional events -->
                    <div 
                        v-if="(events[day.fullDate] || []).length > 1"
                        class="text-xs text-gray-500 font-medium px-1 hover:text-gray-700 hover:bg-gray-100 rounded cursor-pointer mt-1"
                        @click.stop="openDayModal(day.fullDate, events[day.fullDate] || [])"
                    >
                        +{{ (events[day.fullDate] || []).length - 1 }} more
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <FormAppointmentModal 
        :is-open="isModalOpen"
        :schedule="selectedSchedule"
        @close="isModalOpen = false"
        @submit="handleModalSubmit"
    />

    <DayDetailsModal
        :is-open="isDayModalOpen"
        :date="selectedDayDate"
        :events="selectedDayEvents"
        @close="isDayModalOpen = false"
        @click-event="(e) => { isDayModalOpen = false; handleEventClick(selectedDayDate, e.time, e.type, e.id) }"
    />

    <Toast 
        :show="showToast" 
        :message="toastMessage" 
        :type="toastType"
        @close="showToast = false"
    />
  </div>
</template>

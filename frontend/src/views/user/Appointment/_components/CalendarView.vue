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
    const response = await fetch(`http://localhost:3001/api/programs/${programId.value}/schedules?t=${new Date().getTime()}`)
    if (!response.ok) throw new Error('Failed to fetch schedules')
    const data = await response.json()
    
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
        name: schedule.applicantName,
        applicantName: schedule.applicantName,
        applicantGender: schedule.applicantGender,
        applicantAddress: schedule.applicantAddress,
        applicantFather: schedule.applicantFather,
        applicantMother: schedule.applicantMother,
        applicantBirthPlace: schedule.applicantBirthPlace,
        applicantBirthDate: schedule.applicantBirthDate,
        applicantPhone: schedule.applicantPhone,
        applicantEmail: schedule.applicantEmail
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
    const day = new Date(year, month, 1).getDay()
    return day === 0 ? 6 : day - 1
})

const calendarDays = computed(() => {
    const days = []
    const prevMonthDays = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 0).getDate()
    for (let i = firstDayOfMonth.value - 1; i >= 0; i--) {
        days.push({
            date: prevMonthDays - i,
            isCurrentMonth: false,
            fullDate: getFullDate(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, prevMonthDays - i)
        })
    }
    for (let i = 1; i <= daysInMonth.value; i++) {
         days.push({
            date: i,
            isCurrentMonth: true,
            fullDate: getFullDate(currentDate.value.getFullYear(), currentDate.value.getMonth(), i)
        })
    }
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

const prevMonth = () => { currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1) }
const nextMonth = () => { currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1) }
const goToToday = () => { currentDate.value = new Date() }

const openDayModal = (date: string, events: any[]) => {
    selectedDayDate.value = date
    selectedDayEvents.value = events
    isDayModalOpen.value = true
}

const handleEventClick = (date: string, time: string, type: string, id: number, eventData?: any) => {
    if (type === 'AVAILABLE' || type === 'BOOKED' || type === 'PENDING') {
        selectedSchedule.value = { 
            id, 
            date, 
            time, 
            programName: 'Program', 
            status: type, 
            ...eventData 
        }
        isModalOpen.value = true
    }
}

const handleModalSubmit = async (payload: any) => {
    if (!programId.value || !selectedSchedule.value) return
    try {
        const response = await fetch(`http://localhost:3001/api/programs/${programId.value}/schedules/${selectedSchedule.value.id}`, {
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
        fetchSchedules()
    } catch (e: any) {
        showToastNotification(e.message, 'error')
    }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-2 md:p-6">
    <!-- Header -->
    <div class="flex flex-row items-center justify-between mb-4 md:mb-8 gap-2">
       <div class="flex items-center gap-2">
            <div class="flex bg-gray-100 rounded-lg p-1">
                <button @click="prevMonth" class="p-1 sm:p-2 hover:bg-white rounded-md transition-all shadow-sm">
                    <ChevronLeft class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </button>
                <button @click="nextMonth" class="p-1 sm:p-2 hover:bg-white rounded-md transition-all shadow-sm">
                    <ChevronRight class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </button>
            </div>
            <h2 class="text-sm sm:text-lg md:text-2xl font-bold text-gray-900 uppercase tracking-wide">{{ currentMonth }} {{ currentYear }}</h2>
       </div>
      
      <button 
        @click="goToToday"
        class="hidden md:block px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Today
      </button>
       <!-- Mobile Today Button (Icon or smaller) -->
        <button 
            @click="goToToday"
            class="md:hidden px-3 py-1 bg-gray-100 rounded text-xs font-bold text-gray-600"
        >
            Today
        </button>
    </div>

    <!-- Calendar Grid -->
    <div class="border border-gray-200 rounded-lg overflow-hidden">
          <!-- Days Header -->
          <div class="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
            <div v-for="day in weekDays" :key="day" class="py-2 sm:py-3 text-center text-[10px] sm:text-xs font-bold text-gray-500 uppercase border-r border-gray-200 last:border-r-0">
                {{ day }}
            </div>
          </div>

          <div class="grid grid-cols-7 bg-white">
            <div 
                v-for="(day, index) in calendarDays" 
                :key="index"
                class="min-h-[80px] sm:min-h-[120px] p-1 sm:p-2 border-b border-r border-gray-200 last:border-r-0 relative group hover:bg-gray-50 transition-colors"
                :class="{ 'text-gray-900': day.isCurrentMonth, 'text-gray-400 bg-gray-50/50': !day.isCurrentMonth }"
                @click="openDayModal(day.fullDate, events[day.fullDate] || [])"
            >
                <div class="flex justify-end sm:justify-between items-start mb-1 sm:mb-2">
                    <span 
                        class="text-xs sm:text-lg font-medium w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full"
                        :class="{ 'bg-primary text-white': day.fullDate === getFullDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) }"
                    >
                        {{ day.date }}
                    </span>
                </div>

                <!-- Events -->
                <div class="space-y-1">
                    <!-- MOBILE VIEW: Condensed -->
                    <div class="md:hidden flex flex-col items-center">
                        <template v-if="(events[day.fullDate] || []).length > 0">
                             <!-- Show first event time only -->
                             <div 
                                class="text-[10px] px-1 py-0.5 rounded text-white font-bold w-full text-center truncate mb-0.5"
                                :class="{
                                    'bg-[#00B027]': (events[day.fullDate] || [])[0]?.type === 'AVAILABLE',
                                    'bg-[#EB7A52]': (events[day.fullDate] || [])[0]?.type === 'PENDING',
                                    'bg-[#BCC1C9]': (events[day.fullDate] || [])[0]?.type === 'BOOKED'
                                }"
                                @click.stop="handleEventClick(day.fullDate, (events[day.fullDate] || [])[0]?.time || '', (events[day.fullDate] || [])[0]?.type || '', (events[day.fullDate] || [])[0]?.id || 0, (events[day.fullDate] || [])[0])"
                             >
                                {{ (events[day.fullDate] || [])[0]?.time }}
                             </div>
                             <!-- Count (+N) -->
                             <span v-if="(events[day.fullDate] || []).length > 1" class="text-[10px] text-gray-500 font-bold">
                                +{{ (events[day.fullDate] || []).length - 1 }}
                             </span>
                        </template>
                    </div>

                    <!-- DESKTOP VIEW: Detailed list -->
                    <div class="hidden md:block space-y-1">
                        <div 
                            v-for="(event, eIndex) in (events[day.fullDate] || []).slice(0, 2)" 
                            :key="eIndex"
                            @click.stop="handleEventClick(day.fullDate, event.time, event.type, event.id, event)"
                            class="text-[10px] px-2 py-1 rounded-md font-medium text-white shadow-sm transition-opacity truncate"
                            :class="{
                                'bg-[#00B027] hover:opacity-90 cursor-pointer': event.type === 'AVAILABLE',
                                'bg-[#EB7A52] hover:opacity-90 cursor-pointer': event.type === 'PENDING',
                                'bg-[#BCC1C9] hover:opacity-90 cursor-pointer': event.type === 'BOOKED'
                            }"
                        >
                            {{ event.time }} 
                            <span v-if="event.name">({{ event.name }})</span>
                            <span v-else>({{ event.type === 'AVAILABLE' ? 'Avl' : event.type === 'PENDING' ? 'Wait' : 'Bkd' }})</span>
                        </div>
                         <!-- Show +N more if there are additional events -->
                        <div 
                            v-if="(events[day.fullDate] || []).length > 2"
                            class="text-xs text-gray-500 font-medium px-1 hover:text-gray-700 hover:bg-gray-100 rounded cursor-pointer mt-1 text-center"
                            @click.stop="openDayModal(day.fullDate, events[day.fullDate] || [])"
                        >
                            +{{ (events[day.fullDate] || []).length - 2 }} more
                        </div>
                    </div>
                </div>
            </div>
          </div>
      </div>
    
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

    <Toast :show="showToast" :message="toastMessage" :type="toastType" @close="showToast = false" />
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import AppointmentModal from './AppointmentModal.vue'
import CreateScheduleModal from './CreateScheduleModal.vue'
import ConfirmModal from './ConfirmModal.vue'
import DayDetailsModal from './DayDetailsModal.vue'
import Toast from '@/components/Toast.vue'

// --- State Management ---
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

const isConfirmOpen = ref(false)
const isProcessing = ref(false)
const isModalOpen = ref(false)
const isCreateModalOpen = ref(false)
const selectedDayEvents = ref<any[]>([])
const selectedDayDate = ref<Date | string>(new Date())
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
const isDayModalOpen = ref(false)

// Confirm Modal State
const confirmModalState = ref({
    title: '',
    message: '',
    confirmText: 'Confirm',
    type: 'danger' as 'danger' | 'warning' | 'info',
    action: null as (() => Promise<void>) | null
})

const currentDate = ref(new Date())
const programs = ref<any[]>([])
const appointments = ref<any[]>([])
const selectedAppointment = ref<any>(null)
const selectedDateForCreation = ref('')

const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

// --- Helper Functions ---
const showToastNotification = (message: string, type: 'success' | 'error' = 'success') => {
    toastMessage.value = message
    toastType.value = type
    showToast.value = true
}

// --- Event Handlers ---
const openDayModal = (date: Date, events: any[]) => {
    selectedDayDate.value = date
    selectedDayEvents.value = events
    isDayModalOpen.value = true
}

// --- API Actions ---
const fetchSchedules = async () => {
    try {
        const response = await fetch(`${API_URL}/programs/schedules/global?t=${new Date().getTime()}`)
        if (response.ok) {
            const data = await response.json()
            appointments.value = data
                .filter((item: any) => {
                    const status = item.status ? item.status.trim().toUpperCase() : ''
                    return status !== 'ACCEPTED'
                })
                .map((item: any) => {
                    const bookedCount = item.bookings ? item.bookings.filter((b: any) => b.status !== 'REJECTED').length : 0
                    const isFull = bookedCount >= item.maxSlots
                    
                    return {
                        ...item,
                        status: isFull ? 'booked' : 'available',
                        name: `${bookedCount}/${item.maxSlots} Slots`,
                    }
                })
        }
    } catch (e) {
        console.error('Failed to fetch schedules', e)
    }
}

const fetchPrograms = async () => {
    try {
        const response = await fetch(`${API_URL}/programs`)
        if (response.ok) {
            programs.value = await response.json()
            // No longer forcing selectedCourseId
        }
    } catch (e) {
        console.error('Failed to fetch programs', e)
    }
}

// --- Event Handlers ---
const handleScheduleCreated = () => {
    showToastNotification('Schedule Created Successfully!')
    fetchSchedules()
}

const handleDayClick = (day: any) => {
    const year = day.date.getFullYear()
    const month = String(day.date.getMonth() + 1).padStart(2, '0')
    const date = String(day.date.getDate()).padStart(2, '0')
    selectedDateForCreation.value = `${year}-${month}-${date}`
    isCreateModalOpen.value = true
}

const handleAppointmentClick = (app: any) => {
    selectedAppointment.value = app
    isModalOpen.value = true
}

const handleModalDelete = () => {
    confirmModalState.value = {
        title: 'Delete Schedule',
        message: 'Are you sure you want to delete this schedule?',
        confirmText: 'Delete',
        type: 'danger',
        action: executeDelete
    }
    isConfirmOpen.value = true
}

const executeDelete = async () => {
    if (!selectedAppointment.value) return
    try {
        const response = await fetch(`${API_URL}/programs/schedules/${selectedAppointment.value.id}`, {
            method: 'DELETE'
        })
        if (!response.ok) throw new Error('Failed to delete')

        showToastNotification('Schedule Deleted Successfully!')
        isModalOpen.value = false
        fetchSchedules()
    } catch (e: any) {
        throw e // Let the wrapper handle the error
    }
}

const handleModalApprove = (data: any) => {
    confirmModalState.value = {
        title: 'Approve Appointment',
        message: 'Are you sure you want to approve this appointment? This will confirm the booking.',
        confirmText: 'Approve',
        type: 'info',
        action: () => executeApprove(data)
    }
    isConfirmOpen.value = true
}

const executeApprove = async (data: any) => {
    if (!data.id) return
    try {
        const response = await fetch(`${API_URL}/programs/bookings/${data.id}/approve`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        if (!response.ok) throw new Error('Failed to approve')

        showToastNotification('Appointment Approved Successfully!')
        isModalOpen.value = false
        fetchSchedules()
    } catch (e: any) {
        throw e
    }
}

const handleModalUpdate = (data: any) => {
    confirmModalState.value = {
        title: 'Save Changes',
        message: 'Are you sure you want to save these changes? This will update the schedule time and date.',
        confirmText: 'Save',
        type: 'info',
        action: () => executeUpdate(data)
    }
    isConfirmOpen.value = true
}

const executeUpdate = async (data: any) => {
    try {
        const response = await fetch(`${API_URL}/programs/schedules/${data.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ time: data.time, date: data.date, maxSlots: data.maxSlots })
        })
        if (!response.ok) throw new Error('Failed to update')
        
        showToastNotification('Schedule Updated Successfully!')
        isModalOpen.value = false
        fetchSchedules()
    } catch (e: any) {
        throw e
    }
}

const handleModalReject = (id: number) => {
    confirmModalState.value = {
        title: 'Reject Booking',
        message: 'Are you sure you want to reject this specific booking? The slot quota will be restored.',
        confirmText: 'Reject',
        type: 'danger',
        action: () => executeReject(id)
    }
    isConfirmOpen.value = true
}

const executeReject = async (id: number) => {
    try {
        const response = await fetch(`${API_URL}/programs/bookings/${id}/reject`, {
            method: 'PUT'
        })
        if (!response.ok) throw new Error('Failed to reject booking')
        
        showToastNotification('Booking Rejected Successfully!')
        isModalOpen.value = false
        fetchSchedules()
    } catch (e: any) {
        throw e
    }
}

const handleConfirmAction = async () => {
    if (!confirmModalState.value.action) return
    
    isProcessing.value = true
    try {
        await confirmModalState.value.action()
        isConfirmOpen.value = false // Only close on success
    } catch (e: any) {
        showToastNotification(e.message, 'error')
    } finally {
        isProcessing.value = false
    }
}

// --- Calendar Logic ---
const currentMonthYear = computed(() => {
    return currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' })
})

const calendarDays = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    
    const startDayDetails = firstDayOfMonth.getDay()
    const startDay = startDayDetails === 0 ? 6 : startDayDetails - 1
    
    const days = []
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startDay - 1; i >= 0; i--) {
        days.push({ date: new Date(year, month - 1, prevMonthLastDay - i), isCurrentMonth: false })
    }
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        days.push({ date: new Date(year, month, i), isCurrentMonth: true })
    }
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
        days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false })
    }
    return days
})

const getAppointmentsForDay = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    const dateString = `${year}-${month}-${d}`
    return appointments.value.filter(app => {
        return app.date === dateString && ['available', 'waiting', 'booked', 'taken'].includes(app.status)
    })
}

const prevMonth = () => { currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1) }
const nextMonth = () => { currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1) }
const goToToday = () => { 
    currentDate.value = new Date() 
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const date = String(today.getDate()).padStart(2, '0')
    selectedDateForCreation.value = `${year}-${month}-${date}`
    isCreateModalOpen.value = true
}

// --- Lifecycle & Watchers ---
let pollingInterval: any = null

onMounted(() => {
    fetchPrograms()
    fetchSchedules() // Call once immediately
    // Poll every 3 seconds for real-time updates
    pollingInterval = setInterval(fetchSchedules, 3000)
})

onUnmounted(() => {
    if (pollingInterval) clearInterval(pollingInterval)
})
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
            <h2 class="text-sm sm:text-lg md:text-2xl font-bold text-gray-900 uppercase tracking-wide">{{ currentMonthYear }}</h2>
       </div>
      
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1.5">
            <div class="w-3 h-3 bg-[#0FB728] rounded-full"></div>
            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Available</span>
          </div>
          <div class="flex items-center gap-1.5">
            <div class="w-3 h-3 bg-[#BCC1C9] rounded-full"></div>
            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full</span>
          </div>
        </div>

        <button 
          @click="goToToday"
          class="hidden md:block px-6 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
        >
          Today
        </button>
      </div>
       <!-- Mobile Today Button (Icon or smaller) -->
        <button 
            @click="goToToday"
            class="md:hidden px-3 py-1 bg-gray-100 rounded text-xs font-bold text-gray-600"
        >
            Today
        </button>
    </div>

    <div class="border border-gray-200 rounded-lg overflow-hidden">
        <div class="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
            <div v-for="day in weekDays" :key="day" class="py-2 sm:py-3 text-center text-[10px] sm:text-xs font-bold text-gray-500 uppercase border-r border-gray-200 last:border-r-0">
                {{ day }}
            </div>
        </div>

        <div class="grid grid-cols-7 bg-white">
            <div 
                v-for="(day, index) in calendarDays" 
                :key="index"
                @click="handleDayClick(day)"
                class="min-h-[80px] sm:min-h-[120px] p-1 sm:p-2 border-b border-r border-gray-200 last:border-r-0 relative group transition-colors"
                :class="{'bg-gray-50/50 opacity-50': !day.isCurrentMonth, 'cursor-pointer hover:bg-[#F0FFF4]': day.isCurrentMonth}"
            >
                <div class="flex justify-end sm:justify-between items-start mb-1 sm:mb-2">
                    <span 
                        class="text-xs sm:text-lg font-medium w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full"
                        :class="{ 'bg-[#52D3C4] text-white': day.date.toDateString() === new Date().toDateString() }"
                    >
                        {{ day.date.getDate() }}
                    </span>
                </div>

                <!-- Events -->
                <div class="space-y-1">
                    <!-- MOBILE VIEW: Condensed -->
                    <div class="md:hidden flex flex-col items-center">
                        <template v-if="getAppointmentsForDay(day.date).length > 0">
                             <!-- Show first event time only -->
                             <div 
                                class="text-[10px] px-1 py-0.5 rounded text-white font-bold w-full text-center truncate mb-0.5"
                                :class="{
                                    'bg-[#0FB728]': getAppointmentsForDay(day.date)[0]?.status === 'available',
                                    'bg-[#BCC1C9]': getAppointmentsForDay(day.date)[0]?.status === 'booked'
                                }"
                                @click.stop="handleAppointmentClick(getAppointmentsForDay(day.date)[0])"
                             >
                                {{ getAppointmentsForDay(day.date)[0]?.time }}
                             </div>
                             <!-- Count (+N) -->
                             <span v-if="getAppointmentsForDay(day.date).length > 1" class="text-[10px] text-gray-500 font-bold">
                                +{{ getAppointmentsForDay(day.date).length - 1 }}
                             </span>
                        </template>
                    </div>

                    <!-- DESKTOP VIEW: Detailed list -->
                    <div class="hidden md:block space-y-1">
                        <div 
                            v-for="(app, eIndex) in getAppointmentsForDay(day.date).slice(0, 2)" 
                            :key="eIndex"
                            @click.stop="handleAppointmentClick(app)"
                            class="text-[10px] px-2 py-1 rounded-md font-medium text-white shadow-sm transition-opacity truncate"
                            :class="{
                                'bg-[#0FB728] hover:opacity-90 cursor-pointer': app.status === 'available',
                                'bg-[#BCC1C9] hover:opacity-90 cursor-pointer': app.status === 'booked'
                            }"
                        >
                            {{ app.time }} 
                            <span v-if="app.name">({{ app.name }})</span>
                            <span v-else>({{ app.status === 'available' ? 'Avl' : 'Bkd' }})</span>
                        </div>
                         <!-- Show +N more if there are additional events -->
                        <div 
                            v-if="getAppointmentsForDay(day.date).length > 2"
                            class="text-xs text-gray-500 font-medium px-1 hover:text-gray-700 hover:bg-gray-100 rounded cursor-pointer mt-1 text-center"
                            @click.stop="openDayModal(day.date, getAppointmentsForDay(day.date))"
                        >
                            +{{ getAppointmentsForDay(day.date).length - 2 }} more
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <AppointmentModal 
        :is-open="isModalOpen"
        :program-name="'Global Schedule'"
        :appointment="selectedAppointment"
        @close="isModalOpen = false"
        @approve="handleModalApprove"
        @update="handleModalUpdate"
        @delete="handleModalDelete"
        @reject="handleModalReject"
    />

    <CreateScheduleModal 
        :is-open="isCreateModalOpen"
        :program-id="null"
        :program-name="'Global Schedule'"
        :initial-date="selectedDateForCreation"
        @close="isCreateModalOpen = false"
        @submit="handleScheduleCreated"
    />

    <DayDetailsModal
        :is-open="isDayModalOpen"
        :date="selectedDayDate"
        :events="selectedDayEvents"
        @close="isDayModalOpen = false"
        @click-event="(e) => { isDayModalOpen = false; handleAppointmentClick(e) }"
    />

    <ConfirmModal 
        :is-open="isConfirmOpen"
        :title="confirmModalState.title"
        :message="confirmModalState.message"
        :confirm-text="confirmModalState.confirmText"
        :type="confirmModalState.type"
        :is-loading="isProcessing"
        @close="isConfirmOpen = false"
        @confirm="handleConfirmAction"
    />

    <Toast :show="showToast" :message="toastMessage" :type="toastType" @close="showToast = false" />
  </div>
</template>
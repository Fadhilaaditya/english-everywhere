<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import AppointmentModal from './AppointmentModal.vue'
import CreateScheduleModal from './CreateScheduleModal.vue'
import ConfirmModal from './ConfirmModal.vue'
import Toast from '@/components/Toast.vue'

// --- State Management ---
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

const isConfirmOpen = ref(false)
const isProcessing = ref(false)
const isModalOpen = ref(false)
const isCreateModalOpen = ref(false)

// Confirm Modal State
const confirmModalState = ref({
    title: '',
    message: '',
    confirmText: 'Confirm',
    type: 'danger' as 'danger' | 'warning' | 'info',
    action: null as (() => Promise<void>) | null
})

const currentDate = ref(new Date())
const selectedCourseId = ref<number | null>(null)
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

// --- API Actions ---
const fetchSchedules = async () => {
    if (!selectedCourseId.value) return
    try {
        const response = await fetch(`http://localhost:3000/api/programs/${selectedCourseId.value}/schedules?t=${new Date().getTime()}`)
        if (response.ok) {
            const data = await response.json()
            appointments.value = data
                .filter((item: any) => {
                    const status = item.status ? item.status.trim().toUpperCase() : ''
                    return status !== 'ACCEPTED'
                }) // Hide accepted/completed schedules
                .map((item: any) => {
                    let status = item.status.toLowerCase()
                    if (status === 'pending') status = 'waiting'
                    return {
                        ...item,
                        status: status,
                        name: item.applicantName || (item.status === 'BOOKED' ? 'Booked User' : undefined),
                    }
                })
        }
    } catch (e) {
        console.error('Failed to fetch schedules', e)
    }
}

const fetchPrograms = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/programs')
        if (response.ok) {
            programs.value = await response.json()
            if (programs.value.length > 0 && !selectedCourseId.value) {
                selectedCourseId.value = programs.value[0].id
            }
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
    if (!selectedCourseId.value || !selectedAppointment.value) return
    try {
        const response = await fetch(`http://localhost:3000/api/programs/${selectedCourseId.value}/schedules/${selectedAppointment.value.id}`, {
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
    if (!selectedCourseId.value || !selectedAppointment.value) return
    try {
        const response = await fetch(`http://localhost:3000/api/programs/${selectedCourseId.value}/schedules/${selectedAppointment.value.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                status: 'BOOKED',
                applicantName: data.fullName,
                applicantGender: data.gender,
                applicantAddress: data.address,
                applicantPhone: data.phone,
                applicantEmail: data.email,
                applicantBirthDate: data.birthDate,
                applicantFather: data.fatherName,
                applicantMother: data.motherName,
                applicantBirthPlace: data.birthPlace
            })
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
    if (!selectedCourseId.value) return
    try {
        const response = await fetch(`http://localhost:3000/api/programs/${selectedCourseId.value}/schedules/${data.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ time: data.time, date: data.date })
        })
        if (!response.ok) throw new Error('Failed to update')
        
        showToastNotification('Schedule Updated Successfully!')
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
    
    let startDayDetails = firstDayOfMonth.getDay()
    let startDay = startDayDetails === 0 ? 6 : startDayDetails - 1
    
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
const goToToday = () => { currentDate.value = new Date() }

// --- Lifecycle & Watchers ---
onMounted(() => {
    fetchPrograms()
})

watch(selectedCourseId, () => {
    fetchSchedules()
})
</script>

<template>
  <div class="bg-white p-6 rounded-lg">
    <div class="flex justify-between items-end mb-8">
        <div class="flex items-end gap-6">
            <div class="flex flex-col gap-2">
                <label class="text-sm text-gray-600 font-medium">Course</label>
                <div class="relative">
                     <select 
                        v-model="selectedCourseId" 
                        class="appearance-none border border-gray-300 rounded-lg px-4 py-2 w-64 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#4FD1C5] bg-white cursor-pointer"
                    >
                        <option v-for="program in programs" :key="program.id" :value="program.id">
                            {{ program.title }}
                        </option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>
            
            <button @click="goToToday" class="border border-gray-300 rounded-lg px-8 py-2 text-gray-700 font-medium hover:bg-gray-50 transition-colors h-[42px]">
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

    <div class="border border-gray-200 rounded-lg overflow-hidden">
        <div class="grid grid-cols-7 border-b border-gray-200">
            <div v-for="day in weekDays" :key="day" class="py-3 px-4 border-r border-gray-200 last:border-r-0 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                {{ day }}
            </div>
        </div>

        <div class="grid grid-cols-7">
            <div 
                v-for="(day, index) in calendarDays" 
                :key="index"
                @click="handleDayClick(day)"
                class="min-h-[140px] border-r border-b border-gray-200 last:border-r-0 relative p-2 transition-colors hover:bg-gray-50/30 cursor-pointer"
                :class="{'!bg-gray-50/50 opacity-50': !day.isCurrentMonth}"
            >
                <span class="text-lg font-medium text-gray-900 block mb-2">{{ day.date.getDate() }}</span>
                <div class="space-y-1.5">
                    <button 
                        v-for="app in getAppointmentsForDay(day.date)" 
                        :key="app.id"
                        @click.stop="handleAppointmentClick(app)"
                        class="w-full text-left px-2 py-1 rounded text-xs font-medium text-white shadow-sm hover:opacity-80 transition-opacity"
                        :class="{
                            'bg-[#BCC1C9]': app.status === 'taken' || app.status === 'booked',
                            'bg-[#0FB728]': app.status === 'available',
                            'bg-[#E67E22]': app.status === 'waiting'
                        }"
                    >
                        {{ app.time }} {{ app.name ? `(${app.name})` : '' }}
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="flex items-center gap-8 mt-6">
        <div class="flex items-center gap-3"><div class="w-12 h-4 bg-[#E67E22] rounded"></div><span class="text-sm text-gray-600">Waiting</span></div>
        <div class="flex items-center gap-3"><div class="w-12 h-4 bg-[#0FB728] rounded"></div><span class="text-sm text-gray-600">Available</span></div>
        <div class="flex items-center gap-3"><div class="w-12 h-4 bg-[#BCC1C9] rounded"></div><span class="text-sm text-gray-600">Taken</span></div>
    </div>

    <AppointmentModal 
        :is-open="isModalOpen"
        :program-name="programs.find(p => p.id === selectedCourseId)?.title"
        :appointment="selectedAppointment"
        @close="isModalOpen = false"
        @approve="handleModalApprove"
        @update="handleModalUpdate"
        @delete="handleModalDelete"
    />

    <CreateScheduleModal 
        :is-open="isCreateModalOpen"
        :program-id="selectedCourseId"
        :program-name="programs.find(p => p.id === selectedCourseId)?.title || ''"
        :initial-date="selectedDateForCreation"
        @close="isCreateModalOpen = false"
        @submit="handleScheduleCreated"
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
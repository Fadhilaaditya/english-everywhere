<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Calendar as CalendarIcon, Loader2 } from 'lucide-vue-next'
import TeacherScheduleService, { type Schedule } from '../../../services/TeacherScheduleService'
import ScheduleCalendar from './_components/ScheduleCalendar.vue'
import ScheduleList from './_components/ScheduleList.vue'

// State
const classes = ref<any[]>([])
const isLoading = ref(true)
const errorMessage = ref('')
const currentDate = ref(new Date())

const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' })
})

const prevMonth = () => {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const fetchSchedules = async () => {
    isLoading.value = true
    errorMessage.value = ''
    try {
        const schedules = await TeacherScheduleService.getMySchedules()
        
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        
        classes.value = schedules.map((schedule: any) => {
            const dateObj = schedule.date ? new Date(schedule.date) : new Date()
            const dayName = days[dateObj.getDay()] || 'Unknown'
            const monthName = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
            
            return {
                id: schedule.id,
                date: schedule.date,
                day: dayName,
                month: monthName,
                time: `${(schedule.startTime || '00:00:00').slice(0,5)} - ${(schedule.endTime || '00:00:00').slice(0,5)}`,
                subject: schedule.program ? schedule.program.title || schedule.program.name : schedule.className || 'No Program',
                room: 'Online Class',
                status: 'Available' // Default because status field was removed
            }
        })
    } catch (error) {
        console.error(error)
        errorMessage.value = 'Failed to load schedules. Please try again.'
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchSchedules()
})
</script>

<template>
  <div class="p-8 bg-[#F8F9FA] min-h-screen font-sans">
    <div class="flex items-start justify-between mb-8">
      <div class="flex items-center gap-3">
        <div class="p-4 bg-white rounded-2xl shadow-sm">
          <CalendarIcon class="w-8 h-8 text-[#4CC9C0]" />
        </div>
        <div>
          <h1 class="text-3xl font-bold text-[#2D3748]">Jadwal Mengajar</h1>
          <p class="text-gray-500 text-sm">Lihat jadwal mengajar Anda yang telah ditetapkan.</p>
        </div>
      </div>

      <div class="hidden md:block">
          <div class="bg-[#EDF2FF] text-[#4C51BF] px-4 py-2 rounded-xl text-xs font-medium border border-[#C5D0FF]">
              *Hubungi admin untuk perubahan jadwal
          </div>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center h-64">
        <Loader2 class="w-8 h-8 text-[#4CC9C0] animate-spin" />
    </div>

    <div v-else-if="errorMessage" class="p-4 bg-red-50 text-red-600 rounded-xl text-center">
        {{ errorMessage }}
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div class="lg:col-span-8">
        <ScheduleCalendar 
          :classes="classes"
          :current-date="currentDate"
          @prev="prevMonth"
          @next="nextMonth"
        />
      </div>

      <div class="lg:col-span-4">
        <ScheduleList :classes="classes" />
      </div>
    </div>
  </div>
</template>

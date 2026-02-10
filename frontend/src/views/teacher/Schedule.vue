<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, CheckCircle2, Loader2 } from 'lucide-vue-next'
import TeacherScheduleService from '../../services/TeacherScheduleService'

// State
const classes = ref([])
const isLoading = ref(true)
const errorMessage = ref('')
const currentMonth = ref('')
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const currentDate = ref(new Date())

// Helpers
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
}

const getMonthName = (date) => {
  return date.toLocaleString('default', { month: 'long', year: 'numeric' })
}

const getDay = (dateStr) => {
    // Asumsi format dateStr bisa di-parse JS Date, atau sesuaikan dengan format backend
    // Jika backend mengirim "Monday", kita perlu mapping ke tanggal aktual bulan ini? 
    // TAPI: structure backend teacherSchedule model punya `day` sebagai string (e.g. "Monday") 
    // DAN `startTime` / `endTime`. 
    // NAMUN: frontend existing mock data punya specific date (e.g. 12 Jan).
    // KITA PERLU TAHU: Apakah backend menyimpan jadwal rutin (setiap Senin) atau jadwal spesifik tanggal?
    // Dilihat dari controller: `day`, `startTime`, `endTime`, `status`. Sepertinya jadwal rutin mingguan.
    // TAPI: mock data frontend menunjukkan tanggal spesifik.
    // UNTUK SEKARANG: Kita tampilkan apa adanya dari backend.
    return dateStr; 
}


const fetchSchedules = async () => {
    isLoading.value = true
    errorMessage.value = ''
    try {
        // 1. Get Teacher Profile to get ID
        // Note: In a real app, we might store teacherId in store/localstorage upon login
        // But let's fetch it to be safe and get fresh data
        const teacherProfile = await TeacherScheduleService.getTeacherProfile()
        const teacherId = teacherProfile.id

        // 2. Get Schedules
        const schedules = await TeacherScheduleService.getSchedules(teacherId)
        
        // 3. Transform data for UI
        classes.value = schedules.map(schedule => {
            // Backend returns: day (e.g., "Monday"), startTime, endTime, program.name, etc.
            // UI expects: day (date number), month, time, subject, room, status
            
            // Since backend seems to be weekly schedule based on "day" string (Monday, etc.),
            // WE NEED TO MAP THIS TO REAL DATES FOR THE CURRENT WEEK/MONTH?
            // Or just display "Every Monday"?
            // The existing UI shows specific dates (12 Jan). 
            // Let's adapt the UI to show "Every [Day]" or similar if it's weekly, 
            // OR if the backend actually supports specific dates (Appointment system?), it might be different.
            
            // Looking at `TeacherSchedule` model in backend:
            // day: DataTypes.STRING, startTime: DataTypes.TIME, endTime: DataTypes.TIME
            // This confirms it's a WEEKLY schedule (Routine).
            
            // ADJUSTMENT: We will display the DAY NAME instead of Date Number for now to match backend data.
            
            return {
                id: schedule.id,
                day: schedule.day, // e.g. "Monday"
                month: 'Weekly',   // Placeholder
                time: `${schedule.startTime.slice(0,5)} - ${schedule.endTime.slice(0,5)}`,
                subject: schedule.program ? schedule.program.name : 'No Program',
                room: 'Online Class', // Default or fetch from somewhere else if available
                status: schedule.status // Available, Booked, etc.
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
    currentMonth.value = getMonthName(new Date())
    fetchSchedules()
})

</script>

<template>
  <div class="p-8 bg-[#F8F9FA] min-h-screen font-sans">
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-3">
        <div class="p-3 bg-white rounded-2xl shadow-sm">
          <CalendarIcon class="w-6 h-6 text-[#4CC9C0]" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Jadwal Mengajar</h1>
          <p class="text-gray-500 text-sm">Lihat jadwal rutin mengajar Anda.</p>
        </div>
      </div>
      <!-- <div class="hidden md:block px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl">
        <p class="text-xs text-blue-600 font-medium text-center italic">
          *Hubungi admin untuk perubahan jadwal
        </p>
      </div> -->
    </div>

    <div v-if="isLoading" class="flex justify-center items-center h-64">
        <Loader2 class="w-8 h-8 text-[#4CC9C0] animate-spin" />
    </div>

    <div v-else-if="errorMessage" class="p-4 bg-red-50 text-red-600 rounded-xl text-center">
        {{ errorMessage }}
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Calendar View (Simplified for Weekly Schedule) -->
      <div class="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-50">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-xl font-bold text-gray-800">Weekly Schedule</h2>
        </div>

        <div class="grid grid-cols-7 gap-2 mb-4">
          <div v-for="day in daysOfWeek" :key="day" class="text-center text-sm font-bold text-gray-400 py-2">
            {{ day }}
          </div>
        </div>
        
        <!-- Simple visualization of days having classes -->
        <div class="grid grid-cols-7 gap-2">
            <div v-for="day in daysOfWeek" :key="day" class="aspect-square flex items-center justify-center rounded-2xl text-sm font-medium border border-dashed border-gray-200"
                :class="{
                    'bg-[#4CC9C0]/10 border-solid border-[#4CC9C0] text-[#4CC9C0]': classes.some(c => c.day.includes(day)) // Simple check, assumes backend returns full day name e.g. Monday
                }"
            >
                <span v-if="classes.some(c => c.day.includes(day))">Busy</span>
                <span v-else class="text-gray-300">-</span>
            </div>
        </div>
      </div>

      <div class="space-y-6">
        <h3 class="text-lg font-bold text-gray-800 px-2 flex items-center justify-between">
          Daftar Kelas
          <span class="text-xs font-normal text-gray-400">{{ classes.length }} Sesi</span>
        </h3>
        
        <div v-if="classes.length === 0" class="text-center py-8 text-gray-400 italic">
            Belum ada jadwal.
        </div>

        <div 
          v-for="item in classes" 
          :key="item.id" 
          class="relative bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-50 overflow-hidden"
          :class="{'opacity-60': item.status === 'Completed'}"
        >
          <div v-if="item.status === 'Completed'" class="absolute top-0 right-0 p-2">
            <CheckCircle2 class="w-5 h-5 text-green-500" />
          </div>

          <div class="flex items-start gap-4">
            <div class="text-center min-w-[60px] bg-[#F1F3F9] px-3 py-2 rounded-2xl">
              <!-- Showing Day Name instead of Date -->
              <span class="block text-sm font-black text-gray-700">{{ item.day.substring(0,3) }}</span>
              <span class="text-[10px] uppercase font-bold text-gray-500">{{ item.month }}</span>
            </div>
            
            <div class="flex-1">
              <h4 class="font-bold text-gray-800 leading-tight">{{ item.subject }}</h4>
              
              <div class="space-y-1.5 mt-3">
                <div class="flex items-center gap-2 text-xs text-gray-500">
                  <Clock class="w-3.5 h-3.5 text-[#4CC9C0]" />
                  {{ item.time }}
                </div>
                <div class="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin class="w-3.5 h-3.5 text-[#4CC9C0]" />
                  {{ item.room }}
                </div>
                 <div class="flex items-center gap-2 text-xs font-semibold" 
                    :class="item.status === 'Available' ? 'text-green-500' : 'text-gray-500'">
                   Status: {{ item.status }}
                </div>
              </div>

              <!-- Action Buttons (Optional based on business logic) -->
              <!-- <button 
                v-if="item.status === 'Available'"
                class="mt-4 w-full py-2 bg-[#4CC9C0] text-white text-xs font-bold rounded-lg hover:bg-[#3db3aa] transition"
              >
                Masuk Kelas
              </button> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
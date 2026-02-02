<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { 
    Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, 
    Video, User, Plus, X, Trash2, MapPin, MonitorPlay, Loader2 
} from 'lucide-vue-next'
import Sidebar from '../components/Sidebar.vue'

// --- 1. STATE MANAGEMENT ---
const schedules = ref<any[]>([])
const programs = ref<any[]>([]) 
const teachers = ref<any[]>([]) 
const showModal = ref(false)
const isLoading = ref(false)
const isSubmitting = ref(false)

const currentDate = ref(new Date())
const selectedDate = ref<string | null>(null)

// --- 2. FORM DATA ---
const form = ref({
    programId: '',
    teacherId: '',
    date: '',
    startTime: '',
    endTime: '',
    topic: '',
    meetingLink: ''
})

// --- 3. HELPER & API ---
const getHeaders = () => ({
    'Content-Type': 'application/json',
    'x-access-token': localStorage.getItem('token') || ''
})

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return {
        day: date.getDate(),
        month: date.toLocaleString('id-ID', { month: 'short' }),
        full: date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    }
}

// Cek apakah jadwal sudah lewat
const isPast = (dateStr: string, endTime: string) => {
    const scheduleDate = new Date(`${dateStr}T${endTime}`)
    return new Date() > scheduleDate
}

// --- 4. DATA FETCHING ---
const fetchData = async () => {
    isLoading.value = true
    try {
        const [resSchedule, resProgram, resTeacher] = await Promise.all([
            fetch('http://localhost:3001/api/admin/schedules', { headers: getHeaders() }),
            fetch('http://localhost:3001/api/programs', { headers: getHeaders() }),
            fetch('http://localhost:3001/api/admin/teachers-list', { headers: getHeaders() })
        ])

        if(resSchedule.ok) schedules.value = await resSchedule.json()
        if(resProgram.ok) programs.value = await resProgram.json()
        if(resTeacher.ok) teachers.value = await resTeacher.json()
    } catch (error) {
        console.error("Gagal mengambil data:", error)
    } finally {
        isLoading.value = false
    }
}

// --- 5. ACTIONS ---
const handleSubmit = async () => {
    isSubmitting.value = true
    try {
        const response = await fetch('http://localhost:3001/api/admin/schedules', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(form.value)
        })
        if (!response.ok) throw new Error('Gagal menyimpan jadwal')
        
        showModal.value = false
        resetForm()
        await fetchData() 
    } catch (error: any) {
        alert('❌ ' + error.message)
    } finally {
        isSubmitting.value = false
    }
}

const handleDelete = async (id: number) => {
    if (!confirm('Hapus jadwal ini?')) return
    try {
        const response = await fetch(`http://localhost:3001/api/admin/schedules/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        })
        if (response.ok) fetchData()
    } catch (error) {
        console.error(error)
    }
}

const resetForm = () => {
    form.value = { programId: '', teacherId: '', date: '', startTime: '', endTime: '', topic: '', meetingLink: '' }
}

// --- 6. CALENDAR LOGIC ---
const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

const currentMonthLabel = computed(() => {
    return currentDate.value.toLocaleString('id-ID', { month: 'long', year: 'numeric' })
})

const calendarGrid = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    
    const days = []
    for (let i = 0; i < firstDay; i++) days.push(null)
    for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
        const hasEvent = schedules.value.some((s: any) => s.date === dateStr)
        days.push({ day: i, fullDate: dateStr, hasEvent })
    }
    return days
})

const changeMonth = (step: number) => {
    currentDate.value = new Date(currentDate.value.setMonth(currentDate.value.getMonth() + step))
    selectedDate.value = null 
}

// --- 7. FILTERED LIST ---
const displayedSchedules = computed(() => {
    let filtered = schedules.value
    const viewYear = currentDate.value.getFullYear()
    const viewMonth = String(currentDate.value.getMonth() + 1).padStart(2, '0')
    
    // Filter bulan berjalan
    filtered = filtered.filter((s: any) => s.date.startsWith(`${viewYear}-${viewMonth}`))

    // Filter tanggal spesifik jika dipilih
    if (selectedDate.value) {
        filtered = filtered.filter((s: any) => s.date === selectedDate.value)
    }

    return filtered.sort((a, b) => a.startTime.localeCompare(b.startTime))
})

onMounted(fetchData)
</script>

<template>
  <div class="flex min-h-screen bg-[#F8F9FA]">
    
    <main class="flex-1 p-8">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
        <div class="flex items-center gap-4">
          <div class="p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
            <CalendarIcon class="w-6 h-6 text-[#4CC9C0]" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-800 tracking-tight">Kelola Jadwal Kelas</h1>
            <p class="text-gray-500 text-sm">Monitoring dan atur sesi pengajaran guru.</p>
          </div>
        </div>
        
        <button @click="showModal = true" class="bg-[#4CC9C0] hover:bg-[#3db3aa] text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-[#4CC9C0]/20 transition-all active:scale-95">
          <Plus class="w-5 h-5" /> Buat Jadwal
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-7 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50">
          <div class="flex justify-between items-center mb-10">
            <h2 class="text-xl font-extrabold text-gray-800 tracking-tight">{{ currentMonthLabel }}</h2>
            <div class="flex gap-3">
              <button @click="changeMonth(-1)" class="p-2.5 hover:bg-gray-50 border border-gray-100 rounded-xl transition"><ChevronLeft class="w-5 h-5 text-gray-600" /></button>
              <button @click="changeMonth(1)" class="p-2.5 hover:bg-gray-50 border border-gray-100 rounded-xl transition"><ChevronRight class="w-5 h-5 text-gray-600" /></button>
            </div>
          </div>

          <div class="grid grid-cols-7 gap-2 mb-6">
            <div v-for="day in daysOfWeek" :key="day" class="text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              {{ day }}
            </div>
          </div>
          
          <div class="grid grid-cols-7 gap-3">
            <template v-for="(cell, index) in calendarGrid" :key="index">
              <div v-if="!cell" class="aspect-square"></div>
              <button 
                v-else
                @click="selectedDate = (selectedDate === cell.fullDate ? null : cell.fullDate)"
                class="aspect-square flex flex-col items-center justify-center rounded-2xl text-sm font-bold transition-all relative border-2"
                :class="[
                    selectedDate === cell.fullDate 
                        ? 'bg-[#4CC9C0] text-white border-[#4CC9C0] shadow-lg scale-105' 
                        : 'text-gray-600 border-transparent hover:border-gray-100 hover:bg-gray-50',
                ]"
              >
                {{ cell.day }}
                <div v-if="cell.hasEvent" class="absolute bottom-2 w-1.5 h-1.5 rounded-full" :class="selectedDate === cell.fullDate ? 'bg-white' : 'bg-[#4CC9C0]'"></div>
              </button>
            </template>
          </div>
        </div>

        <div class="lg:col-span-5 space-y-6">
          <div class="flex items-center justify-between px-2">
            <h3 class="font-bold text-gray-800 italic">
               {{ selectedDate ? formatDate(selectedDate).full : 'Jadwal Mendatang' }}
            </h3>
            <span class="text-[10px] font-bold bg-white px-3 py-1 rounded-full border shadow-sm text-gray-500 uppercase">
                {{ displayedSchedules.length }} Sesi
            </span>
          </div>
          
          <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-gray-50">
            <Loader2 class="w-8 h-8 animate-spin text-[#4CC9C0] mb-2" />
            <p class="text-sm text-gray-400 font-medium tracking-tight">Menyinkronkan jadwal...</p>
          </div>

          <div v-else-if="displayedSchedules.length === 0" class="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
            <MonitorPlay class="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p class="text-gray-400 text-sm font-medium">Belum ada kelas terjadwal</p>
          </div>

          <div 
            v-else
            v-for="item in displayedSchedules" :key="item.id" 
            class="group relative bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 transition-all hover:shadow-md"
            :class="{ 'opacity-50 grayscale-[30%]': isPast(item.date, item.endTime) }"
          >
            <button @click="handleDelete(item.id)" class="absolute -top-2 -right-2 p-2.5 bg-white text-red-500 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-700 border border-gray-50 z-10">
              <Trash2 class="w-4 h-4" />
            </button>

            <div class="flex items-center gap-5">
              <div class="text-center min-w-[65px] bg-[#F1F3F9] p-3 rounded-2xl">
                <span class="block text-xl font-black text-gray-700">{{ formatDate(item.date).day }}</span>
                <span class="text-[10px] uppercase font-black text-gray-400 tracking-tighter">{{ formatDate(item.date).month }}</span>
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                    <span class="px-2 py-0.5 rounded-md text-[9px] font-black bg-blue-50 text-blue-500 uppercase tracking-wider">
                        {{ item.program?.name || 'Program' }}
                    </span>
                </div>
                <h4 class="font-extrabold text-gray-800 text-base truncate">{{ item.topic || 'No Topic' }}</h4>
                
                <div class="grid grid-cols-2 gap-y-2 mt-4 border-t border-gray-50 pt-4">
                  <div class="flex items-center gap-2 text-[11px] font-bold text-gray-500">
                    <Clock class="w-3.5 h-3.5 text-[#4CC9C0]" />
                    {{ item.startTime.slice(0,5) }} - {{ item.endTime.slice(0,5) }}
                  </div>
                  <div class="flex items-center gap-2 text-[11px] font-bold text-gray-500">
                    <User class="w-3.5 h-3.5 text-[#4CC9C0]" />
                    <span class="truncate">{{ item.teacher?.user?.fullName || 'N/A' }}</span>
                  </div>
                </div>
                
                <div v-if="item.meetingLink" class="mt-4">
                    <a :href="item.meetingLink" target="_blank" class="inline-flex items-center gap-2 text-xs font-black text-[#4CC9C0] hover:text-[#3db3aa] group/link">
                        <Video class="w-4 h-4" /> 
                        <span>JOIN CLASS</span>
                    </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
        <div class="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 animate-in zoom-in-95 duration-200">
            <div class="flex justify-between items-center mb-8">
                <h3 class="font-black text-gray-800 text-2xl tracking-tight">Buat Jadwal Baru</h3>
                <button @click="showModal = false" class="p-2 hover:bg-gray-100 rounded-full transition text-gray-400"><X class="w-6 h-6" /></button>
            </div>
            
            <form @submit.prevent="handleSubmit" class="space-y-5">
                <div class="grid grid-cols-2 gap-5">
                    <div class="space-y-2 col-span-1">
                        <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Program</label>
                        <select v-model="form.programId" required class="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-50 focus:border-[#4CC9C0] transition-all bg-gray-50 text-sm font-bold">
                            <option value="" disabled>Pilih Program</option>
                            <option v-for="p in programs" :key="p.id" :value="p.id">{{ p.name }}</option>
                        </select>
                    </div>
                    <div class="space-y-2 col-span-1">
                        <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Guru</label>
                        <select v-model="form.teacherId" required class="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-50 focus:border-[#4CC9C0] transition-all bg-gray-50 text-sm font-bold">
                            <option value="" disabled>Pilih Guru</option>
                            <option v-for="t in teachers" :key="t.id" :value="t.id">{{ t.user?.fullName }}</option>
                        </select>
                    </div>
                    <div class="space-y-2 col-span-2">
                        <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tanggal Kelas</label>
                        <input v-model="form.date" type="date" required class="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-50 focus:border-[#4CC9C0] transition-all bg-gray-50 text-sm font-bold">
                    </div>
                    <div class="space-y-2">
                        <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Jam Mulai</label>
                        <input v-model="form.startTime" type="time" required class="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-50 focus:border-[#4CC9C0] transition-all bg-gray-50 text-sm font-bold">
                    </div>
                    <div class="space-y-2">
                        <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Jam Selesai</label>
                        <input v-model="form.endTime" type="time" required class="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-50 focus:border-[#4CC9C0] transition-all bg-gray-50 text-sm font-bold">
                    </div>
                    <div class="space-y-2 col-span-2">
                        <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Topik Utama</label>
                        <input v-model="form.topic" type="text" placeholder="..." class="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-50 focus:border-[#4CC9C0] transition-all bg-gray-50 text-sm font-bold">
                    </div>
                    <div class="space-y-2 col-span-2">
                        <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Virtual Meeting Link</label>
                        <input v-model="form.meetingLink" type="url" placeholder="https://..." class="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-50 focus:border-[#4CC9C0] transition-all bg-gray-50 text-sm font-bold">
                    </div>
                </div>

                <button type="submit" :disabled="isSubmitting" class="w-full mt-6 bg-[#4CC9C0] text-white font-black py-4 rounded-[1.5rem] shadow-xl shadow-[#4CC9C0]/30 hover:bg-[#3db3aa] transition-all flex justify-center items-center gap-3 active:scale-95 disabled:opacity-50">
                    <Loader2 v-if="isSubmitting" class="w-5 h-5 animate-spin" />
                    <span>{{ isSubmitting ? 'MEMPROSES...' : 'SIMPAN JADWAL' }}</span>
                </button>
            </form>
        </div>
    </div>
  </div>
</template>

<style scoped>
/* Scrollbar kustom jika konten list panjang */
main { scrollbar-gutter: stable; }
</style>
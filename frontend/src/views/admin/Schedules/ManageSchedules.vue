<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import Toast from '@/components/Toast.vue'
import ScheduleCalendar from './_components/ScheduleCalendar.vue'
import ScheduleModal from './_components/ScheduleModal.vue'
import ConfirmModal from '../ApplicantData/_components/ConfirmModal.vue'

// --- State Management ---
const schedules = ref<any[]>([])
const programs = ref<any[]>([])
const teachers = ref<any[]>([])
const selectedCourseId = ref<number | null>(null)
const currentDate = ref(new Date())

const showModal = ref(false)
const isSubmitting = ref(false)
const selectedAppointment = ref<any>(null)

// Toast State
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

const form = ref({
    programId: '', 
    teacherId: '', 
    date: '', 
    startTime: '', 
    endTime: '', 
    topic: '', 
    meetingLink: ''
})

// Variabel untuk menyimpan interval agar bisa dibersihkan
let pollingInterval: any = null

// --- Helpers ---
const getHeaders = () => ({
    'Content-Type': 'application/json',
    'x-access-token': localStorage.getItem('token') || ''
})

const triggerToast = (message: string, type: 'success' | 'error' = 'success') => {
    toastMessage.value = message
    toastType.value = type
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 3000)
}

// --- Data Fetching ---
const fetchData = async () => {
    try {
        const [resP, resT] = await Promise.all([
            fetch('http://localhost:3001/api/programs', { headers: getHeaders() }),
            fetch('http://localhost:3001/api/admin/teachers-list', { headers: getHeaders() })
        ])
        
        if (resP.ok) {
            programs.value = await resP.json()
            if (programs.value.length > 0 && !selectedCourseId.value) {
                selectedCourseId.value = programs.value[0].id
            }
        }
        if (resT.ok) teachers.value = await resT.json()
    } catch (e) {
        console.error("Error fetching initial data:", e)
    }
}

const fetchSchedules = async () => {
    if (!selectedCourseId.value) return
    try {
        const res = await fetch(`http://localhost:3001/api/programs/${selectedCourseId.value}/schedules`, { 
            headers: getHeaders() 
        })
        if (res.ok) {
            schedules.value = await res.json()
        }
    } catch (e) {
        console.error("Error fetching schedules:", e)
    }
}

// --- Event Handlers ---
const handleDayClick = (day: any) => {
    const d = day.date
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    
    selectedAppointment.value = null
    form.value = {
        programId: selectedCourseId.value?.toString() || '',
        teacherId: '',
        date: dateStr,
        startTime: '',
        endTime: '',
        topic: '',
        meetingLink: ''
    }
    showModal.value = true
}

const handleEventClick = (event: any) => {
    selectedAppointment.value = event
    form.value = { 
        ...event, 
        programId: event.programId.toString(),
        date: event.date.split('T')[0]
    }
    showModal.value = true
}

const handleSubmit = async () => {
    isSubmitting.value = true
    try {
        const isEdit = !!selectedAppointment.value
        const method = isEdit ? 'PUT' : 'POST'
        const url = isEdit 
            ? `http://localhost:3001/api/admin/schedules/${selectedAppointment.value.id}`
            : 'http://localhost:3001/api/admin/schedules'

        const res = await fetch(url, {
            method,
            headers: getHeaders(),
            body: JSON.stringify(form.value)
        })

        if (res.ok) {
            triggerToast(isEdit ? 'Jadwal berhasil diperbarui' : 'Jadwal berhasil dibuat')
            showModal.value = false
            fetchSchedules() // Segera refresh data setelah submit
        } else {
            triggerToast('Gagal menyimpan jadwal', 'error')
        }
    } catch (e) {
        triggerToast('Terjadi kesalahan koneksi', 'error')
    } finally {
        isSubmitting.value = false
    }
}

// --- Lifecycle ---
onMounted(async () => { 
    await fetchData()
    await fetchSchedules()
    
    // Polling setiap 10 detik saja agar tidak berat, 
    // dan pastikan interval dibersihkan di onUnmounted
    pollingInterval = setInterval(fetchSchedules, 10000) 
})

onUnmounted(() => {
    if (pollingInterval) {
        clearInterval(pollingInterval)
        console.log("Polling dibersihkan: Memori kembali lega")
    }
})

// Watcher untuk mengganti jadwal saat program dipilih berubah
watch(selectedCourseId, () => {
    fetchSchedules()
})
</script>

<template>
    <div class="flex min-h-screen bg-[#F8F9FA]">
        <Sidebar />
        
        <div class="flex-1 flex flex-col min-w-0 lg:ml-64">
            <Header />
            
            <main class="p-8">
                <Toast v-if="showToast" :message="toastMessage" :type="toastType" />

                <div class="max-w-[1400px] mx-auto">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                        <div class="flex flex-col gap-2">
                            <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                Pilih Program
                            </label>
                            <select 
                                v-model="selectedCourseId" 
                                class="border border-gray-200 rounded-2xl px-5 py-3 w-72 bg-white font-bold outline-none focus:ring-2 focus:ring-[#4CC9C0] transition-all shadow-sm"
                            >
                                <option v-for="p in programs" :key="p.id" :value="p.id">
                                    {{ p.name || p.title }}
                                </option>
                            </select>
                        </div>
                        
                        <div class="text-right">
                            <h2 class="text-3xl font-black text-gray-800 capitalize">
                                {{ currentDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' }) }}
                            </h2>
                        </div>
                    </div>

                    <div class="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                        <ScheduleCalendar 
                            :current-date="currentDate" 
                            :schedules="schedules"
                            @day-click="handleDayClick"
                            @event-click="handleEventClick"
                        />
                    </div>
                </div>
            </main>
        </div>

        <ScheduleModal 
            v-if="showModal"
            :form="form" 
            :teachers="teachers" 
            :programs="programs" 
            :is-submitting="isSubmitting" 
            :is-edit="!!selectedAppointment"
            @close="showModal = false" 
            @submit="handleSubmit"
        />
    </div>
</template>

<style scoped>
/* Transisi halus untuk navigasi */
main {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
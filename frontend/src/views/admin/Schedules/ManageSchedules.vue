<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import Toast from '@/components/Toast.vue'
import ScheduleCalendar from './_components/ScheduleCalendar.vue'
import ScheduleModal from './_components/ScheduleModal.vue'
import axios from 'axios'

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

// Sesuai dengan kolom di tabel teacher_schedules
const form = ref({
  programId: '',
  teacherId: '',
  day: '', // Monday, Tuesday, dst
  startTime: '',
  endTime: '',
  status: 'Available',
})

const API_BASE_URL = 'http://localhost:3001/api'

// --- Helpers ---
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'x-access-token': localStorage.getItem('token') || '',
})

const triggerToast = (message: string, type: 'success' | 'error' = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// --- Data Fetching ---
const fetchData = async () => {
  try {
    const [resP, resT] = await Promise.all([
      axios.get(`${API_BASE_URL}/programs`, { headers: getHeaders() }),
      axios.get(`${API_BASE_URL}/teachers`, { headers: getHeaders() }),
    ])

    programs.value = resP.data
    teachers.value = resT.data

    if (programs.value.length > 0 && !selectedCourseId.value) {
      selectedCourseId.value = programs.value[0].id
    }
  } catch (e) {
    console.error('Error fetching initial data:', e)
    triggerToast('Gagal mengambil data guru/program', 'error')
  }
}

const fetchSchedules = async () => {
  if (!selectedCourseId.value) return
  try {
    // Mengambil jadwal berdasarkan program yang dipilih
    const res = await axios.get(
      `${API_BASE_URL}/teacher-schedules?programId=${selectedCourseId.value}`,
      {
        headers: getHeaders(),
      },
    )
    schedules.value = res.data
  } catch (e) {
    console.error('Error fetching schedules:', e)
  }
}

// --- Event Handlers ---
const handleDayClick = (dayData: any) => {
  const d = dayData.date
  // Mendapatkan nama hari dalam bahasa Inggris untuk Database ENUM
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayName = days[d.getDay()]

  selectedAppointment.value = null
  form.value = {
    programId: selectedCourseId.value?.toString() || '',
    teacherId: teachers.value[0]?.id || '',
    day: dayName,
    startTime: '08:00',
    endTime: '09:00',
    status: 'Available',
  }
  showModal.value = true
}

const handleEventClick = (event: any) => {
  selectedAppointment.value = event
  form.value = {
    ...event,
    programId: event.programId.toString(),
    teacherId: event.teacherId.toString(),
  }
  showModal.value = true
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const isEdit = !!selectedAppointment.value
    const url = isEdit
      ? `${API_BASE_URL}/teacher-schedules/${selectedAppointment.value.id}`
      : `${API_BASE_URL}/teacher-schedules`

    const method = isEdit ? axios.put : axios.post

    const res = await method(url, form.value, { headers: getHeaders() })

    if (res.status === 200 || res.status === 201) {
      triggerToast(isEdit ? 'Jadwal berhasil diperbarui' : 'Jadwal berhasil dibuat')
      showModal.value = false
      fetchSchedules()
    }
  } catch (e: any) {
    triggerToast(e.response?.data?.message || 'Gagal menyimpan jadwal', 'error')
  } finally {
    isSubmitting.value = false
  }
}

// --- Lifecycle ---
let pollingInterval: any = null

onMounted(async () => {
  await fetchData()
  await fetchSchedules()
  pollingInterval = setInterval(fetchSchedules, 30000)
})

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval)
})

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
          <div
            class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8"
          >
            <div class="flex flex-col gap-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"
                >Pilih Program</label
              >
              <select
                v-model="selectedCourseId"
                class="border border-gray-200 rounded-2xl px-5 py-3 w-72 bg-white font-bold outline-none focus:ring-2 focus:ring-[#4CC9C0] transition-all shadow-sm"
              >
                <option v-for="p in programs" :key="p.id" :value="p.id">{{ p.title }}</option>
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

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import Toast from '@/components/Toast.vue'
import ScheduleCalendar from './_components/ScheduleCalendar.vue'
import ScheduleModal from './_components/ScheduleModal.vue'
import ConfirmModal from './_components/ConfirmModal.vue'
import axios from 'axios'

// --- State ---
const schedules = ref<any[]>([])
const programs = ref<any[]>([])
const teachers = ref<any[]>([])
const classrooms = ref<any[]>([])
const selectedCourseId = ref<number | null>(null)
const currentDate = ref(new Date())
const isSidebarOpen = ref(false)

const showModal = ref(false)
const isSubmitting = ref(false)
const selectedAppointment = ref<any>(null)

const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

const showConfirmModal = ref(false)
const scheduleToDelete = ref<number | null>(null)

// State Form sesuai struktur tabel baru
const form = ref({
  id: null,
  programId: '',
  teacherId: '',
  teacherName: '',
  className: '',
  classroom: '',
  attendanceLink: '',
  startTime: '08:00',
  endTime: '09:00',
  date: '',
})

const API_BASE_URL = 'http://localhost:3001/api'

// --- Utils ---
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

// --- API Actions ---
const fetchData = async () => {
  try {
    const [resP, resT, resC] = await Promise.all([
      axios.get(`${API_BASE_URL}/programs`, { headers: getHeaders() }),
      axios.get(`${API_BASE_URL}/teachers`, { headers: getHeaders() }),
      axios.get(`${API_BASE_URL}/classrooms`, { headers: getHeaders() }),
    ])
    programs.value = Array.isArray(resP.data) ? resP.data : resP.data.data || []
    teachers.value = Array.isArray(resT.data) ? resT.data : resT.data.data || []
    classrooms.value = Array.isArray(resC.data) ? resC.data : resC.data.data || []

    if (programs.value.length > 0 && !selectedCourseId.value) {
      selectedCourseId.value = programs.value[0].id
    }
  } catch (e) {
    triggerToast('Gagal mengambil data guru/program/kelas', 'error')
  }
}

const fetchSchedules = async () => {
  if (!selectedCourseId.value) return
  try {
    const res = await axios.get(
      `${API_BASE_URL}/teacher-schedules?programId=${selectedCourseId.value}`,
      { headers: getHeaders() },
    )
    schedules.value = res.data
  } catch (e) {
    console.error('Error fetching schedules:', e)
  }
}

// --- Handlers ---
const handleDayClick = (dayData: any) => {
  const d = dayData.date
  const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

  selectedAppointment.value = null

  // Auto-fill className berdasarkan program yang dipilih
  const currentProgram = programs.value.find((p) => p.id === selectedCourseId.value)

  form.value = {
    id: null,
    programId: selectedCourseId.value ? selectedCourseId.value.toString() : '',
    teacherId: '',
    teacherName: '', // Akan diisi di Modal saat guru dipilih
    className: currentProgram?.title || currentProgram?.name || '',
    classroom: '',
    attendanceLink: '',
    startTime: '08:00',
    endTime: '09:00',
    date: dateStr,
  }
  showModal.value = true
}

const handleEventClick = (event: any) => {
  selectedAppointment.value = event
  form.value = {
    ...event,
    programId: event.programId.toString(),
    teacherId: event.teacherId.toString(),
    // Pastikan field string terbawa
    teacherName: event.teacherName || '',
    className: event.className || '',
    classroom: event.classroom || '',
    attendanceLink: event.attendanceLink || '',
  }
  showModal.value = true
}

const handleSubmit = async () => {
  // Validasi Tambahan sebelum kirim
  if (!form.value.teacherId) return triggerToast('Pilih guru pengajar!', 'error')

  isSubmitting.value = true
  try {
    const isEdit = !!selectedAppointment.value
    const url = isEdit
      ? `${API_BASE_URL}/teacher-schedules/${selectedAppointment.value.id}`
      : `${API_BASE_URL}/teacher-schedules`

    // Pastikan ID dikirim sebagai angka jika Backend mewajibkan Integer
    const payload = {
      ...form.value,
      programId: parseInt(form.value.programId),
      teacherId: parseInt(form.value.teacherId),
    }

    const method = isEdit ? axios.put : axios.post
    await method(url, payload, { headers: getHeaders() })

    triggerToast(isEdit ? 'Jadwal diperbarui' : 'Jadwal disimpan ke database')
    showModal.value = false
    fetchSchedules()
  } catch (e: any) {
    const errorMsg = e.response?.data?.message || 'Gagal terhubung ke server'
    triggerToast(errorMsg, 'error')
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = (id: number) => {
  scheduleToDelete.value = id
  showConfirmModal.value = true
}

const confirmDelete = async () => {
  if (!scheduleToDelete.value) return
  try {
    await axios.delete(`${API_BASE_URL}/teacher-schedules/${scheduleToDelete.value}`, { headers: getHeaders() })
    triggerToast('Jadwal dihapus')
    showModal.value = false
    showConfirmModal.value = false
    scheduleToDelete.value = null
    fetchSchedules()
  } catch (e) {
    triggerToast('Gagal menghapus', 'error')
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
  <div class="min-h-screen bg-white font-poppins">
    <Sidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />

    <div class="transition-all duration-300 lg:pl-64">
      <Header @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />
      
      <main class="p-4 md:p-8">
        <Toast 
          :show="showToast" 
          :message="toastMessage" 
          :type="toastType" 
          @close="showToast = false"
        />

        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Schedules</h1>

        <ScheduleCalendar
          v-model:current-date="currentDate"
          v-model:selected-course-id="selectedCourseId"
          :schedules="schedules"
          :is-loading="false"
          :programs="programs"
          :teachers="teachers"
          @day-click="handleDayClick"
          @event-click="handleEventClick"
          @delete="handleDelete"
        />
      </main>
    </div>

    <ScheduleModal
      v-if="showModal"
      :form="form"
      :teachers="teachers"
      :programs="programs"
      :classrooms="classrooms"
      :is-submitting="isSubmitting"
      :is-edit="!!selectedAppointment"
      :selected-date-from-calendar="new Date(form.date)"
      :selected-program-from-calendar="selectedCourseId"
      @close="showModal = false"
      @submit="handleSubmit"
      @delete="handleDelete"
    />

    <ConfirmModal
      :show="showConfirmModal"
      title="Hapus Jadwal?"
      message="Apakah Anda yakin ingin menghapus jadwal ini? Tindakan ini tidak dapat dibatalkan."
      confirm-text="Ya, Hapus"
      cancel-text="Batal"
      @confirm="confirmDelete"
      @cancel="showConfirmModal = false"
    />
  </div>
</template>

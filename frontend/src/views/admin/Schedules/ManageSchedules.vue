<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import Toast from '@/components/Toast.vue'
import ScheduleCalendar from './_components/ScheduleCalendar.vue'
import ScheduleModal from './_components/ScheduleModal.vue'
import ConfirmModal from './_components/ConfirmModal.vue'
import api from '@/api'

// --- State ---
const schedules = ref<any[]>([])
const programs = ref<any[]>([])
const teachers = ref<any[]>([])
const classrooms = ref<any[]>([])
const isLoadingReferences = ref(true)
const referenceError = ref(false)
const scheduleError = ref(false)
const isLoadingSchedules = ref(true)
let scheduleRequest: AbortController | null = null
let referenceRequest: AbortController | null = null
const selectedCourseId = ref<number | null>(null)
const selectedTeacherId = ref<number | null>(null)
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
  link: '',
  startTime: '08:00',
  endTime: '09:00',
  date: '',
})

// --- Utils ---
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
  referenceRequest?.abort()
  const request = new AbortController()
  referenceRequest = request
  isLoadingReferences.value = true
  referenceError.value = false
  try {
    const [resP, resT, resC] = await Promise.allSettled([
      api.get('/programs', { signal: request.signal }),
      api.get('/teachers', { signal: request.signal }),
      api.get('/classrooms', { signal: request.signal }),
    ])
    if (request.signal.aborted) return
    if (resP.status === 'fulfilled') programs.value = Array.isArray(resP.value.data) ? resP.value.data : resP.value.data.data || []
    if (resT.status === 'fulfilled') teachers.value = Array.isArray(resT.value.data) ? resT.value.data : resT.value.data.data || []
    if (resC.status === 'fulfilled') classrooms.value = Array.isArray(resC.value.data) ? resC.value.data : resC.value.data.data || []
    referenceError.value = [resP, resT, resC].some(result => result.status === 'rejected')
  } finally {
    if (referenceRequest === request) {
      referenceRequest = null
      isLoadingReferences.value = false
    }
  }
}

const fetchSchedules = async () => {
  scheduleRequest?.abort()
  const request = new AbortController()
  scheduleRequest = request
  isLoadingSchedules.value = true
  scheduleError.value = false
  try {
    const params: { programId?: number; teacherId?: number } = {}
    if (selectedCourseId.value) params.programId = selectedCourseId.value
    if (selectedTeacherId.value) params.teacherId = selectedTeacherId.value

    const res = await api.get('/teacher-schedules', { params, signal: request.signal })
    if (request.signal.aborted) return
    schedules.value = res.data
  } catch (e) {
    if (request.signal.aborted) return
    scheduleError.value = true
    console.error('Error fetching schedules:', e)
  } finally {
    if (scheduleRequest === request) {
      scheduleRequest = null
      isLoadingSchedules.value = false
    }
  }
}

// --- Handlers ---
const handleDayClick = (dayData: any) => {
  if (isLoadingReferences.value || referenceError.value || isLoadingSchedules.value || scheduleError.value) return
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
    link: '',
    startTime: '08:00',
    endTime: '09:00',
    date: dateStr,
  }
  showModal.value = true
}

const handleEventClick = (event: any) => {
  if (isLoadingReferences.value || referenceError.value || isLoadingSchedules.value || scheduleError.value) return
  selectedAppointment.value = event
  form.value = {
    ...event,
    programId: event.programId ? event.programId.toString() : '',
    teacherId: event.teacherId.toString(),
    // Pastikan field string terbawa
    teacherName: event.teacherName || '',
    className: event.className || '',
    classroom: event.classroom || '',
    attendanceLink: event.attendanceLink || '',
    link: event.link || '',
  }
  showModal.value = true
}

const handleSubmit = async () => {
  // Validasi Tambahan sebelum kirim
  if (!form.value.teacherId) return triggerToast('Pilih guru pengajar!', 'error')

  isSubmitting.value = true
  try {
    const isEdit = !!selectedAppointment.value
    
    // Pastikan ID dikirim sebagai angka jika Backend mewajibkan Integer
    const payload = {
      ...form.value,
      programId: form.value.programId ? parseInt(form.value.programId) : null,
      teacherId: parseInt(form.value.teacherId),
    }

    if (isEdit) {
      await api.put(`/teacher-schedules/${selectedAppointment.value.id}`, payload)
    } else {
      await api.post('/teacher-schedules', payload)
    }

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
    await api.delete(`/teacher-schedules/${scheduleToDelete.value}`)
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
let pollingInterval: ReturnType<typeof setInterval> | undefined
const refreshWhenVisible = () => {
  if (!document.hidden && !scheduleRequest) void fetchSchedules()
}
onMounted(() => {
  void fetchData()
  void fetchSchedules()
  pollingInterval = setInterval(refreshWhenVisible, 30000)
  document.addEventListener('visibilitychange', refreshWhenVisible)
})
onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval)
  referenceRequest?.abort()
  scheduleRequest?.abort()
  document.removeEventListener('visibilitychange', refreshWhenVisible)
})
watch([selectedCourseId, selectedTeacherId], () => {
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

        <p v-if="referenceError" role="alert" class="mb-3 text-sm text-red-600">Gagal mengambil data guru/program/kelas. <button class="underline" @click="fetchData">Coba lagi</button></p>
        <p v-else-if="isLoadingReferences" role="status" class="mb-3 text-sm text-gray-500">Memuat data guru/program/kelas...</p>
        <p v-if="scheduleError" role="alert" class="mb-3 text-sm text-red-600">Gagal mengambil jadwal. <button class="underline" @click="fetchSchedules">Coba lagi</button></p>

        <ScheduleCalendar
          v-model:current-date="currentDate"
          v-model:selected-course-id="selectedCourseId"
          v-model:selected-teacher-id="selectedTeacherId"
          :schedules="schedules"
          :is-loading="isLoadingSchedules"
          :programs="programs"
          :teachers="teachers"
          @day-click="handleDayClick"
          @today-click="handleDayClick"
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
      :is-open="showConfirmModal"
      title="Delete Schedule?"
      message="Are you sure you want to delete this schedule? This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      type="danger"
      @confirm="confirmDelete"
      @close="showConfirmModal = false"
    />
  </div>
</template>

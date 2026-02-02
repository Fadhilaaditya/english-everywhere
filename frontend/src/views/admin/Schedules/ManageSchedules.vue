<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import Toast from '@/components/Toast.vue'
import ScheduleCalendar from './_components/ScheduleCalendar.vue'
import ScheduleModal from './_components/ScheduleModal.vue'
import ConfirmModal from '../Appointment/_components/ConfirmModal.vue'

// --- STATE MANAGEMENT ---
const schedules = ref<any[]>([])
const programs = ref<any[]>([])
const teachers = ref<any[]>([])
const selectedCourseId = ref<number | null>(null)
const currentDate = ref(new Date())

const showModal = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')
const isConfirmOpen = ref(false)
const isSubmitting = ref(false)

const selectedAppointment = ref<any>(null)
const form = ref({
  programId: '',
  teacherId: '',
  date: '',
  startTime: '',
  endTime: '',
  topic: '',
  meetingLink: '',
})

// --- HELPER & API ---
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'x-access-token': localStorage.getItem('token') || '',
})

const showNotification = (msg: string, type: 'success' | 'error' = 'success') => {
  toastMessage.value = msg
  toastType.value = type
  showToast.value = true
}

const fetchData = async () => {
  try {
    const [resP, resT] = await Promise.all([
      fetch('http://localhost:3001/api/programs', { headers: getHeaders() }),
      fetch('http://localhost:3001/api/admin/teachers-list', { headers: getHeaders() }),
    ])
    if (resP.ok) {
      programs.value = await resP.json()
      if (programs.value.length > 0) selectedCourseId.value = programs.value[0].id
    }
    if (resT.ok) teachers.value = await resT.json()
  } catch (e) {
    console.error(e)
  }
}

const fetchSchedules = async () => {
  if (!selectedCourseId.value) return
  try {
    const res = await fetch(
      `http://localhost:3001/api/programs/${selectedCourseId.value}/schedules`,
      { headers: getHeaders() },
    )
    if (res.ok) schedules.value = await res.json()
  } catch (e) {
    console.error(e)
  }
}

// --- ACTIONS ---
const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const url = selectedAppointment.value
      ? `http://localhost:3001/api/admin/schedules/${selectedAppointment.value.id}`
      : 'http://localhost:3001/api/admin/schedules'

    const response = await fetch(url, {
      method: selectedAppointment.value ? 'PUT' : 'POST',
      headers: getHeaders(),
      body: JSON.stringify(form.value),
    })
    if (!response.ok) throw new Error('Gagal menyimpan data')
    showNotification(selectedAppointment.value ? 'Jadwal diperbarui' : 'Jadwal dibuat')
    showModal.value = false
    fetchSchedules()
  } catch (e: any) {
    showNotification(e.message, 'error')
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async () => {
  try {
    const res = await fetch(
      `http://localhost:3001/api/admin/schedules/${selectedAppointment.value.id}`,
      {
        method: 'DELETE',
        headers: getHeaders(),
      },
    )
    if (res.ok) {
      showNotification('Jadwal dihapus')
      isConfirmOpen.value = false
      showModal.value = false
      fetchSchedules()
    }
  } catch (e) {
    console.error(e)
  }
}

// --- CALENDAR EVENTS ---
const handleDayClick = (day: any) => {
  const d = day.date
  const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

  // Set form ke keadaan kosong dengan tanggal terpilih
  selectedAppointment.value = null
  form.value = {
    programId: selectedCourseId.value?.toString() || '',
    teacherId: '',
    date: dateStr,
    startTime: '',
    endTime: '',
    topic: '',
    meetingLink: '',
  }
  showModal.value = true
}

const handleEventClick = (event: any) => {
  selectedAppointment.value = event
  form.value = { ...event, programId: event.programId.toString(), teacherId: event.teacherId }
  showModal.value = true
}

// --- NAV ---
const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.setMonth(currentDate.value.getMonth() + 1))
}
const prevMonth = () => {
  currentDate.value = new Date(currentDate.value.setMonth(currentDate.value.getMonth() - 1))
}

onMounted(() => {
  fetchData()
  setInterval(fetchSchedules, 3000)
})
watch(selectedCourseId, fetchSchedules)
</script>

<template>
  <div class="flex min-h-screen bg-[#F8F9FA]">
    <Sidebar />
    <div class="flex-1 flex flex-col min-w-0 lg:ml-64">
      <Header />
      <main class="p-8">
        <div class="max-w-[1400px] mx-auto">
          <div class="flex justify-between items-end mb-8">
            <div class="flex items-end gap-6">
              <div class="flex flex-col gap-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"
                  >Pilih Program</label
                >
                <select
                  v-model="selectedCourseId"
                  class="border border-gray-200 rounded-2xl px-4 py-3 w-64 bg-white font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#4CC9C0]"
                >
                  <option v-for="p in programs" :key="p.id" :value="p.id">
                    {{ p.name || p.title }}
                  </option>
                </select>
              </div>
              <div class="flex items-center gap-2 h-[50px]">
                <button
                  @click="prevMonth"
                  class="p-3 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <ChevronLeft class="w-5 h-5" />
                </button>
                <button
                  @click="nextMonth"
                  class="p-3 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <ChevronRight class="w-5 h-5" />
                </button>
              </div>
            </div>
            <div class="text-right">
              <h2 class="text-3xl font-black text-gray-800 tracking-tight">
                {{ currentDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' }) }}
              </h2>
              <p class="text-gray-400 font-bold text-sm">Klik tanggal untuk buat jadwal baru</p>
            </div>
          </div>

          <ScheduleCalendar
            :current-date="currentDate"
            :schedules="schedules"
            @day-click="handleDayClick"
            @event-click="handleEventClick"
          />

          <div
            class="flex items-center gap-8 mt-8 bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm w-fit"
          >
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 bg-orange-400 rounded-full shadow-sm"></div>
              <span class="text-xs font-black text-gray-500 uppercase tracking-wider">Waiting</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 bg-[#4CC9C0] rounded-full shadow-sm"></div>
              <span class="text-xs font-black text-gray-500 uppercase tracking-wider"
                >Available</span
              >
            </div>
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 bg-slate-400 rounded-full shadow-sm"></div>
              <span class="text-xs font-black text-gray-500 uppercase tracking-wider">Booked</span>
            </div>
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
      @delete="isConfirmOpen = true"
    />

    <ConfirmModal
      :is-open="isConfirmOpen"
      title="Hapus Jadwal"
      message="Data jadwal akan dihapus permanen, lanjutkan?"
      confirm-text="Ya, Hapus"
      type="danger"
      @close="isConfirmOpen = false"
      @confirm="handleDelete"
    />

    <Toast :show="showToast" :message="toastMessage" :type="toastType" @close="showToast = false" />
  </div>
</template>

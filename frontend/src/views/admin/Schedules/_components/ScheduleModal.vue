<script setup lang="ts">
import { X, Loader2, Calendar as CalendarIcon, ChevronDown } from 'lucide-vue-next'
import { watch, onMounted } from 'vue'

const props = defineProps<{
  programs: any[]
  teachers: any[]
  classrooms: any[]
  form: any
  isSubmitting: boolean
  isEdit: boolean
  selectedDateFromCalendar?: Date | null
  selectedProgramFromCalendar?: string | number | null
}>()

const emit = defineEmits(['close', 'submit', 'delete'])

// Fungsi sinkronisasi data otomatis
const syncFields = () => {
  if (!props.isEdit) {
    // 2. Sinkronisasi Program & className
    if (props.selectedProgramFromCalendar) {
      props.form.programId = props.selectedProgramFromCalendar
      const selectedProg = props.programs.find((p) => p.id == props.selectedProgramFromCalendar)
      if (selectedProg) {
        // Gunakan .title atau .name sesuai database Anda
        props.form.className = selectedProg.title || selectedProg.name
      }
    }
  }
}

// Fungsi untuk mengupdate teacherName secara manual
const updateTeacherName = (id: string | number) => {
  const selectedTeacher = props.teachers.find((t) => t.id == id)
  if (selectedTeacher) {
    props.form.teacherName = selectedTeacher.user?.fullName || 'Tanpa Nama'
  }
}

// Watcher untuk teacherId agar teacherName selalu sinkron
watch(
  () => props.form.teacherId,
  (newId) => {
    if (newId) updateTeacherName(newId)
  },
)

// Watcher untuk programId agar className sinkron
watch(
  () => props.form.programId,
  (newId) => {
    const selectedProg = props.programs.find((p) => p.id == newId)
    if (selectedProg) {
      props.form.className = selectedProg.title || selectedProg.name
    }
  }
)

onMounted(() => {
  syncFields()
  // Jika sedang edit, pastikan teacherName terisi
  if (props.form.teacherId) {
    updateTeacherName(props.form.teacherId)
  }
})

watch(() => props.selectedDateFromCalendar, syncFields)
watch(() => props.selectedProgramFromCalendar, syncFields)
</script>

<template>
  <div
    class="fixed inset-0 z-[100] flex items-center justify-center p-4"
    @click.self="emit('close')"
  >
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/50" @click="emit('close')"></div>

    <!-- Modal Content -->
    <div
      class="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
    >
      <!-- Sticky Header -->
      <div class="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
        <h3 class="text-xl md:text-2xl font-bold text-gray-900">
          {{ isEdit ? 'Edit Schedule' : 'Create New Schedule' }}
        </h3>
        <button 
          @click="emit('close')"
          class="p-2 text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 rounded-xl hover:bg-gray-100"
        >
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Scrollable Form Body -->
      <div class="p-6 md:p-8 overflow-y-auto">
        <form @submit.prevent="emit('submit')" class="space-y-6">
          <!-- Program -->
          <div class="space-y-2">
            <label class="block text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wider">Program / Kelas</label>
            <div class="relative">
              <select
                v-model="form.programId"
                required
                class="w-full px-4 py-3 rounded-xl border border-transparent focus:bg-white focus:border-[#4FD1C5] focus:ring-4 focus:ring-[#4FD1C5]/10 bg-gray-50/50 appearance-none outline-none transition-all font-bold text-sm md:text-base text-gray-700"
              >
                <option value="" disabled>Select Program...</option>
                <option v-for="p in programs" :key="p.id" :value="p.id">
                  {{ p.title || p.name }}
                </option>
              </select>
              <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <ChevronDown class="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          <!-- Teacher -->
          <div class="space-y-2">
            <label class="block text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wider">Guru Pengajar</label>
            <div class="relative">
              <select
                v-model="form.teacherId"
                required
                class="w-full px-4 py-3 rounded-xl border border-transparent focus:bg-white focus:border-[#4FD1C5] focus:ring-4 focus:ring-[#4FD1C5]/10 bg-gray-50/50 appearance-none outline-none transition-all font-bold text-sm md:text-base text-gray-700"
              >
                <option value="" disabled>Select Teacher...</option>
                <option v-for="t in teachers" :key="t.id" :value="t.id">
                  {{ t.user ? t.user.fullName : 'Name Not Available' }}
                </option>
              </select>
              <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <ChevronDown class="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          <!-- Ruang Kelas & Link Absensi -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wider">Classroom</label>
              <div class="relative">
                <select
                  v-model="form.classroom"
                  class="w-full px-4 py-3 rounded-xl border border-transparent focus:bg-white focus:border-[#4FD1C5] focus:ring-4 focus:ring-[#4FD1C5]/10 bg-gray-50/50 appearance-none outline-none transition-all font-bold text-sm md:text-base text-gray-700"
                >
                  <option value="" disabled>Select Classroom...</option>
                  <option v-for="c in classrooms" :key="c.id" :value="c.name">
                    {{ c.name }}
                  </option>
                </select>
                <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <ChevronDown class="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
            <div class="space-y-2">
              <label class="block text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wider">Link Absensi</label>
              <input
                type="url"
                v-model="form.attendanceLink"
                placeholder="https://..."
                class="w-full px-4 py-3 rounded-xl border border-transparent focus:bg-white focus:border-[#4FD1C5] focus:ring-4 focus:ring-[#4FD1C5]/10 bg-gray-50/50 outline-none transition-all font-bold text-sm md:text-base text-gray-700 placeholder:text-gray-300"
              />
            </div>
            <div class="space-y-2 md:col-span-2">
              <label class="block text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wider">Link Report Card</label>
              <input
                type="url"
                v-model="form.link"
                placeholder="https://..."
                class="w-full px-4 py-3 rounded-xl border border-transparent focus:bg-white focus:border-[#4FD1C5] focus:ring-4 focus:ring-[#4FD1C5]/10 bg-gray-50/50 outline-none transition-all font-bold text-sm md:text-base text-gray-700 placeholder:text-gray-300"
              />
            </div>
          </div>

          <!-- Time -->
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wider">Jam Mulai</label>
              <input
                type="time"
                v-model="form.startTime"
                required
                class="w-full px-4 py-3 rounded-xl border border-transparent focus:bg-white focus:border-[#4FD1C5] focus:ring-4 focus:ring-[#4FD1C5]/10 bg-gray-50/50 outline-none transition-all font-bold text-sm md:text-base text-gray-700"
              />
            </div>
            <div class="space-y-2">
              <label class="block text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wider">Jam Selesai</label>
              <input
                type="time"
                v-model="form.endTime"
                required
                class="w-full px-4 py-3 rounded-xl border border-transparent focus:bg-white focus:border-[#4FD1C5] focus:ring-4 focus:ring-[#4FD1C5]/10 bg-gray-50/50 outline-none transition-all font-bold text-sm md:text-base text-gray-700"
              />
            </div>
          </div>
        </form>
      </div>

      <!-- Sticky Footer Actions -->
      <div class="p-6 md:p-8 border-t border-gray-100 bg-white flex gap-4">
        <button
          v-if="isEdit"
          type="button"
          @click="emit('delete', form.id)"
          class="flex-1 py-4 rounded-xl text-white font-black uppercase tracking-widest text-xs transition-all bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 active:scale-[0.98]"
        >
          Delete
        </button>
        <button
          type="button"
          @click="emit('submit')"
          :disabled="isSubmitting"
          class="flex-[2] bg-[#4FD1C5] hover:bg-[#3dbdb0] disabled:bg-gray-200 text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl flex justify-center items-center gap-2 transition-all shadow-lg shadow-[#4FD1C5]/20 active:scale-[0.98]"
        >
          <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
          <span>{{ isSubmitting ? 'Processing...' : 'Save Schedule' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

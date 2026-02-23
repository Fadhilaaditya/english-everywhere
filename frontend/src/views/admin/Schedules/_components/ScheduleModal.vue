<script setup lang="ts">
import { X, Loader2, Calendar as CalendarIcon } from 'lucide-vue-next'
import { watch, onMounted } from 'vue'

const props = defineProps<{
  programs: any[]
  teachers: any[]
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

    <div
      class="relative bg-white w-full max-w-lg rounded-2xl shadow-xl p-8 overflow-y-auto max-h-[90vh]"
    >
      <!-- Close Button -->
      <button 
        @click="emit('close')"
        class="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X class="w-6 h-6" />
      </button>

      <div class="mb-8">
        <h3 class="text-2xl font-bold text-gray-900">
          {{ isEdit ? 'Edit Schedule' : 'Create New Schedule' }}
        </h3>
      </div>

      <form @submit.prevent="emit('submit')" class="space-y-6">
        <!-- Program -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Program / Kelas</label>
          <div class="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-gray-500 font-medium">
            {{ form.className }}
          </div>
          <input type="hidden" v-model="form.className" />
          <p class="text-[10px] text-[#4FD1C5] font-medium uppercase tracking-tight">
            * Automatically follows program selection
          </p>
        </div>

        <!-- Teacher -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Guru Pengajar</label>
          <select
            v-model="form.teacherId"
            required
            class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 bg-white transition-all font-medium text-sm"
          >
            <option value="" disabled>Select Teacher...</option>
            <option v-for="t in teachers" :key="t.id" :value="t.id">
              {{ t.user ? t.user.fullName : 'Name Not Available' }}
            </option>
          </select>
        </div>
        <!-- Time -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Jam Mulai</label>
            <input
              type="time"
              v-model="form.startTime"
              required
              class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 transition-all font-medium text-sm"
            />
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Jam Selesai</label>
            <input
              type="time"
              v-model="form.endTime"
              required
              class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 transition-all font-medium text-sm"
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-4 pt-4">
          <button
            v-if="isEdit"
            type="button"
            @click="emit('delete', form.id)"
            class="flex-1 py-3 rounded-lg text-white font-medium transition-colors bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20"
          >
            Delete
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="flex-1 bg-[#4FD1C5] hover:bg-[#3dbdb0] disabled:bg-gray-300 text-white font-medium py-3 rounded-lg flex justify-center items-center gap-2 transition-all shadow-lg shadow-[#4FD1C5]/20"
          >
            <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
            <span>{{ isSubmitting ? 'Processing...' : 'Save Schedule' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

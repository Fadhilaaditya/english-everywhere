<script setup lang="ts">
import { X, Loader2 } from 'lucide-vue-next'
import { watch, onMounted, computed, ref } from 'vue'
import api from '@/api'
import CustomDropdown from '@/components/CustomDropdown.vue'

const props = defineProps<{
  programs: any[] // These are parent programs
  teachers: any[]
  classrooms: any[]
  form: any
  isSubmitting: boolean
  isEdit: boolean
  selectedDateFromCalendar?: Date | null
  selectedProgramFromCalendar?: string | number | null
}>()

const emit = defineEmits(['close', 'submit', 'delete'])

const subPrograms = ref<any[]>([])
const selectedParentProgramId = ref<number | null>(null)

const programOptions = computed(() => 
  props.programs.map(p => ({ id: p.id, title: p.title || p.name }))
)

const teacherOptions = computed(() => 
  props.teachers.map(t => ({ id: t.id, fullName: t.user?.fullName || `Teacher ${t.id}` }))
)

const classroomOptions = computed(() => 
  props.classrooms.map(c => ({ name: c.name }))
)

const fetchSubPrograms = async (parentId: number) => {
  try {
    const response = await api.get(`/programs/${parentId}/levels`)
    const levels = response.data
    if (levels && levels.length > 0) {
      subPrograms.value = levels
    } else if (selectedParentProgramId.value) {
      // Fallback to parent program if no levels exist
      const parent = props.programs.find(p => p.id === selectedParentProgramId.value)
      if (parent) {
        subPrograms.value = [parent]
        props.form.programId = parent.id
      }
    } else {
      subPrograms.value = []
    }
  } catch (e) {
    console.error('Failed to fetch sub-programs', e)
  }
}

watch(selectedParentProgramId, (newParentId) => {
  if (newParentId) {
    fetchSubPrograms(newParentId)
  } else {
    subPrograms.value = []
    props.form.programId = null
  }
})

// Initialize form logic
const initializeHierarchy = async () => {
  if (props.isEdit && props.form.programId) {
    try {
      const resp = await api.get(`/programs/${props.form.programId}`)
      const prog = resp.data
      const parentId = prog.parentId || prog.id
      selectedParentProgramId.value = parentId
      await fetchSubPrograms(parentId)
    } catch (e) {
      console.error('Failed to initialize hierarchy', e)
    }
  } else if (props.selectedProgramFromCalendar) {
      selectedParentProgramId.value = Number(props.selectedProgramFromCalendar)
  }
}

// Fungsi sinkronisasi data otomatis
const syncFields = () => {
  if (!props.isEdit) {
    if (props.selectedProgramFromCalendar) {
      selectedParentProgramId.value = Number(props.selectedProgramFromCalendar)
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
    const selectedProg = subPrograms.value.find((p) => p.id == newId) || props.programs.find(p => p.id == newId)
    if (selectedProg) {
      props.form.className = selectedProg.title || selectedProg.name
    }
  }
)

onMounted(async () => {
  syncFields()
  await initializeHierarchy()
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
      class="relative bg-white w-full max-w-2xl rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200"
    >
      <!-- Sticky Header -->
      <div class="p-4 md:p-8 py-4 md:py-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
        <h3 class="text-2xl font-bold text-gray-900">
          {{ isEdit ? 'Manage Schedule' : 'Create New Schedule' }}
        </h3>
        <button 
          @click="emit('close')"
          class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Scrollable Form Body -->
      <div class="p-4 md:p-8 overflow-y-auto">
        <form @submit.prevent="emit('submit')" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Program Series -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Program Series</label>
              <CustomDropdown
                v-model="selectedParentProgramId"
                :options="programOptions"
                label-key="title"
                value-key="id"
                placeholder="Select Program Series..."
              />
            </div>

            <!-- Specific Level -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Specific Level</label>
              <CustomDropdown
                v-model="form.programId"
                :options="subPrograms"
                labelKey="title"
                valueKey="id"
                placeholder="Select Level..."
                :disabled="!selectedParentProgramId"
              />
            </div>

            <!-- Teacher -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Teacher</label>
              <CustomDropdown
                v-model="form.teacherId"
                :options="teacherOptions"
                label-key="fullName"
                value-key="id"
                placeholder="Select Teacher..."
              />
            </div>

             <!-- Classroom -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Classroom</label>
              <CustomDropdown
                v-model="form.classroom"
                :options="classroomOptions"
                label-key="name"
                value-key="name"
                placeholder="Select Classroom..."
              />
            </div>
          </div>

          <!-- Links -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Attendance Link</label>
              <input
                type="url"
                v-model="form.attendanceLink"
                placeholder="https://..."
                class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 text-gray-700 placeholder:text-gray-300"
              />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Report Card Link</label>
              <input
                type="url"
                v-model="form.link"
                placeholder="https://..."
                class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 text-gray-700 placeholder:text-gray-300"
              />
            </div>
          </div>

          <!-- Date & Time -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                v-model="form.date"
                required
                class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 text-gray-700"
              />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                type="time"
                v-model="form.startTime"
                required
                class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 text-gray-700"
              />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">End Time</label>
              <input
                type="time"
                v-model="form.endTime"
                required
                class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 text-gray-700"
              />
            </div>
          </div>
        </form>
      </div>

      <!-- Sticky Footer Actions -->
      <div class="p-6 md:p-8 border-t border-gray-100 bg-white flex flex-col sm:flex-row gap-4">
        <button
          v-if="isEdit"
          type="button"
          @click="emit('delete', form.id)"
          class="flex-1 py-3 rounded-lg text-white font-medium transition-colors bg-red-500 hover:bg-red-600"
        >
          Delete Schedule
        </button>
        <button
          type="button"
          @click="emit('submit')"
          :disabled="isSubmitting"
          class="flex-1 py-3 rounded-lg text-white font-medium transition-colors bg-[#4FD1C5] hover:bg-[#3dbdb0] disabled:bg-gray-200 flex justify-center items-center gap-2"
        >
          <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
          <span>{{ isSubmitting ? 'Processing...' : 'Save Schedule' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

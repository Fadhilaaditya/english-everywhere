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

const emit = defineEmits(['close', 'submit'])

// Helper untuk konversi tanggal ke nama hari Inggris
const getDayName = (date: Date): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[date.getDay()]
}

// Fungsi sinkronisasi data otomatis
const syncFields = () => {
  if (!props.isEdit) {
    // 1. Sinkronisasi Hari
    if (props.selectedDateFromCalendar) {
      props.form.day = getDayName(new Date(props.selectedDateFromCalendar))
    }

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
    class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
    @click.self="emit('close')"
  >
    <div
      class="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 overflow-y-auto max-h-[90vh]"
    >
      <div class="flex justify-between items-center mb-8">
        <h3 class="font-black text-gray-800 text-2xl">
          {{ isEdit ? 'Edit Jadwal' : 'Buat Jadwal Baru' }}
        </h3>
        <button @click="emit('close')" class="text-gray-400 hover:text-gray-600 p-2"><X /></button>
      </div>

      <form @submit.prevent="emit('submit')" class="space-y-6">
        <div>
          <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-2"
            >Program / Kelas</label
          >
          <input
            type="text"
            :value="form.className"
            readonly
            class="w-full px-5 py-4 rounded-2xl bg-gray-100 font-bold text-sm text-gray-500 cursor-not-allowed outline-none border-2 border-transparent"
          />
          <input type="hidden" v-model="form.className" />
          <p class="text-[9px] text-teal-500 mt-1 ml-2 font-bold uppercase">
            * Otomatis mengikuti program studi
          </p>
        </div>

        <div>
          <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-2"
            >Guru Pengajar</label
          >
          <select
            v-model="form.teacherId"
            required
            class="w-full px-5 py-4 rounded-2xl border-2 border-transparent bg-gray-50 font-bold text-sm focus:border-[#4CC9C0] focus:bg-white transition-all outline-none"
          >
            <option value="" disabled>Pilih Guru...</option>
            <option v-for="t in teachers" :key="t.id" :value="t.id">
              {{ t.user ? t.user.fullName : 'Nama Tidak Tersedia' }}
            </option>
          </select>
          <input type="hidden" v-model="form.teacherName" />
        </div>

        <div class="space-y-6">
          <div>
            <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-2"
              >Hari</label
            >
            <div class="relative">
              <input
                type="text"
                v-model="form.day"
                readonly
                class="w-full px-5 py-4 rounded-2xl bg-gray-100 font-bold text-sm text-gray-500 cursor-not-allowed outline-none border-2 border-transparent"
              />
              <CalendarIcon
                class="absolute right-5 top-4 w-4 h-4 text-gray-300 pointer-events-none"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-2"
                >Jam Mulai</label
              >
              <input
                type="time"
                v-model="form.startTime"
                required
                class="w-full px-5 py-4 rounded-2xl border-2 border-transparent bg-gray-50 font-bold text-sm focus:border-[#4CC9C0] outline-none"
              />
            </div>
            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-2"
                >Jam Selesai</label
              >
              <input
                type="time"
                v-model="form.endTime"
                required
                class="w-full px-5 py-4 rounded-2xl border-2 border-transparent bg-gray-50 font-bold text-sm focus:border-[#4CC9C0] outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full bg-[#4CC9C0] hover:bg-[#3db3aa] disabled:bg-gray-300 text-white font-black py-5 rounded-3xl flex justify-center items-center gap-3 transition-all shadow-lg"
        >
          <Loader2 v-if="isSubmitting" class="animate-spin" />
          <span>{{ isSubmitting ? 'MEMPROSES...' : 'SIMPAN JADWAL' }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

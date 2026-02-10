<script setup lang="ts">
import { X, Loader2, Calendar, Clock } from 'lucide-vue-next'

defineProps<{
  programs: any[]
  teachers: any[]
  form: any
  isSubmitting: boolean
  isEdit: boolean
}>()

const emit = defineEmits(['close', 'submit'])
</script>

<template>
  <div
    class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
    @click.self="emit('close')"
  >
    <div
      class="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 transform transition-all overflow-y-auto max-h-[90vh]"
    >
      <div class="flex justify-between items-center mb-8">
        <h3 class="font-black text-gray-800 text-2xl">
          {{ isEdit ? 'Edit Jadwal' : 'Buat Jadwal Baru' }}
        </h3>
        <button
          @click="emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors p-2"
        >
          <X />
        </button>
      </div>

      <form @submit.prevent="emit('submit')" class="space-y-6">
        <div>
          <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-2"
            >Program Studi</label
          >
          <select
            v-model="form.programId"
            required
            class="w-full px-5 py-4 rounded-2xl border-2 border-transparent bg-gray-50 font-bold text-sm focus:border-[#4CC9C0] focus:bg-white transition-all outline-none"
          >
            <option value="" disabled>Pilih Program...</option>
            <option v-for="p in programs" :key="p.id" :value="p.id">{{ p.title }}</option>
          </select>
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
              {{ t.name || t.user?.fullName }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-2"
            >Hari Mengajar</label
          >
          <div class="relative">
            <select
              v-model="form.day"
              required
              class="w-full px-5 py-4 rounded-2xl border-2 border-transparent bg-gray-50 font-bold text-sm focus:border-[#4CC9C0] focus:bg-white transition-all outline-none appearance-none"
            >
              <option value="Monday">Monday (Senin)</option>
              <option value="Tuesday">Tuesday (Selasa)</option>
              <option value="Wednesday">Wednesday (Rabu)</option>
              <option value="Thursday">Thursday (Kamis)</option>
              <option value="Friday">Friday (Jumat)</option>
              <option value="Saturday">Saturday (Sabtu)</option>
              <option value="Sunday">Sunday (Minggu)</option>
            </select>
            <Calendar class="absolute right-5 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
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
              class="w-full px-5 py-4 rounded-2xl border-2 border-transparent bg-gray-50 font-bold text-sm focus:border-[#4CC9C0] focus:bg-white transition-all outline-none"
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
              class="w-full px-5 py-4 rounded-2xl border-2 border-transparent bg-gray-50 font-bold text-sm focus:border-[#4CC9C0] focus:bg-white transition-all outline-none"
            />
          </div>
        </div>

        <div>
          <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-2"
            >Status Slot</label
          >
          <select
            v-model="form.status"
            class="w-full px-5 py-4 rounded-2xl border-2 border-transparent bg-gray-50 font-bold text-sm focus:border-[#4CC9C0] focus:bg-white transition-all outline-none"
          >
            <option value="Available">Available (Tersedia)</option>
            <option value="Booked">Booked (Terisi)</option>
            <option value="Canceled">Canceled (Batal)</option>
          </select>
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full bg-[#4CC9C0] hover:bg-[#3db3aa] disabled:bg-gray-300 text-white font-black py-5 rounded-3xl flex justify-center items-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-teal-100"
        >
          <Loader2 v-if="isSubmitting" class="animate-spin" />
          <span>{{
            isSubmitting ? 'MEMPROSES...' : isEdit ? 'SIMPAN PERUBAHAN' : 'KONFIRMASI JADWAL'
          }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

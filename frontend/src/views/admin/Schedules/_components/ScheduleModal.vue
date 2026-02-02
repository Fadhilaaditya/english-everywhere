<script setup lang="ts">
import { X, Trash2, Loader2, Link, BookOpen, Clock, User, Calendar } from 'lucide-vue-next'

defineProps<{
  programs: any[]
  teachers: any[]
  form: any
  isSubmitting: boolean
  isEdit: boolean
}>()

const emit = defineEmits(['close', 'submit', 'delete'])
</script>

<template>
  <div
    class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
  >
    <div
      class="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 overflow-hidden relative border border-white/20"
    >
      <div class="flex justify-between items-center mb-8">
        <div>
          <h3 class="font-black text-gray-800 text-2xl tracking-tight">
            {{ isEdit ? 'Detail Sesi Kelas' : 'Buat Jadwal Baru' }}
          </h3>
          <p class="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
            Lengkapi informasi pengajaran
          </p>
        </div>
        <button
          @click="emit('close')"
          class="p-3 hover:bg-gray-50 rounded-full text-gray-400 transition-colors"
        >
          <X class="w-6 h-6" />
        </button>
      </div>

      <form @submit.prevent="emit('submit')" class="space-y-6">
        <div class="grid grid-cols-2 gap-5">
          <div class="col-span-2">
            <label
              class="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2"
            >
              <BookOpen class="w-3 h-3 text-[#4CC9C0]" /> Program Belajar
            </label>
            <select
              v-model="form.programId"
              required
              class="w-full px-5 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 font-bold text-sm focus:border-[#4CC9C0] outline-none transition-all"
            >
              <option v-for="p in programs" :key="p.id" :value="p.id">
                {{ p.name || p.title }}
              </option>
            </select>
          </div>

          <div class="col-span-2">
            <label
              class="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2"
            >
              <User class="w-3 h-3 text-[#4CC9C0]" /> Guru Pengajar
            </label>
            <select
              v-model="form.teacherId"
              required
              class="w-full px-5 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 font-bold text-sm focus:border-[#4CC9C0] outline-none transition-all"
            >
              <option value="" disabled>Pilih Guru...</option>
              <option v-for="t in teachers" :key="t.id" :value="t.id">
                {{ t.user?.fullName }}
              </option>
            </select>
          </div>

          <div class="col-span-2">
            <label
              class="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2"
            >
              <Calendar class="w-3 h-3 text-[#4CC9C0]" /> Tanggal Kelas
            </label>
            <input
              type="date"
              v-model="form.date"
              required
              class="w-full px-5 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 font-bold text-sm focus:border-[#4CC9C0] outline-none"
            />
          </div>

          <div>
            <label
              class="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2"
            >
              <Clock class="w-3 h-3 text-[#4CC9C0]" /> Mulai
            </label>
            <input
              type="time"
              v-model="form.startTime"
              required
              class="w-full px-5 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 font-bold text-sm focus:border-[#4CC9C0] outline-none"
            />
          </div>
          <div>
            <label
              class="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2"
            >
              <Clock class="w-3 h-3 text-[#4CC9C0]" /> Selesai
            </label>
            <input
              type="time"
              v-model="form.endTime"
              required
              class="w-full px-5 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 font-bold text-sm focus:border-[#4CC9C0] outline-none"
            />
          </div>

          <div class="col-span-2">
            <label
              class="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2"
            >
              <Link class="w-3 h-3 text-[#4CC9C0]" /> Virtual Meeting Link
            </label>
            <input
              type="url"
              v-model="form.meetingLink"
              placeholder="https://zoom.us/..."
              class="w-full px-5 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 font-bold text-sm focus:border-[#4CC9C0] outline-none"
            />
          </div>
        </div>

        <div class="flex gap-4 pt-4">
          <button
            v-if="isEdit"
            type="button"
            @click="emit('delete')"
            class="p-5 bg-red-50 text-red-500 rounded-[1.5rem] hover:bg-red-100 transition-all active:scale-95"
          >
            <Trash2 class="w-6 h-6" />
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="flex-1 bg-[#4CC9C0] text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-[#4CC9C0]/30 hover:bg-[#3db3aa] disabled:opacity-50 flex justify-center items-center gap-3 transition-all active:scale-[0.98]"
          >
            <Loader2 v-if="isSubmitting" class="animate-spin w-5 h-5" />
            <span>{{ isEdit ? 'SIMPAN PERUBAHAN' : 'BUAT JADWAL SEKARANG' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

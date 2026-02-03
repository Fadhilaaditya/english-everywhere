<script setup lang="ts">
import { X, Loader2 } from 'lucide-vue-next'

// Definisi Interface untuk type-safety yang lebih baik
interface Program {
  id: string | number;
  name?: string;
  title?: string;
}

interface Teacher {
  id: string | number;
  user?: {
    fullName: string;
  };
}

// Menggunakan defineProps dengan type-safety
defineProps<{ 
  programs: Program[], 
  teachers: Teacher[], 
  form: any, 
  isSubmitting: boolean, 
  isEdit: boolean 
}>()

const emit = defineEmits(['close', 'submit'])
</script>

<template>
    <div class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" @click.self="emit('close')">
        <div class="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 transform transition-all">
            
            <div class="flex justify-between items-center mb-8">
                <h3 class="font-black text-gray-800 text-2xl">
                    {{ isEdit ? 'Edit Jadwal' : 'Buat Jadwal' }}
                </h3>
                <button 
                    @click="emit('close')" 
                    class="text-gray-400 hover:text-gray-600 transition-colors p-2"
                >
                    <X />
                </button>
            </div>

            <form @submit.prevent="emit('submit')" class="space-y-5">
                <div class="grid grid-cols-2 gap-5">
                    
                    <div class="col-span-2">
                        <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-2">Program</label>
                        <select 
                            v-model="form.programId" 
                            required
                            class="w-full px-5 py-4 rounded-2xl border-2 border-transparent bg-gray-50 font-bold text-sm focus:border-[#4CC9C0] focus:bg-white transition-all outline-none appearance-none"
                        >
                            <option value="" disabled selected>Pilih Program...</option>
                            <option v-for="p in programs" :key="p.id" :value="p.id">
                                {{ p.name || p.title || 'Program Tanpa Nama' }}
                            </option>
                        </select>
                    </div>

                    <div class="col-span-2">
                        <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-2">Guru</label>
                        <select 
                            v-model="form.teacherId" 
                            required
                            class="w-full px-5 py-4 rounded-2xl border-2 border-transparent bg-gray-50 font-bold text-sm focus:border-[#4CC9C0] focus:bg-white transition-all outline-none appearance-none"
                        >
                            <option value="" disabled selected>Pilih Guru...</option>
                            <option v-for="t in teachers" :key="t.id" :value="t.id">
                                {{ t.user?.fullName || 'Nama Tidak Tersedia' }}
                            </option>
                        </select>
                    </div>

                    <div class="col-span-2">
                        <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-2">Tanggal</label>
                        <input 
                            type="date" 
                            v-model="form.date" 
                            required
                            class="w-full px-5 py-4 rounded-2xl border-2 border-transparent bg-gray-50 font-bold text-sm focus:border-[#4CC9C0] focus:bg-white transition-all outline-none" 
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    :disabled="isSubmitting" 
                    class="w-full bg-[#4CC9C0] hover:bg-[#3db3aa] disabled:bg-gray-300 text-white font-black py-5 rounded-2xl flex justify-center items-center gap-3 transition-all active:scale-[0.98]"
                >
                    <Loader2 v-if="isSubmitting" class="animate-spin" />
                    <span>{{ isSubmitting ? 'MEMPROSES...' : (isEdit ? 'SIMPAN PERUBAHAN' : 'BUAT JADWAL') }}</span>
                </button>
            </form>
        </div>
    </div>
</template>
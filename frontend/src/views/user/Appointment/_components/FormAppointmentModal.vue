<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { X, Calendar, Clock } from 'lucide-vue-next'
import ConfirmationModal from './ConfirmationModal.vue'

const props = defineProps<{
  isOpen: boolean
  selectedDate: string
  selectedTime: string
}>()

const emit = defineEmits(['close', 'submit'])

const showConfirmModal = ref(false)

const formData = ref({
  fullName: '',
  gender: '',
  address: '',
  guardianName1: '',
  guardianName2: '',
  birthPlace: '',
  birthDate: '',
  phone: '',
  email: '',
  education: ''
})

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
})

const handleSubmit = () => {
    // Show confirmation modal instead of emitting immediately
    showConfirmModal.value = true
}

const handleConfirm = () => {
    showConfirmModal.value = false
    emit('submit', formData.value)
    // Optional: Reset form or close main modal handled by parent
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center">
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>

    <!-- Modal Content -->
    <div class="relative bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <button @click="$emit('close')" class="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <X class="w-6 h-6" />
        </button>

        <div class="p-8">
            <h2 class="text-2xl font-bold text-center mb-8 text-gray-900">Appointment Form</h2>

            <form @submit.prevent="handleSubmit">
                <!-- Row 1: Date & Time (Read-only) -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Test</label>
                        <div class="relative">
                            <input 
                                type="text" 
                                :value="selectedDate" 
                                disabled
                                class="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
                            />
                            <Calendar class="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Jam Mulai</label>
                         <div class="relative">
                            <input 
                                type="text" 
                                :value="selectedTime" 
                                disabled
                                class="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
                            />
                             <Clock class="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                             <p class="text-xs text-gray-500 mt-1">Waktu tes sekitar 20-30 menit</p>
                        </div>
                    </div>
                </div>

                <!-- Row 2: Name & Gender -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                     <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                        <input 
                            v-model="formData.fullName"
                            type="text" 
                            required
                            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900"
                        />
                    </div>
                     <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin</label>
                        <div class="relative">
                            <select 
                                v-model="formData.gender"
                                required
                                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 appearance-none bg-white"
                            >
                                <option value="" disabled selected></option>
                                <option value="Laki-laki">Laki-laki</option>
                                <option value="Perempuan">Perempuan</option>
                            </select>
                             <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                                <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" fill-rule="evenodd"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Row 3: Address -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
                    <textarea 
                        v-model="formData.address"
                        rows="3"
                        required
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900"
                    ></textarea>
                </div>

                <!-- Row 4: Guardian info -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                     <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Nama Ayah/Wali</label>
                        <input 
                            v-model="formData.guardianName1"
                            type="text" 
                            required
                            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900"
                        />
                    </div>
                     <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Nama Ibu/Wali</label>
                        <input 
                             v-model="formData.guardianName2"
                            type="text" 
                            required
                            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900"
                        />
                    </div>
                </div>

                 <!-- Row 5: Birth info -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                     <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Tempat Lahir</label>
                        <input 
                            v-model="formData.birthPlace"
                            type="text" 
                            required
                            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900"
                        />
                    </div>
                     <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Lahir</label>
                         <div class="relative">
                            <input 
                                v-model="formData.birthDate"
                                type="date" 
                                required
                                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900"
                            />
                        </div>
                    </div>
                </div>

                <!-- Row 6: Contact -->
                 <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                     <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">No Telp</label>
                        <input 
                            v-model="formData.phone"
                            type="tel" 
                            required
                            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900"
                        />
                    </div>
                     <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input 
                             v-model="formData.email"
                            type="email" 
                            required
                            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900"
                        />
                    </div>
                </div>

                <!-- Row 7: Education -->
                <div class="mb-8">
                     <label class="block text-sm font-medium text-gray-700 mb-2">Jenjang Pendidikan</label>
                        <div class="relative">
                            <select 
                                v-model="formData.education"
                                required
                                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 appearance-none bg-white"
                            >
                                <option value="" disabled selected></option>
                                <option value="TK">TK</option>
                                <option value="SD">SD</option>
                                <option value="SMP">SMP</option>
                                <option value="SMA">SMA</option>
                                <option value="Umum">Umum</option>
                            </select>
                             <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                                <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" fill-rule="evenodd"></path>
                                </svg>
                            </div>
                        </div>
                </div>

                <!-- Submit Button -->
                <button 
                    type="submit"
                    class="w-full bg-[#52D3C4] hover:bg-[#52D3C4]/90 text-white font-medium py-3 rounded-lg shadow-md transition-colors text-lg"
                >
                    Make Appointment
                </button>
            </form>
        </div>
    </div>

    <!-- Confirmation Modal -->
    <ConfirmationModal 
        :is-open="showConfirmModal"
        @confirm="handleConfirm"
        @cancel="showConfirmModal = false"
    />
  </div>
</template>

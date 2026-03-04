<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { X, Calendar, Clock, ChevronDown } from 'lucide-vue-next'
import ConfirmationModal from './ConfirmationModal.vue'

const props = defineProps<{
  isOpen: boolean
  schedule?: {
    id: number
    date: string
    time: string
    programName?: string
    status?: string
    applicantName?: string
    applicantGender?: string
    applicantAddress?: string
    applicantFather?: string
    applicantMother?: string
    applicantBirthPlace?: string
    applicantBirthDate?: string
    applicantPhone?: string
    applicantEmail?: string
  }
}>()

const emit = defineEmits(['close', 'submit'])

const formData = ref({
    fullName: '',
    gender: 'Male',
    address: '',
    fatherName: '',
    motherName: '',
    birthPlace: '',
    birthDate: '',
    phone: '',
    email: ''
})

const isSubmitting = ref(false)
const emailError = ref('')
const isConfirmOpen = ref(false)
const errors = ref<Record<string, string>>({})

const validateEmail = () => {
    if (!formData.value.email) {
        emailError.value = ''
        return true
    }
    
    if (!formData.value.email.endsWith('@gmail.com')) {
        emailError.value = 'Email must contain @gmail.com'
        return false
    }
    
    emailError.value = ''
    return true
}

const formattedDate = computed(() => {
    if (!props.schedule?.date) return ''
    return props.schedule.date
})

const isBooked = computed(() => props.schedule?.status === 'BOOKED')
const isPending = computed(() => props.schedule?.status === 'PENDING')
const isReadOnly = computed(() => isBooked.value || isPending.value)

const validateForm = () => {
    errors.value = {}
    let isValid = true
    const required = ['fullName', 'gender', 'address', 'fatherName', 'motherName', 'birthPlace', 'birthDate', 'phone', 'email']
    
    required.forEach(field => {
        if (!formData.value[field as keyof typeof formData.value]) {
            errors.value[field] = 'Wajib diisi'
            if (field === 'email') emailError.value = 'Wajib diisi'
            isValid = false
        }
    })

    if (!validateEmail()) isValid = false
    
    return isValid
}

const handleSubmit = () => {
    if (!validateForm()) return
    isConfirmOpen.value = true
}

const processSubmission = () => {
    isConfirmOpen.value = false
    isSubmitting.value = true
    try {
        // Prepare payload mapping to backend fields
        const payload = {
            status: 'PENDING',
            applicantName: formData.value.fullName,
            applicantGender: formData.value.gender,
            applicantAddress: formData.value.address,
            applicantFather: formData.value.fatherName,
            applicantMother: formData.value.motherName,
            applicantBirthPlace: formData.value.birthPlace,
            applicantBirthDate: formData.value.birthDate,
            applicantPhone: formData.value.phone,
            applicantEmail: formData.value.email
        }
        
        emit('submit', payload)
    } finally {
        isSubmitting.value = false
    }
}

// Reset form when modal opens with new schedule
watch(() => props.schedule, (newVal) => {
    if (newVal) {
        formData.value = {
            fullName: newVal.applicantName || '',
            gender: newVal.applicantGender || 'Male',
            address: newVal.applicantAddress || '',
            fatherName: newVal.applicantFather || '',
            motherName: newVal.applicantMother || '',
            birthPlace: newVal.applicantBirthPlace || '',
            birthDate: newVal.applicantBirthDate || '',
            phone: newVal.applicantPhone || '',
            email: newVal.applicantEmail || ''
        }
    } else {
        formData.value = {
            fullName: '',
            gender: 'Male',
            address: '',
            fatherName: '',
            motherName: '',
            birthPlace: '',
            birthDate: '',
            phone: '',
            email: ''
        }
    }
}, { immediate: true })
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>

    <!-- Modal Content -->
    <div class="relative bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl p-8">
        <!-- Close Button -->
        <button 
            @click="$emit('close')"
            class="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
            <X class="w-6 h-6" />
        </button>

        <h2 class="text-2xl font-bold text-gray-900 text-center mb-8">Appointment Form</h2>

        <!-- Read-Only Schedule Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Tanggal Test</label>
                <div class="relative">
                    <div class="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 flex items-center justify-between">
                        <span>{{ formattedDate }}</span> <!-- Display raw YYYY-MM-DD or format nicely -->
                        <Calendar class="w-5 h-5 text-gray-400" />
                    </div>
                </div>
            </div>
            
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Jam Mulai</label>
                <div class="relative">
                    <div class="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 flex items-center justify-between">
                        <span>{{ schedule?.time }}</span>
                        <Clock class="w-5 h-5 text-gray-400" />
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Waktu tes sekitar 20-30 menit</p>
                </div>
            </div>
        </div>

        <!-- Form Fields -->
        <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Name -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                    <input 
                        v-model="formData.fullName"
                        type="text"
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 transition-all placeholder:text-gray-300 disabled:bg-gray-100 disabled:text-gray-500"
                        :class="{ 'border-red-500 focus:ring-red-200': errors.fullName }"
                        :disabled="isReadOnly"
                    />
                    <p v-if="errors.fullName" class="text-red-500 text-xs mt-1">{{ errors.fullName }}</p>
                </div>

                <!-- Gender -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
                    <div class="relative">
                        <select 
                            v-model="formData.gender"
                            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 transition-all bg-white appearance-none cursor-pointer disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                            :class="{ 'border-red-500 focus:ring-red-200': errors.gender }"
                            :disabled="isReadOnly"
                        >
                            <option value="Male">Laki-laki</option>
                            <option value="Female">Perempuan</option>
                        </select>
                        <ChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                    <p v-if="errors.gender" class="text-red-500 text-xs mt-1">{{ errors.gender }}</p>
                </div>
            </div>

            <!-- Address -->
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Alamat</label>
                <textarea 
                    v-model="formData.address"
                    rows="3"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 transition-all resize-none placeholder:text-gray-300 disabled:bg-gray-100 disabled:text-gray-500"
                    :class="{ 'border-red-500 focus:ring-red-200': errors.address }"
                    :disabled="isReadOnly"
                ></textarea>
                <p v-if="errors.address" class="text-red-500 text-xs mt-1">{{ errors.address }}</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Parents -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Nama Ayah/Wali</label>
                    <input 
                        v-model="formData.fatherName"
                        type="text"
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 transition-all disabled:bg-gray-100 disabled:text-gray-500"
                        :class="{ 'border-red-500 focus:ring-red-200': errors.fatherName }"
                        :disabled="isReadOnly"
                    />
                    <p v-if="errors.fatherName" class="text-red-500 text-xs mt-1">{{ errors.fatherName }}</p>
                </div>
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Nama Ibu/Wali</label>
                    <input 
                        v-model="formData.motherName"
                        type="text"
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 transition-all disabled:bg-gray-100 disabled:text-gray-500"
                        :class="{ 'border-red-500 focus:ring-red-200': errors.motherName }"
                        :disabled="isReadOnly"
                    />
                    <p v-if="errors.motherName" class="text-red-500 text-xs mt-1">{{ errors.motherName }}</p>
                </div>

                <!-- Birth Info -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Tempat Lahir</label>
                    <input 
                        v-model="formData.birthPlace"
                        type="text"
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 transition-all disabled:bg-gray-100 disabled:text-gray-500"
                        :class="{ 'border-red-500 focus:ring-red-200': errors.birthPlace }"
                        :disabled="isReadOnly"
                    />
                    <p v-if="errors.birthPlace" class="text-red-500 text-xs mt-1">{{ errors.birthPlace }}</p>
                </div>
                 <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
                    <div class="relative">
                        <input 
                            v-model="formData.birthDate"
                            type="date"
                            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 transition-all disabled:bg-gray-100 disabled:text-gray-500"
                            :class="{ 'border-red-500 focus:ring-red-200': errors.birthDate }"
                            :disabled="isReadOnly"
                        />
                    </div>
                    <p v-if="errors.birthDate" class="text-red-500 text-xs mt-1">{{ errors.birthDate }}</p>
                </div>

                 <!-- Contact -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">No Telp</label>
                    <input 
                        v-model="formData.phone"
                        type="number"
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 transition-all disabled:bg-gray-100 disabled:text-gray-500"
                        :class="{ 'border-red-500 focus:ring-red-200': errors.phone }"
                        :disabled="isReadOnly"
                    />
                    <p v-if="errors.phone" class="text-red-500 text-xs mt-1">{{ errors.phone }}</p>
                </div>
                 <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Email</label>
                    <input 
                        v-model="formData.email"
                        type="email"
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 transition-all disabled:bg-gray-100 disabled:text-gray-500"
                        :class="{ 'border-red-500 focus:ring-red-200': emailError }"
                        @blur="validateEmail"
                        :disabled="isReadOnly"
                    />
                     <p v-if="emailError" class="text-red-500 text-xs mt-1">{{ emailError }}</p>
                </div>
            </div>

             <!-- Submit Button -->
            <button 
                @click="handleSubmit"
                :disabled="isSubmitting || isReadOnly"
                class="w-full py-4 rounded-lg text-white text-xl font-medium transition-colors mt-4 bg-[#FF6B6B] hover:bg-[#ff5252] shadow-lg shadow-[#FF6B6B]/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
                {{ isSubmitting ? 'Processing...' : isBooked ? 'Booked' : isPending ? 'Pending Approval' : 'Daftar Sekarang' }}
            </button>
        </div>
    </div>
    
    <ConfirmationModal 
        :is-open="isConfirmOpen" 
        @confirm="processSubmission" 
        @cancel="isConfirmOpen = false" 
    />
  </div>
</template>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input[type=number]::-webkit-outer-spin-button,
input[type=number]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>

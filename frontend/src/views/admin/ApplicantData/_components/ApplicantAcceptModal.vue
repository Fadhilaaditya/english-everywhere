<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import api from '@/api'
import { User, Edit, X } from 'lucide-vue-next'
// Import ConfirmModal from relative path as it's in a sibling view's components
// Alternatively could move to shared components, but for now relative path
import ConfirmModal from '../../Appointment/_components/ConfirmModal.vue'

const props = defineProps<{
  isOpen: boolean
  applicant: any
}>()

const emit = defineEmits(['close', 'submit'])

const formData = ref({
    fullName: '',
    gender: 'Male',
    address: '',
    phone: '',
    email: '',
    birthDate: '',
    level: '',
    username: '',
    password: '',
    fatherName: '',
    motherName: '',
    birthPlace: '',
    scheduleId: null as number | null,
    programId: null as number | null, // To store the specific sub-level ID
    photo: '' // Student photo URL
})

const programs = ref<any[]>([])
const subPrograms = ref<any[]>([])
const selectedParentProgram = ref<any>(null)

const fetchPrograms = async () => {
    try {
        const response = await api.get('/programs')
        programs.value = response.data
        
        // Auto-select parent program based on applicant's current program title
        if (props.applicant?.program?.title) {
            const parent = programs.value.find(p => p.title === props.applicant.program.title)
            if (parent) {
                selectedParentProgram.value = parent
                fetchSubPrograms(parent.id)
            }
        }
    } catch (e) {
        console.error('Failed to fetch programs', e)
    }
}

const fetchSubPrograms = async (parentId: number) => {
    try {
<<<<<<< HEAD
        const response = await fetch(`${API_URL}/programs/${parentId}/levels`)
        if (response.ok) {
            const levels = await response.json()
            if (levels && levels.length > 0) {
                subPrograms.value = levels
                formData.value.programId = null
            } else if (selectedParentProgram.value) {
                // Fallback to parent program
                subPrograms.value = [selectedParentProgram.value]
                formData.value.programId = parentId
            } else {
                subPrograms.value = []
                formData.value.programId = parentId
            }
=======
        const response = await api.get(`/programs/${parentId}/levels`)
        const levels = response.data
        if (levels && levels.length > 0) {
            subPrograms.value = levels
            formData.value.programId = null
        } else if (selectedParentProgram.value) {
            // Fallback to parent program
            subPrograms.value = [selectedParentProgram.value]
            formData.value.programId = parentId
        } else {
            subPrograms.value = []
            formData.value.programId = parentId
>>>>>>> cca89c18e5f74c05ceeb05d7db317bb140bc4dc3
        }
    } catch (e) {
        console.error('Failed to fetch sub-programs', e)
    }
}

watch(selectedParentProgram, (newParent) => {
    if (newParent) {
        formData.value.level = newParent.title
        fetchSubPrograms(newParent.id)
    } else {
        subPrograms.value = []
        formData.value.programId = null
    }
})

// Initialize form when applicant changes
watch(() => props.applicant, (newVal) => {
    if (newVal) {
        formData.value = {
            fullName: newVal.applicantName || '',
            gender: newVal.applicantGender || 'Male',
            address: newVal.applicantAddress || '',
            phone: newVal.applicantPhone || '',
            email: newVal.applicantEmail || '',
            birthDate: newVal.applicantBirthDate || '',
            level: props.applicant.program?.title || '',
            username: '',
            password: '',
            fatherName: newVal.applicantFather || '',
            motherName: newVal.applicantMother || '',
            birthPlace: newVal.applicantBirthPlace || '',
            scheduleId: newVal.id,
            programId: null,
            photo: newVal.applicantPhoto || ''
        }
    }
}, { immediate: true })

const isUploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const triggerFileInput = () => {
    fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    isUploading.value = true
    const body = new FormData()
    body.append('image', file)

    try {
        const response = await api.post('/upload', body)
        formData.value.photo = response.data.secure_url
    } catch (error) {
        console.error('Error uploading image:', error)
        alert('Failed to upload photo')
    } finally {
        isUploading.value = false
    }
}

const isSubmitting = ref(false)
const isConfirmOpen = ref(false)

onMounted(() => {
    fetchPrograms()
})

const handleSubmit = () => {
    // Basic validation
    if (!formData.value.username || !formData.value.password) {
        alert('Please fill in username and password')
        return
    }

    // Open Confirmation Modal
    isConfirmOpen.value = true
}

const executeCreateAccount = async () => {
    // Close confirmation modal
    isConfirmOpen.value = false
    
    isSubmitting.value = true
    try {
        const response = await api.post('/students/account', formData.value)
        emit('submit', response.data)
    } catch (e: any) {
        alert(e.response?.data?.message || e.message)
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>

    <!-- Modal Content -->
    <div class="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div class="p-8">
            <h2 class="text-2xl font-bold text-center text-gray-900 mb-8">Create Student Account</h2>

            <!-- Photo Upload -->
            <div class="flex flex-col items-center mb-8">
                <input 
                    ref="fileInput"
                    type="file" 
                    accept="image/*"
                    class="hidden"
                    @change="handleFileUpload"
                />
                <div class="w-28 h-28 rounded-full border-2 border-gray-100 flex items-center justify-center mb-4 overflow-hidden relative group">
                    <img v-if="formData.photo" :src="formData.photo" class="w-full h-full object-cover" />
                    <User v-else class="w-12 h-12 text-gray-400" />
                    
                    <!-- Loading Overlay -->
                    <div v-if="isUploading" class="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </div>
                <button 
                    @click="triggerFileInput"
                    :disabled="isUploading"
                    class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                    {{ isUploading ? 'Uploading...' : 'Upload New Photo' }}
                </button>
            </div>

            <!-- Form -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Full Name -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Full Name</label>
                    <input 
                        v-model="formData.fullName"
                        type="text" 
                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50"
                    />
                </div>

                <!-- Gender -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Gender</label>
                    <select 
                        v-model="formData.gender"
                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 bg-white"
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>

                <!-- Address (Full width) -->
                <div class="md:col-span-2 space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Alamat</label>
                    <textarea 
                        v-model="formData.address"
                        rows="2"
                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 resize-none"
                    ></textarea>
                </div>

                <!-- Phone -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">No Telp</label>
                    <div class="relative">
                        <input 
                            v-model="formData.phone"
                            type="text" 
                            class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50"
                        />
                         <Edit class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                </div>

                <!-- Email -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Email</label>
                    <div class="relative">
                        <input 
                            v-model="formData.email"
                            type="email" 
                            class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50"
                        />
                         <Edit class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                </div>

                <!-- Birth Date -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
                    <input 
                        v-model="formData.birthDate"
                        type="date" 
                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50"
                    />
                </div>

                 <!-- Level (Rename to Programs) -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Program Series</label>
                    <select 
                        v-model="selectedParentProgram"
                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 bg-white"
                    >
                        <option :value="null" disabled>Select Program Series</option>
                        <option v-for="program in programs" :key="program.id" :value="program">
                            {{ program.title }}
                        </option>
                    </select>
                </div>

                <!-- Specific Level -->
                <div v-if="subPrograms.length > 0" class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Specific Level</label>
                    <select 
                        v-model="formData.programId"
                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 bg-white"
                    >
                        <option :value="null" disabled>Select Level</option>
                        <option v-for="level in subPrograms" :key="level.id" :value="level.id">
                            {{ level.title }}
                        </option>
                    </select>
                </div>

                <!-- Username -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Username<span class="text-red-500">*</span></label>
                    <input 
                        v-model="formData.username"
                        type="text" 
                        placeholder="username"
                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50"
                    />
                </div>

                <!-- Password -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Password<span class="text-red-500">*</span></label>
                    <input 
                        v-model="formData.password"
                        type="password" 
                        placeholder="password"
                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50"
                    />
                </div>
            </div>

            <!-- Actions -->
            <div class="grid grid-cols-2 gap-4 mt-8 pt-4">
                <button 
                    @click="$emit('close')"
                    class="w-full px-4 py-3 rounded-lg border border-[#F4838D] text-[#F4838D] text-lg font-medium hover:bg-red-50 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    @click="handleSubmit"
                    :disabled="isSubmitting"
                    class="w-full px-4 py-3 rounded-lg bg-[#4FD1C5] text-white text-lg font-medium hover:bg-[#3dbdb0] transition-colors shadow-lg shadow-[#4FD1C5]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {{ isSubmitting ? 'Creating...' : 'Create Account' }}
                </button>
            </div>
        </div>
    </div>

    <ConfirmModal 
        :is-open="isConfirmOpen"
        title="Create Student Account"
        message="Are you sure you want to create this student account? This will create a user login and student profile."
        confirm-text="Create Account"
        type="info"
        :is-loading="isSubmitting"
        @close="isConfirmOpen = false"
        @confirm="executeCreateAccount"
    />
  </div>
</template>

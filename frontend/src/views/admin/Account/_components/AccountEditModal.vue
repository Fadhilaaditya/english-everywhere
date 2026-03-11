<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { User, Edit, X, Eye, EyeOff } from 'lucide-vue-next'
import ConfirmationModal from './ConfirmationModal.vue'
import CustomDropdown from '@/components/CustomDropdown.vue'

const props = defineProps<{
  isOpen: boolean
  account?: any
}>()

const emit = defineEmits(['close', 'submit'])

const isEditMode = computed(() => !!props.account && Object.keys(props.account).length > 0)
const title = computed(() => isEditMode.value ? 'Edit Account' : 'Create Account')
const isLoading = ref(false)

const formData = ref({
    fullName: '',
    gender: 'Female',
    address: '',
    phone: '',
    email: '',
    birthDate: '',
    course: 'Intermediate (B1)',
    username: '',
    password: '',
    photo: '',
    role: 'student',
    specialization: '',
    programId: null as number | null // Sub-level ID
})

const showPassword = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const previewUrl = ref('')
const courses = ref<any[]>([])
const subPrograms = ref<any[]>([])
const selectedParentProgram = ref<any>(null)

const genderOptions = ['Male', 'Female']
const roleOptions = [
    { label: 'Student', value: 'student' },
    { label: 'Teacher', value: 'teacher' }
]

const fetchCourses = async () => {
    try {
        const response = await fetch('http://localhost:3001/api/programs')
        if (response.ok) {
            courses.value = await response.json()
            
            // If in edit mode, try to find and set the parent program
            if (isEditMode.value && props.account?.fullData?.studentProfile?.program) {
                const studentProgram = props.account.fullData.studentProfile.program
                // If it's a child program, its 'parent' property should exist (via association)
                const parent = studentProgram.parent || studentProgram 
                
                selectedParentProgram.value = courses.value.find((p: any) => p.id === parent.id)
                if (selectedParentProgram.value) {
                    fetchSubPrograms(selectedParentProgram.value.id)
                }
            }
        }
    } catch (e) {
        console.error('Failed to fetch courses', e)
    }
}

const fetchSubPrograms = async (parentId: number) => {
    try {
        const response = await fetch(`http://localhost:3001/api/programs/${parentId}/levels`)
        if (response.ok) {
            subPrograms.value = await response.json()
            // If we are initializing from props, don't reset the programId yet
        }
    } catch (e) {
        console.error('Failed to fetch sub-programs', e)
    }
}

watch(selectedParentProgram, (newParent) => {
    if (newParent) {
        formData.value.course = newParent.title
        fetchSubPrograms(newParent.id)
    } else {
        subPrograms.value = []
        formData.value.programId = null
    }
})

// Initialize form when account changes
watch(() => props.account, (newVal) => {
    if (newVal && newVal.fullData) {
        // Edit mode - Fill data from DB
        const data = newVal.fullData
        const isStudent = data.role === 'student'
        const profile = isStudent ? data.studentProfile : data.teacherProfile
        
        formData.value = {
            fullName: data.fullName || (profile ? profile.name : ''),
            gender: profile ? profile.gender : 'Female',
            address: profile ? profile.address : '',
            phone: profile ? profile.phoneNumber : '',
            email: profile ? profile.email : '',
            birthDate: profile ? profile.birthDate : '',
            course: profile && profile.course ? profile.course : '',
            username: data.username || '',
            password: '', // Don't fill password
            photo: data.photo || '',
            role: data.role || 'student',
            specialization: profile ? profile.specialization : '',
            programId: profile ? profile.programId : null
        }
        previewUrl.value = '' // Reset preview
    } else {
        // Create mode or Reset
        formData.value = {
            fullName: '',
            gender: 'Female',
            address: '',
            phone: '',
            email: '',
            birthDate: '',
            course: '',
            username: '',
            password: '',
            photo: '',
            role: 'student',
            specialization: '',
            programId: null
        }
        previewUrl.value = ''
    }
}, { immediate: true })

onMounted(() => {
    fetchCourses()
})

const triggerFileUpload = () => {
    fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    previewUrl.value = URL.createObjectURL(file)

    const uploadData = new FormData()
    uploadData.append('image', file)

    try {
        isLoading.value = true
        const response = await fetch('http://localhost:3001/api/upload', {
            method: 'POST',
            body: uploadData
        })

        if (response.ok) {
            const data = await response.json()
            formData.value.photo = data.secure_url
        } else {
            throw new Error('Upload failed')
        }
    } catch (e) {
        console.error('Photo upload error:', e)
    } finally {
        isLoading.value = false
    }
}

const isConfirmOpen = ref(false)

const handleSubmit = () => {
    isConfirmOpen.value = true
}

const processSubmission = async () => {
    isConfirmOpen.value = false // Close confirm modal
    isLoading.value = true
    try {
        const url = isEditMode.value 
            ? `http://localhost:3001/api/users/${props.account.id}`
            : `http://localhost:3001/api/users`
            
        const method = isEditMode.value ? 'PUT' : 'POST'
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData.value)
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Failed to process account')
        }
        
        emit('submit', formData.value)
        emit('close')
    } catch (e: any) {
        console.error('Error processing account:', e)
        alert(e.message || 'Something went wrong')
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>

    <!-- Modal Content -->
    <div class="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <!-- Close Button (X) -->
        <button 
            @click="$emit('close')"
            class="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
            <X class="w-6 h-6" />
        </button>

        <div class="p-8">
            <h2 class="text-2xl font-bold text-center text-gray-900 mb-8">{{ title }}</h2>

            <!-- Photo Upload -->
            <div class="flex flex-col items-center mb-8">
                <input 
                    ref="fileInput"
                    type="file" 
                    accept="image/*"
                    class="hidden" 
                    @change="handleFileUpload"
                />
                <div class="w-24 h-24 rounded-full border-2 border-gray-200 flex items-center justify-center mb-4 overflow-hidden bg-gray-50">
                    <img v-if="formData.photo || previewUrl" :src="previewUrl || formData.photo" class="w-full h-full object-cover" />
                    <User v-else class="w-12 h-12 text-gray-400" />
                </div>
                <button 
                    @click="triggerFileUpload"
                    class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    {{ formData.photo ? 'Change Photo' : 'Upload New Photo' }}
                </button>
            </div>

            <!-- Form -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Full Name -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Full Name</label>
                    <div class="relative">
                        <input 
                            v-model="formData.fullName"
                            type="text" 
                            class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50"
                        />
                         <Edit class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                </div>

                <!-- Gender -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Gender</label>
                    <CustomDropdown 
                        v-model="formData.gender"
                        :options="genderOptions"
                        placeholder="Select Gender"
                    />
                </div>

                <!-- Role Selection (NEW) -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Role Selection</label>
                    <CustomDropdown 
                        v-model="formData.role"
                        :options="roleOptions"
                        :disabled="isEditMode"
                        placeholder="Select Role"
                    />
                </div>

                <!-- Address (Full width) -->
                <div class="md:col-span-2 space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Alamat</label>
                    <div class="relative">
                        <textarea 
                            v-model="formData.address"
                            rows="2"
                            class="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50 resize-none"
                        ></textarea>
                         <Edit class="absolute right-3 top-4 w-4 h-4 text-gray-400" />
                    </div>
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

                 <!-- Course (Student) -->
                <div v-if="formData.role === 'student'" class="space-y-4 md:col-span-2">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-gray-700">Program Series</label>
                            <CustomDropdown 
                                v-model="selectedParentProgram"
                                :options="courses"
                                label-key="title"
                                placeholder="Select Program Series"
                            />
                        </div>

                        <div v-if="subPrograms.length > 0" class="space-y-2">
                            <label class="block text-sm font-medium text-gray-700">Specific Level</label>
                            <CustomDropdown 
                                v-model="formData.programId"
                                :options="subPrograms"
                                label-key="title"
                                value-key="id"
                                placeholder="Select Level"
                            />
                        </div>
                    </div>
                </div>

                <!-- Specialization (Teacher) -->
                <div v-else class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Specialization</label>
                    <div class="relative">
                        <input 
                            v-model="formData.specialization"
                            type="text" 
                            placeholder="e.g. TOEFL iBT, Business English"
                            class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50"
                        />
                         <Edit class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
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
                    <label class="block text-sm font-medium text-gray-700">Password</label>
                    <div class="relative">
                        <input 
                            v-model="formData.password"
                            :type="showPassword ? 'text' : 'password'" 
                            placeholder="Leave blank to keep current"
                            class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4FD1C5]/50"
                        />
                        <button 
                            type="button"
                            @click="showPassword = !showPassword"
                            class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <Eye v-if="!showPassword" class="w-4 h-4" />
                            <EyeOff v-else class="w-4 h-4" />
                        </button>
                    </div>
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
                    :disabled="isLoading"
                    class="w-full px-4 py-3 rounded-lg bg-[#4FD1C5] text-white text-lg font-medium hover:bg-[#3dbdb0] transition-colors shadow-lg shadow-[#4FD1C5]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {{ isLoading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Account') }}
                </button>
            </div>
        </div>
    </div>
    
    <ConfirmationModal 
        :is-open="isConfirmOpen"
        title="Save Changes"
        message="Are you sure you want to save these changes to the account?"
        confirm-text="Save"
        @close="isConfirmOpen = false"
        @confirm="processSubmission"
    />
  </div>
</template>
